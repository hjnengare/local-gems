-- migration: 2025-01-19_production_ready_businesses.sql
-- Production-ready improvements for businesses schema

-- 1) Create enum types for better data consistency
CREATE TYPE price_range_enum AS ENUM ('$', '$$', '$$$', '$$$$');
CREATE TYPE business_status_enum AS ENUM ('active', 'inactive', 'pending', 'suspended');

-- 2) Drop and recreate businesses table with production-ready schema
DROP TABLE IF EXISTS public.businesses CASCADE;

CREATE TABLE public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  slug text UNIQUE GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g'))) STORED,
  image text NOT NULL,
  alt text NOT NULL,
  category text NOT NULL CHECK (char_length(category) >= 2),
  location text NOT NULL CHECK (char_length(location) >= 2),

  -- Ratings and reviews
  rating integer NOT NULL CHECK (rating >= 0 AND rating <= 5),
  total_rating numeric(3,2) NOT NULL CHECK (total_rating >= 0 AND total_rating <= 5),
  reviews integer NOT NULL DEFAULT 0 CHECK (reviews >= 0),

  -- Business metadata
  badge text,
  href text,
  verified boolean NOT NULL DEFAULT false,
  status business_status_enum NOT NULL DEFAULT 'active',

  -- Location data (numeric for proper distance calculations)
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  distance_km decimal(6, 2), -- Distance in kilometers

  -- Pricing
  price_range price_range_enum,

  -- Percentiles (0-100)
  service_percentile integer CHECK (service_percentile >= 0 AND service_percentile <= 100),
  price_percentile integer CHECK (price_percentile >= 0 AND price_percentile <= 100),
  ambience_percentile integer CHECK (ambience_percentile >= 0 AND ambience_percentile <= 100),

  -- SEO and business info
  description text,
  phone text,
  website text,
  address text,
  hours jsonb, -- Store business hours as JSON

  -- Search and filtering
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || coalesce(category, '') || ' ' || coalesce(location, '') || ' ' || coalesce(description, ''))
  ) STORED,

  -- Audit fields
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- 3) Create comprehensive indexes for performance
CREATE INDEX businesses_status_idx ON public.businesses(status) WHERE status = 'active';
CREATE INDEX businesses_category_rating_idx ON public.businesses(category, total_rating DESC) WHERE status = 'active';
CREATE INDEX businesses_location_rating_idx ON public.businesses(location, total_rating DESC) WHERE status = 'active';
CREATE INDEX businesses_verified_rating_idx ON public.businesses(verified, total_rating DESC) WHERE status = 'active';
CREATE INDEX businesses_badge_idx ON public.businesses(badge) WHERE badge IS NOT NULL AND status = 'active';
CREATE INDEX businesses_reviews_idx ON public.businesses(reviews DESC) WHERE status = 'active';
CREATE INDEX businesses_created_at_idx ON public.businesses(created_at DESC);
CREATE INDEX businesses_search_idx ON public.businesses USING gin(search_vector);
CREATE INDEX businesses_location_gist_idx ON public.businesses USING gist(point(longitude, latitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 4) Enable RLS with refined policies
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Public can only read active businesses
DROP POLICY IF EXISTS "businesses public read" ON public.businesses;
CREATE POLICY "businesses public read"
  ON public.businesses
  FOR SELECT
  USING (status = 'active');

-- Business owners can manage their own businesses (for future use)
CREATE POLICY "businesses owner manage"
  ON public.businesses
  FOR ALL
  USING (auth.uid() = created_by);

-- 5) Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_businesses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ language plpgsql;

DROP TRIGGER IF EXISTS update_businesses_updated_at ON public.businesses;
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_businesses_updated_at();

-- 6) Create function for distance-based queries
CREATE OR REPLACE FUNCTION public.businesses_within_radius(
  center_lat decimal,
  center_lng decimal,
  radius_km decimal DEFAULT 10
)
RETURNS TABLE(
  id uuid,
  name text,
  distance_km decimal
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.name,
    (point(center_lng, center_lat) <@> point(b.longitude, b.latitude))::decimal as distance_km
  FROM public.businesses b
  WHERE
    b.latitude IS NOT NULL
    AND b.longitude IS NOT NULL
    AND b.status = 'active'
    AND (point(center_lng, center_lat) <@> point(b.longitude, b.latitude)) <= radius_km
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7) Improved seed data with production structure
INSERT INTO public.businesses (
  name, image, alt, category, location, rating, total_rating, reviews, badge, href,
  service_percentile, price_percentile, ambience_percentile, verified, distance_km, price_range,
  description, latitude, longitude, status
) VALUES
-- Restaurants
('The Green Table',
 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'The Green Table restaurant interior', 'Restaurant', 'Downtown', 5, 4.8, 127, 'Trending', '/business/the-green-table',
 96, 87, 91, true, 0.3, '$$',
 'Farm-to-table restaurant featuring organic, locally-sourced ingredients in a cozy downtown setting.',
 34.0522, -118.2437, 'active'),

('Ocean View Bistro',
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
 'Ocean View Bistro seaside dining', 'Restaurant', 'Waterfront', 5, 4.7, 89, 'Hot', '/business/ocean-view-bistro',
 94, 88, 92, true, 0.6, '$$$',
 'Stunning oceanfront dining with fresh seafood and panoramic views of the Pacific.',
 34.0195, -118.4912, 'active'),

-- Coffee Shops
('Artisan Coffee Co.',
 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=2047&q=80',
 'Artisan Coffee Co. interior', 'Coffee Shop', 'Arts District', 5, 4.9, 89, NULL, '/business/artisan-coffee-co',
 93, 84, 89, true, 0.5, '$',
 'Specialty coffee roasted in-house with locally sourced pastries and cozy workspace.',
 34.0391, -118.2348, 'active'),

('Urban Roastery',
 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Urban Roastery coffee bar', 'Coffee Shop', 'Industrial District', 5, 4.8, 156, NULL, '/business/urban-roastery',
 95, 85, 89, true, 0.4, '$',
 'Industrial-chic coffee house featuring single-origin beans and expert barista craftsmanship.',
 34.0315, -118.2083, 'active'),

-- Wellness Centers
('Bloom Yoga Studio',
 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80',
 'Bloom Yoga Studio peaceful interior', 'Wellness', 'Riverside', 5, 4.7, 156, NULL, '/business/bloom-yoga-studio',
 95, 86, 90, true, 0.8, '$$',
 'Tranquil yoga studio offering various classes from beginner to advanced levels.',
 34.0736, -118.2400, 'active'),

('Zen Wellness Center',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Zen Wellness Center meditation space', 'Wellness', 'Garden District', 5, 4.9, 203, NULL, '/business/zen-wellness-center',
 96, 87, 94, true, 0.7, '$$',
 'Holistic wellness center offering meditation, massage therapy, and mindfulness programs.',
 34.0928, -118.2912, 'active')

ON CONFLICT (id) DO NOTHING;

-- 8) Grant permissions for API access
REVOKE ALL ON public.businesses FROM public;
GRANT SELECT ON public.businesses TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.businesses_within_radius(decimal, decimal, decimal) TO anon, authenticated;