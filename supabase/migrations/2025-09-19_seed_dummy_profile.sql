-- migration: 2025-09-19_seed_dummy_profile.sql
-- Seed dummy profile data for testing the profile page

-- First, we need to create a dummy auth user in the auth.users table
-- Note: In production, this would be handled by Supabase Auth, but for testing we can insert directly

-- 1. Insert dummy user into auth.users (if not exists)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'john.foodie@example.com',
  crypt('testpassword123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"username": "johnfoodie"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert comprehensive dummy profile
INSERT INTO public.profiles (
  user_id,
  username,
  display_name,
  avatar_url,
  locale,
  onboarding_step,
  is_top_reviewer,
  reviews_count,
  badges_count,
  interests_count,
  last_interests_updated,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'johnfoodie',
  'John Thompson',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  'en-ZA',
  'complete',
  true,
  12,
  4,
  8,
  now() - interval '2 days',
  now() - interval '8 months',
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.display_name,
  avatar_url = EXCLUDED.avatar_url,
  locale = EXCLUDED.locale,
  onboarding_step = EXCLUDED.onboarding_step,
  is_top_reviewer = EXCLUDED.is_top_reviewer,
  reviews_count = EXCLUDED.reviews_count,
  badges_count = EXCLUDED.badges_count,
  interests_count = EXCLUDED.interests_count,
  last_interests_updated = EXCLUDED.last_interests_updated,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

-- 3. Insert dummy interests (make sure interests table exists first)
INSERT INTO public.interests (id, name, category, description) VALUES
  ('food-drink', 'Food & Drink', 'lifestyle', 'Restaurants, cafes, bars, and culinary experiences'),
  ('arts-culture', 'Arts & Culture', 'entertainment', 'Museums, galleries, theaters, and cultural events'),
  ('outdoor-adventure', 'Outdoor & Adventure', 'activities', 'Hiking, camping, sports, and outdoor activities'),
  ('shopping-retail', 'Shopping & Retail', 'lifestyle', 'Stores, markets, and shopping experiences'),
  ('health-wellness', 'Health & Wellness', 'lifestyle', 'Spas, gyms, yoga studios, and wellness centers'),
  ('nightlife-entertainment', 'Nightlife & Entertainment', 'entertainment', 'Bars, clubs, live music, and nightlife'),
  ('family-kids', 'Family & Kids', 'lifestyle', 'Family-friendly activities and kid-focused venues'),
  ('professional-services', 'Professional Services', 'services', 'Business services, consultants, and professional help')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description;

-- 4. Link user to interests
INSERT INTO public.user_interests (user_id, interest_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'food-drink'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'arts-culture'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'outdoor-adventure'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'shopping-retail'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'health-wellness'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'nightlife-entertainment'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'family-kids'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'professional-services')
ON CONFLICT (user_id, interest_id) DO NOTHING;

-- 5. Insert dummy reviews
INSERT INTO public.reviews (
  id,
  user_id,
  business_name,
  rating,
  review_text,
  is_featured,
  created_at,
  updated_at
) VALUES
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'La Colombe Coffee', 5, 'Absolutely amazing coffee and atmosphere. The baristas know their craft and the pastries are to die for. Perfect spot for a morning meeting or weekend brunch.', true, now() - interval '2 days', now() - interval '2 days'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Kloof Street House', 4, 'Great vibe and excellent cocktails. The rooftop terrace has stunning views of the city. Food was good but service could be a bit faster during peak hours.', false, now() - interval '1 week', now() - interval '1 week'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Zeitz Museum of Contemporary African Art', 5, 'Incredible architecture and fascinating exhibitions. A must-visit for anyone interested in contemporary African art. Plan to spend at least 3 hours here.', true, now() - interval '2 weeks', now() - interval '2 weeks'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Table Mountain National Park', 5, 'Breathtaking views and well-maintained hiking trails. Go early in the morning to avoid crowds. The cable car is convenient but hiking up is much more rewarding.', false, now() - interval '3 weeks', now() - interval '3 weeks'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'V&A Waterfront', 4, 'Great shopping and dining options with beautiful harbor views. Can get quite crowded on weekends but there''s something for everyone here.', false, now() - interval '1 month', now() - interval '1 month'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'The Test Kitchen', 5, 'Exceptional fine dining experience. Every course was perfectly executed and the wine pairings were spot on. Expensive but worth every penny for special occasions.', true, now() - interval '6 weeks', now() - interval '6 weeks'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Camps Bay Beach', 4, 'Beautiful white sand beach with stunning mountain backdrop. Great for sunbathing and people watching. Parking can be challenging during summer.', false, now() - interval '2 months', now() - interval '2 months'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Greenmarket Square', 3, 'Good for souvenir shopping and local crafts. Prices are negotiable but quality varies. Better to visit on weekdays when it''s less crowded.', false, now() - interval '3 months', now() - interval '3 months'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Cape Point Vineyards', 5, 'Spectacular wine tasting experience with panoramic views. The staff is knowledgeable and passionate about their wines. Perfect for a romantic afternoon.', false, now() - interval '4 months', now() - interval '4 months'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Two Oceans Aquarium', 4, 'Fascinating marine life exhibits, especially the kelp forest and shark tank. Great for families with kids. The penguin exhibit is adorable.', false, now() - interval '5 months', now() - interval '5 months'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Long Street', 4, 'Vibrant nightlife strip with great bars and live music venues. Can get quite rowdy late at night but perfect for bar hopping with friends.', false, now() - interval '6 months', now() - interval '6 months'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Kirstenbosch Botanical Gardens', 5, 'Absolutely stunning gardens with incredible plant diversity. The summer concerts on the lawn are magical. A peaceful escape from city life.', true, now() - interval '7 months', now() - interval '7 months')
ON CONFLICT (id) DO NOTHING;

-- 6. Award user achievements
INSERT INTO public.user_achievements (user_id, achievement_id, earned_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'trust-expert', now() - interval '1 month'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'top-reviewer-march-2023', now() - interval '6 months'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'local-explorer', now() - interval '3 months'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'early-adopter', now() - interval '8 months')
ON CONFLICT (user_id, achievement_id) DO NOTHING;

-- 7. Create user_interests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_interests (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_id text NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, interest_id)
);

-- Enable RLS on user_interests
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_interests
DO $$
BEGIN
  DROP POLICY IF EXISTS "user_interests select own" ON public.user_interests;
  DROP POLICY IF EXISTS "user_interests insert own" ON public.user_interests;
  DROP POLICY IF EXISTS "user_interests delete own" ON public.user_interests;

  CREATE POLICY "user_interests select own" ON public.user_interests
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "user_interests insert own" ON public.user_interests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "user_interests delete own" ON public.user_interests
    FOR DELETE USING (auth.uid() = user_id);
END$$;

-- 8. Create interests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.interests (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text DEFAULT 'general',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on interests (public read)
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "interests select all" ON public.interests;

  CREATE POLICY "interests select all" ON public.interests
    FOR SELECT USING (true);
END$$;

-- 9. Grant permissions
GRANT SELECT, INSERT, DELETE ON public.user_interests TO anon, authenticated;
GRANT SELECT ON public.interests TO anon, authenticated;

-- 10. Performance indexes
CREATE INDEX IF NOT EXISTS user_interests_user_id_idx ON public.user_interests(user_id);
CREATE INDEX IF NOT EXISTS user_interests_interest_id_idx ON public.user_interests(interest_id);

-- 11. Update profile stats trigger to include interests
DROP TRIGGER IF EXISTS sync_profile_stats_interests ON public.user_interests;
CREATE TRIGGER sync_profile_stats_interests
  AFTER INSERT OR DELETE ON public.user_interests
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_stats();

-- 12. Manually update the dummy user's stats to ensure consistency
UPDATE public.profiles SET
  reviews_count = (
    SELECT COUNT(*) FROM public.reviews
    WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'::uuid
  ),
  badges_count = (
    SELECT COUNT(*) FROM public.user_achievements
    WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'::uuid
  ),
  interests_count = (
    SELECT COUNT(*) FROM public.user_interests
    WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'::uuid
  ),
  updated_at = now()
WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'::uuid;

-- 13. Verification queries (for testing)
-- Uncomment these to verify the seed data after running the migration

-- SELECT 'Profile Data' as check_type, count(*) as count FROM public.profiles WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'::uuid
-- UNION ALL
-- SELECT 'Reviews Data' as check_type, count(*) as count FROM public.reviews WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'::uuid
-- UNION ALL
-- SELECT 'Achievements Data' as check_type, count(*) as count FROM public.user_achievements WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'::uuid
-- UNION ALL
-- SELECT 'Interests Data' as check_type, count(*) as count FROM public.user_interests WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'::uuid;