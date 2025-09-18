-- Required Database Setup for KLIO
-- Run these commands in your Supabase SQL editor

-- 1. Create the atomic replace function for user interests
CREATE OR REPLACE FUNCTION public.replace_user_interests(
  p_user_id uuid,
  p_interest_ids text[]
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Remove all current rows for this user
  DELETE FROM public.user_interests WHERE user_id = p_user_id;

  -- Insert new rows (if p_interest_ids is empty, insert nothing)
  IF array_length(p_interest_ids, 1) > 0 THEN
    INSERT INTO public.user_interests (user_id, interest_id)
    SELECT p_user_id, unnest(p_interest_ids);
  END IF;
END;
$$;

-- Grant execute permissions for the interests function
REVOKE ALL ON FUNCTION public.replace_user_interests(uuid, text[]) FROM public;
GRANT EXECUTE ON FUNCTION public.replace_user_interests(uuid, text[]) TO anon, authenticated;

-- 2. Enable RLS on user_interests table
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies for user_interests
CREATE POLICY "read own interests"
  ON public.user_interests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insert own interests"
  ON public.user_interests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete own interests"
  ON public.user_interests FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS policies for profiles table
CREATE POLICY "read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Ensure profiles table has correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  locale text DEFAULT 'en-ZA',
  onboarding_step text DEFAULT 'start',
  interests_count int DEFAULT 0,
  last_interests_updated timestamptz,
  dealbreakers text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. Auto-create profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$;

-- 8. Create trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Auto-update profile metadata when interests change
CREATE OR REPLACE FUNCTION public.sync_profile_interest_meta()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.profiles
     SET interests_count = (
           SELECT count(*) FROM public.user_interests ui WHERE ui.user_id = coalesce(new.user_id, old.user_id)
         ),
         last_interests_updated = now(),
         updated_at = now()
   WHERE user_id = coalesce(new.user_id, old.user_id);
  RETURN null;
END;
$$;

-- 10. Create trigger for interest metadata sync
DROP TRIGGER IF EXISTS user_interests_after_change ON public.user_interests;
CREATE TRIGGER user_interests_after_change
AFTER INSERT OR DELETE ON public.user_interests
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_interest_meta();

-- 11. Performance indexes
CREATE INDEX IF NOT EXISTS user_interests_user_id_idx
  ON public.user_interests(user_id);

CREATE INDEX IF NOT EXISTS profiles_onboarding_step_idx
  ON public.profiles(onboarding_step);

-- 12. Create the atomic replace function for user subcategories
CREATE OR REPLACE FUNCTION public.replace_user_subcategories(
  p_user_id uuid,
  p_subcategory_ids text[]
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Remove all current rows for this user
  DELETE FROM public.user_subcategories WHERE user_id = p_user_id;

  -- Insert new rows (if p_subcategory_ids is empty, insert nothing)
  IF array_length(p_subcategory_ids, 1) > 0 THEN
    INSERT INTO public.user_subcategories (user_id, subcategory_id)
    SELECT p_user_id, unnest(p_subcategory_ids);
  END IF;
END;
$$;

-- Grant execute permissions for the subcategories function
REVOKE ALL ON FUNCTION public.replace_user_subcategories(uuid, text[]) FROM public;
GRANT EXECUTE ON FUNCTION public.replace_user_subcategories(uuid, text[]) TO anon, authenticated;

-- 13. Enable RLS on user_subcategories table
ALTER TABLE public.user_subcategories ENABLE ROW LEVEL SECURITY;

-- 14. RLS policies for user_subcategories
CREATE POLICY "read own subcategories"
  ON public.user_subcategories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insert own subcategories"
  ON public.user_subcategories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete own subcategories"
  ON public.user_subcategories FOR DELETE
  USING (auth.uid() = user_id);

-- 15. Enable RLS on subcategories catalog table
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read subcategories"
  ON public.subcategories FOR SELECT
  USING (true);

-- 16. Seed data for interests table
INSERT INTO public.interests (id, name) VALUES
  ('food-drink', 'Food & Drink'),
  ('beauty-wellness', 'Beauty & Wellness'),
  ('home-services', 'Home & Services'),
  ('outdoors-adventure', 'Outdoors & Adventure'),
  ('nightlife-entertainment', 'Nightlife & Entertainment'),
  ('arts-culture', 'Arts & Culture'),
  ('family-pets', 'Family & Pets'),
  ('shopping-lifestyle', 'Shopping & Lifestyle')
ON CONFLICT (id) DO NOTHING;

-- 17. Deal-breakers catalog tables
CREATE TABLE IF NOT EXISTS public.deal_breaker_categories (
  id text PRIMARY KEY,       -- e.g., 'global'
  name text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.deal_breakers (
  id text PRIMARY KEY,       -- 'trust', 'punctuality'...
  label text NOT NULL,
  icon text NOT NULL,        -- 'shield-checkmark-outline' etc.
  category_id text NOT NULL REFERENCES public.deal_breaker_categories(id) ON DELETE CASCADE
);

-- 18. RLS for deal-breakers catalog (read-only for everyone)
ALTER TABLE public.deal_breaker_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_breakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read categories" ON public.deal_breaker_categories FOR SELECT USING (true);
CREATE POLICY "read deal breakers" ON public.deal_breakers FOR SELECT USING (true);

-- 19. User deal-breakers join table
CREATE TABLE IF NOT EXISTS public.user_deal_breakers (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_breaker_id text NOT NULL REFERENCES public.deal_breakers(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, deal_breaker_id)
);

-- 20. RLS for user deal-breakers
ALTER TABLE public.user_deal_breakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own udb"
  ON public.user_deal_breakers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insert own udb"
  ON public.user_deal_breakers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete own udb"
  ON public.user_deal_breakers FOR DELETE
  USING (auth.uid() = user_id);

-- 21. Performance index for user deal-breakers
CREATE INDEX IF NOT EXISTS user_deal_breakers_user_id_idx
  ON public.user_deal_breakers (user_id);

-- 22. Seed deal-breaker categories
INSERT INTO public.deal_breaker_categories (id, name)
VALUES ('global', 'Global')
ON CONFLICT (id) DO UPDATE SET name = excluded.name;

-- 23. Seed deal-breakers data
INSERT INTO public.deal_breakers (id, label, icon, category_id) VALUES
  ('trust',        'Trust',        'shield-checkmark-outline', 'global'),
  ('punctuality',  'Punctuality',  'time-outline',             'global'),
  ('friendliness', 'Friendliness', 'happy-outline',            'global'),
  ('pricing',      'Pricing',      'pricetag-outline',         'global')
ON CONFLICT (id) DO UPDATE
  SET label = excluded.label,
      icon  = excluded.icon,
      category_id = excluded.category_id;