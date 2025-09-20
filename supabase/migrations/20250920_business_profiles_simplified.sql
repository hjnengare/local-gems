-- migration: 2025-09-20_business_profiles_simplified.sql
-- Add sample business data to existing businesses table

-- 1) Insert sample business data (only if table is empty)
INSERT INTO public.businesses (
  name, description, category, location, address, phone, website,
  image, alt, rating, total_rating, reviews, badge, verified, price_range,
  service_percentile, price_percentile, ambience_percentile
)
SELECT * FROM (VALUES
  -- Sample businesses based on common business types
  (
    'Mama''s Kitchen',
    'Authentic family recipes passed down through generations. Fresh ingredients, warm atmosphere, and dishes that remind you of home.',
    'Restaurant',
    'Downtown',
    '123 Main Street, Downtown',
    '+1 (555) 123-4567',
    'https://mamaskitchen.com',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    'Cozy restaurant interior with warm lighting',
    4.8,
    4.8,
    127,
    'Featured',
    true,
    '$$'::price_range_enum,
    88,
    75,
    90
  ),
  (
    'Blue Moon Bar',
    'Craft cocktails and live music in an intimate setting. Perfect for date nights and catching up with friends.',
    'Bar & Nightlife',
    'Arts District',
    '456 Jazz Avenue, Arts District',
    '+1 (555) 234-5678',
    'https://bluemoonbar.com',
    'https://images.unsplash.com/photo-1519671282429-11ccd85f0a3b?w=400',
    'Dimly lit bar with exposed brick walls',
    4.6,
    4.6,
    89,
    'Trending',
    true,
    '$$$'::price_range_enum,
    85,
    70,
    95
  ),
  (
    'Urban Fitness Studio',
    'State-of-the-art equipment, expert trainers, and a supportive community to help you reach your fitness goals.',
    'Gym & Fitness',
    'Midtown',
    '789 Fitness Lane, Midtown',
    '+1 (555) 345-6789',
    'https://urbanfitness.com',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    'Modern gym with workout equipment',
    4.7,
    4.7,
    156,
    null,
    true,
    '$$'::price_range_enum,
    92,
    80,
    85
  ),
  (
    'Artisan Coffee Co.',
    'Single-origin beans roasted in-house daily. From espresso to pour-over, we craft each cup with precision and care.',
    'Coffee Shop',
    'University District',
    '321 Bean Street, University District',
    '+1 (555) 456-7890',
    'https://artisancoffee.com',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    'Cozy coffee shop with wooden tables',
    4.9,
    4.9,
    203,
    'Top Rated',
    true,
    '$'::price_range_enum,
    95,
    85,
    93
  ),
  (
    'City Gallery',
    'Contemporary art space showcasing local and international artists. Rotating exhibitions, workshops, and community events.',
    'Art & Culture',
    'Cultural Quarter',
    '654 Art Avenue, Cultural Quarter',
    '+1 (555) 567-8901',
    'https://citygallery.org',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    'Modern art gallery with white walls',
    4.5,
    4.5,
    67,
    'New',
    false,
    '$'::price_range_enum,
    90,
    95,
    88
  )
) AS sample_data
WHERE NOT EXISTS (SELECT 1 FROM public.businesses LIMIT 1);