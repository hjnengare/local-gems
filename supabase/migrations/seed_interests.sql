-- Seed the interests table with the expected data
-- This ensures the frontend selections match database IDs

-- First, create the interests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.interests (
  id text PRIMARY KEY,        -- 'food-drink'
  name text NOT NULL          -- 'Food & Drink'
);

-- Insert the interests data
INSERT INTO public.interests (id, name) VALUES
('food-drink', 'Food & Drink'),
('beauty-wellness', 'Beauty & Wellness'),
('home-services', 'Home & Services'),
('outdoors-adventure', 'Outdoors & Adventure'),
('nightlife-entertainment', 'Nightlife & Entertainment'),
('arts-culture', 'Arts & Culture'),
('family-pets', 'Family & Pets'),
('shopping-lifestyle', 'Shopping & Lifestyle')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Grant read access to authenticated users
GRANT SELECT ON public.interests TO anon, authenticated;