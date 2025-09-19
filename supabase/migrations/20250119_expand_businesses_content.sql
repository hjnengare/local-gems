-- migration: 2025-01-19_expand_businesses_content.sql
-- Expand businesses with diverse content aligned with interests and subcategories

-- Add more diverse businesses across all interest categories
INSERT INTO public.businesses (
  name, image, alt, category, location, rating, total_rating, reviews, badge, href,
  service_percentile, price_percentile, ambience_percentile, verified, distance_km, price_range,
  description, latitude, longitude, status
) VALUES

-- FOOD & DRINK - Restaurants
('Mama Rosa Italian Kitchen',
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
 'Mama Rosa Italian Kitchen dining room', 'Restaurant', 'Little Italy', 5, 4.8, 234, 'Hot', '/business/mama-rosa-italian',
 94, 88, 93, true, 0.5, '$$$',
 'Authentic Italian cuisine with handmade pasta and wood-fired pizzas in a cozy family atmosphere.',
 34.0522, -118.2437, 'active'),

('Sakura Sushi & Ramen',
 'https://images.unsplash.com/photo-1579027989054-b11c4b02b41d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Sakura Sushi restaurant interior', 'Restaurant', 'Downtown', 5, 4.9, 189, NULL, '/business/sakura-sushi',
 96, 91, 94, true, 0.4, '$$$',
 'Fresh sushi and authentic ramen in a modern Japanese setting with traditional elements.',
 34.0522, -118.2400, 'active'),

-- FOOD & DRINK - Cafes
('Roasted Dreams Coffee',
 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Roasted Dreams Coffee interior', 'Cafe', 'Arts District', 4, 4.7, 167, NULL, '/business/roasted-dreams',
 91, 84, 88, true, 0.3, '$',
 'Artisanal coffee roasted daily with homemade pastries and a cozy workspace atmosphere.',
 34.0391, -118.2348, 'active'),

-- FOOD & DRINK - Bars
('The Copper Mule',
 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
 'The Copper Mule bar interior', 'Bar', 'Downtown', 5, 4.6, 298, 'Trending', '/business/copper-mule',
 89, 85, 92, false, 0.6, '$$',
 'Craft cocktails and local brews in a vintage industrial setting with live music nights.',
 34.0522, -118.2437, 'active'),

-- ARTS & CULTURE - Museums
('Modern Arts Gallery',
 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Modern Arts Gallery exhibition space', 'Museum', 'Cultural District', 5, 4.9, 456, NULL, '/business/modern-arts-gallery',
 97, 89, 95, true, 0.8, '$$',
 'Contemporary art exhibitions featuring local and international artists in a stunning modern space.',
 34.0736, -118.2400, 'active'),

-- ARTS & CULTURE - Theaters
('The Grand Theater',
 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
 'The Grand Theater interior', 'Theater', 'Theater District', 5, 4.8, 678, 'Hot', '/business/grand-theater',
 96, 87, 94, true, 1.2, '$$$',
 'Historic theater showcasing Broadway shows, concerts, and local performances in elegant surroundings.',
 34.0522, -118.2600, 'active'),

-- BEAUTY & WELLNESS - Spas
('Serenity Wellness Spa',
 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Serenity Wellness Spa treatment room', 'Spa', 'Wellness District', 5, 4.9, 345, NULL, '/business/serenity-spa',
 98, 92, 96, true, 0.7, '$$$',
 'Luxury spa treatments including massages, facials, and holistic wellness therapies.',
 34.0928, -118.2912, 'active'),

-- BEAUTY & WELLNESS - Gyms
('FitCore Gym',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'FitCore Gym workout area', 'Gym', 'Fitness Quarter', 4, 4.6, 234, 'Trending', '/business/fitcore-gym',
 88, 76, 84, false, 0.9, '$$',
 'State-of-the-art fitness equipment with personal training and group classes.',
 34.0315, -118.2083, 'active'),

-- NIGHTLIFE & ENTERTAINMENT - Events
('Luna Rooftop Lounge',
 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Luna Rooftop Lounge at sunset', 'Event Venue', 'Rooftop District', 5, 4.7, 567, 'Hot', '/business/luna-rooftop',
 93, 89, 97, true, 1.1, '$$$$',
 'Stunning city views with craft cocktails, live DJ sets, and exclusive events.',
 34.0522, -118.2500, 'active'),

-- HOME & SERVICES
('Elite Home Solutions',
 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80',
 'Elite Home Solutions workspace', 'Home Services', 'Service District', 4, 4.8, 123, NULL, '/business/elite-home',
 95, 82, 87, true, 1.5, '$$$',
 'Professional home improvement services including renovation, plumbing, and electrical work.',
 34.0400, -118.2200, 'active'),

-- OUTDOORS & ADVENTURE
('Adventure Gear Co.',
 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Adventure Gear Co. store interior', 'Outdoor Gear', 'Adventure District', 4, 4.5, 189, NULL, '/business/adventure-gear',
 86, 78, 82, false, 2.1, '$$',
 'Complete outdoor gear and equipment for hiking, camping, and adventure sports.',
 34.0100, -118.2000, 'active'),

-- FAMILY & PETS
('Happy Tails Pet Spa',
 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Happy Tails Pet Spa grooming area', 'Pet Services', 'Pet District', 5, 4.9, 267, 'Trending', '/business/happy-tails',
 97, 85, 91, true, 1.3, '$$',
 'Professional pet grooming, boarding, and wellness services for your furry family members.',
 34.0800, -118.2300, 'active'),

-- SHOPPING & LIFESTYLE
('Vintage Threads Boutique',
 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Vintage Threads Boutique interior', 'Boutique', 'Fashion District', 4, 4.6, 145, NULL, '/business/vintage-threads',
 87, 83, 89, false, 0.8, '$$',
 'Curated vintage and contemporary fashion with unique accessories and personal styling services.',
 34.0600, -118.2450, 'active'),

-- EVENTS - Special Events and Experiences
('Moonlight Dinner Cruise',
 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
 'Moonlight Dinner Cruise deck view', 'Event Experience', 'Marina', 5, 4.8, 423, 'Hot', '/business/moonlight-cruise',
 96, 91, 98, true, 3.2, '$$$$',
 'Romantic dinner cruise with gourmet cuisine, live entertainment, and breathtaking ocean views.',
 33.9850, -118.4695, 'active'),

('Food Truck Festival',
 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80',
 'Food Truck Festival scene', 'Food Event', 'Festival Grounds', 4, 4.4, 678, 'Trending', '/business/food-truck-festival',
 84, 72, 88, false, 2.8, '$',
 'Monthly food truck gathering featuring diverse cuisines, live music, and family-friendly activities.',
 34.0200, -118.2800, 'active'),

-- Fast Food Options
('Burger Bliss',
 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2099&q=80',
 'Burger Bliss restaurant', 'Fast Food', 'Food Court', 4, 4.3, 234, NULL, '/business/burger-bliss',
 78, 68, 76, false, 0.5, '$',
 'Gourmet burgers and hand-cut fries made with fresh, locally-sourced ingredients.',
 34.0522, -118.2300, 'active')

ON CONFLICT (id) DO NOTHING;