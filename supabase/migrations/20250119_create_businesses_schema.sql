-- migration: 2025-01-19_create_businesses_schema.sql

-- 1) Create businesses table matching BusinessCard component structure
CREATE TABLE IF NOT EXISTS public.businesses (
  id text PRIMARY KEY,
  name text NOT NULL,
  image text NOT NULL,
  alt text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 0 AND rating <= 5), -- 0-5 stars
  total_rating decimal(2,1) NOT NULL CHECK (total_rating >= 0 AND total_rating <= 5), -- e.g. 4.7
  reviews integer NOT NULL DEFAULT 0,
  badge text, -- e.g., "Trending", "New", "Hot", "Popular"
  href text,

  -- Percentiles for service, price, ambience (0-100)
  service_percentile integer CHECK (service_percentile >= 0 AND service_percentile <= 100),
  price_percentile integer CHECK (price_percentile >= 0 AND price_percentile <= 100),
  ambience_percentile integer CHECK (ambience_percentile >= 0 AND ambience_percentile <= 100),

  verified boolean NOT NULL DEFAULT false,
  distance text, -- e.g., "0.3 mi"
  price_range text, -- e.g., "$", "$$", "$$$", "$$$$"

  -- Additional metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Enable RLS and create policies
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "businesses public read" ON public.businesses;
CREATE POLICY "businesses public read"
  ON public.businesses
  FOR SELECT
  USING (true);

-- 3) Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS businesses_category_idx ON public.businesses(category);
CREATE INDEX IF NOT EXISTS businesses_location_idx ON public.businesses(location);
CREATE INDEX IF NOT EXISTS businesses_rating_idx ON public.businesses(total_rating DESC);
CREATE INDEX IF NOT EXISTS businesses_reviews_idx ON public.businesses(reviews DESC);
CREATE INDEX IF NOT EXISTS businesses_verified_idx ON public.businesses(verified);
CREATE INDEX IF NOT EXISTS businesses_badge_idx ON public.businesses(badge) WHERE badge IS NOT NULL;
CREATE INDEX IF NOT EXISTS businesses_created_at_idx ON public.businesses(created_at DESC);

-- 4) Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

DROP TRIGGER IF EXISTS update_businesses_updated_at ON public.businesses;
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Seed dummy business data from "For You" section
INSERT INTO public.businesses (
  id, name, image, alt, category, location, rating, total_rating, reviews, badge, href,
  service_percentile, price_percentile, ambience_percentile, verified, distance, price_range
) VALUES
-- The Green Table
('1', 'The Green Table',
 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 'The Green Table restaurant', 'Restaurant', 'Downtown', 5, 4.8, 127, 'Trending', '/business/1',
 96, 87, 91, true, '0.3 mi', '$$'),

-- Artisan Coffee Co.
('2', 'Artisan Coffee Co.',
 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2047&q=80',
 'Artisan Coffee Co.', 'Coffee Shop', 'Arts District', 5, 4.9, 89, NULL, '/business/2',
 93, 84, 89, true, '0.5 mi', '$'),

-- Bloom Yoga Studio
('3', 'Bloom Yoga Studio',
 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80',
 'Bloom Yoga Studio', 'Wellness', 'Riverside', 5, 4.7, 156, NULL, '/business/3',
 95, 86, 90, true, '0.8 mi', '$$'),

-- Vintage & Vine
('4', 'Vintage & Vine',
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2086&q=80',
 'Vintage & Vine bookstore', 'Bookstore', 'Old Town', 5, 4.6, 203, NULL, '/business/4',
 92, 83, 88, false, '1.2 mi', '$'),

-- Sunset Ceramics
('5', 'Sunset Ceramics',
 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80',
 'Sunset Ceramics studio', 'Art Studio', 'Westside', 5, 4.8, 74, 'New', '/business/5',
 97, 85, 92, true, '0.9 mi', '$$'),

-- Morning Glory Bakery
('6', 'Morning Glory Bakery',
 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
 'Morning Glory Bakery', 'Bakery', 'Main Street', 5, 4.9, 342, NULL, '/business/6',
 90, 82, 87, false, '0.4 mi', '$'),

-- Ocean View Bistro
('21', 'Ocean View Bistro',
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
 'Ocean View Bistro restaurant', 'Restaurant', 'Waterfront', 5, 4.7, 89, 'Hot', '/business/21',
 94, 88, 92, true, '0.6 mi', '$$$'),

-- Urban Roastery
('22', 'Urban Roastery',
 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 'Urban Roastery coffee shop', 'Coffee Shop', 'Industrial District', 5, 4.8, 156, NULL, '/business/22',
 95, 85, 89, true, '0.4 mi', '$'),

-- Zen Wellness Center
('23', 'Zen Wellness Center',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 'Zen Wellness Center', 'Wellness', 'Garden District', 5, 4.9, 203, NULL, '/business/23',
 96, 87, 94, true, '0.7 mi', '$$'),

-- The Literary Corner
('24', 'The Literary Corner',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 'The Literary Corner bookstore', 'Bookstore', 'University District', 5, 4.6, 134, NULL, '/business/24',
 91, 82, 87, false, '1.0 mi', '$'),

-- Creative Canvas Studio
('25', 'Creative Canvas Studio',
 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
 'Creative Canvas Studio', 'Art Studio', 'Artists Quarter', 5, 4.7, 98, 'Popular', '/business/25',
 93, 84, 90, true, '0.8 mi', '$$'),

-- Fresh Start Bakehouse
('26', 'Fresh Start Bakehouse',
 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 'Fresh Start Bakehouse', 'Bakery', 'Community Center', 5, 4.8, 267, NULL, '/business/26',
 89, 81, 86, true, '0.5 mi', '$'),

-- Fitness First Gym
('27', 'Fitness First Gym',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 'Fitness First Gym', 'Fitness', 'Health Complex', 5, 4.5, 189, NULL, '/business/27',
 92, 85, 88, true, '0.9 mi', '$$'),

-- Metro Brew House
('28', 'Metro Brew House',
 'https://images.unsplash.com/photo-1442975631115-c4f7b05b8a2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 'Metro Brew House', 'Coffee Shop', 'Metro Station', 5, 4.6, 142, NULL, '/business/28',
 90, 83, 85, false, '1.1 mi', '$'),

-- Harmony Spa & Wellness
('29', 'Harmony Spa & Wellness',
 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 'Harmony Spa & Wellness', 'Wellness', 'Peaceful Gardens', 5, 4.9, 298, 'Trending', '/business/29',
 97, 89, 95, true, '0.3 mi', '$$$')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  alt = EXCLUDED.alt,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  rating = EXCLUDED.rating,
  total_rating = EXCLUDED.total_rating,
  reviews = EXCLUDED.reviews,
  badge = EXCLUDED.badge,
  href = EXCLUDED.href,
  service_percentile = EXCLUDED.service_percentile,
  price_percentile = EXCLUDED.price_percentile,
  ambience_percentile = EXCLUDED.ambience_percentile,
  verified = EXCLUDED.verified,
  distance = EXCLUDED.distance,
  price_range = EXCLUDED.price_range,
  updated_at = now();