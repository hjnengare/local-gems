-- migration: 2025-09-19_profiles_complete_schema.sql
-- Complete profiles schema that matches the profile page requirements

-- 1. Drop existing profiles table to recreate with full structure
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create comprehensive profiles table
CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic profile info
  username text UNIQUE,
  display_name text,
  avatar_url text,
  locale text DEFAULT 'en-ZA',

  -- Onboarding and status
  onboarding_step text DEFAULT 'start',
  is_top_reviewer boolean DEFAULT false,

  -- Stats counters
  reviews_count int DEFAULT 0,
  badges_count int DEFAULT 0,
  interests_count int DEFAULT 0,

  -- Timestamps
  last_interests_updated timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text NOT NULL,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- 5. Create user_achievements junction table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

-- 6. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- 7. RLS policies for profiles
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "profiles select own" ON public.profiles;
  DROP POLICY IF EXISTS "profiles insert own" ON public.profiles;
  DROP POLICY IF EXISTS "profiles update own" ON public.profiles;
  DROP POLICY IF EXISTS "read own profile" ON public.profiles;
  DROP POLICY IF EXISTS "update own profile" ON public.profiles;

  -- Create new policies
  CREATE POLICY "profiles select own" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "profiles insert own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "profiles update own" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END$$;

-- 8. RLS policies for reviews
DO $$
BEGIN
  DROP POLICY IF EXISTS "reviews select own" ON public.reviews;
  DROP POLICY IF EXISTS "reviews insert own" ON public.reviews;
  DROP POLICY IF EXISTS "reviews update own" ON public.reviews;
  DROP POLICY IF EXISTS "reviews delete own" ON public.reviews;

  CREATE POLICY "reviews select own" ON public.reviews
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "reviews insert own" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "reviews update own" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "reviews delete own" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);
END$$;

-- 9. RLS policies for achievements (public read)
DO $$
BEGIN
  DROP POLICY IF EXISTS "achievements select all" ON public.achievements;

  CREATE POLICY "achievements select all" ON public.achievements
    FOR SELECT USING (true);
END$$;

-- 10. RLS policies for user_achievements
DO $$
BEGIN
  DROP POLICY IF EXISTS "user_achievements select own" ON public.user_achievements;
  DROP POLICY IF EXISTS "user_achievements insert own" ON public.user_achievements;
  DROP POLICY IF EXISTS "user_achievements delete own" ON public.user_achievements;

  CREATE POLICY "user_achievements select own" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "user_achievements insert own" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "user_achievements delete own" ON public.user_achievements
    FOR DELETE USING (auth.uid() = user_id);
END$$;

-- 11. Seed achievements data
INSERT INTO public.achievements (id, name, description, icon, category) VALUES
  ('trust-expert', 'Trust Expert', 'Verified expert contributor with high-quality reviews', 'shield-checkmark', 'expertise'),
  ('top-reviewer-march-2023', 'Top Reviewer in Cape Town March 2023', 'Highest rated reviewer in Cape Town for March 2023', 'trophy', 'achievement'),
  ('local-explorer', 'Local Explorer', 'Discovered and reviewed 25+ local businesses', 'location', 'exploration'),
  ('community-builder', 'Community Builder', 'Helped 100+ people discover great places', 'people', 'community'),
  ('early-adopter', 'Early Adopter', 'One of the first 1000 users on KLIO', 'rocket', 'milestone')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category;

-- 12. Auto-create profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$fn$;

-- 13. Create trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 14. Function to update profile stats
CREATE OR REPLACE FUNCTION public.sync_profile_stats()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get the user_id from the operation
  target_user_id := COALESCE(NEW.user_id, OLD.user_id);

  -- Update all stats for this user
  UPDATE public.profiles SET
    reviews_count = (
      SELECT COUNT(*) FROM public.reviews
      WHERE user_id = target_user_id
    ),
    badges_count = (
      SELECT COUNT(*) FROM public.user_achievements
      WHERE user_id = target_user_id
    ),
    interests_count = (
      SELECT COUNT(*) FROM public.user_interests
      WHERE user_id = target_user_id
    ),
    updated_at = now()
  WHERE user_id = target_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$fn$;

-- 15. Create triggers to auto-update stats
DROP TRIGGER IF EXISTS sync_profile_stats_reviews ON public.reviews;
CREATE TRIGGER sync_profile_stats_reviews
  AFTER INSERT OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_stats();

DROP TRIGGER IF EXISTS sync_profile_stats_achievements ON public.user_achievements;
CREATE TRIGGER sync_profile_stats_achievements
  AFTER INSERT OR DELETE ON public.user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_stats();

DROP TRIGGER IF EXISTS sync_profile_stats_interests ON public.user_interests;
CREATE TRIGGER sync_profile_stats_interests
  AFTER INSERT OR DELETE ON public.user_interests
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_stats();

-- 16. Performance indexes
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_onboarding_step_idx ON public.profiles(onboarding_step);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS user_achievements_user_id_idx ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS user_achievements_achievement_id_idx ON public.user_achievements(achievement_id);

-- 17. Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO anon, authenticated;
GRANT SELECT ON public.achievements TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_achievements TO anon, authenticated;