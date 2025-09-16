// Dummy data for development without Supabase

export interface Business {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory: string;
  address: string;
  phone?: string;
  website?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  stats?: {
    average_rating: number;
    total_reviews: number;
    total_views: number;
  };
  created_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  title?: string;
  content: string;
  tags: string[];
  images?: string[];
  created_at: string;
  user?: {
    email: string;
  };
}

// Dummy businesses data
export const DUMMY_BUSINESSES: Business[] = [
  {
    id: 'biz-1',
    name: 'The Rustic Table',
    description: 'Farm-to-table dining with locally sourced ingredients and cozy atmosphere',
    category: 'food',
    subcategory: 'restaurants',
    address: '123 Main St, Downtown',
    phone: '(555) 123-4567',
    website: 'https://rustictable.com',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    latitude: 40.7128,
    longitude: -74.0060,
    stats: {
      average_rating: 4.5,
      total_reviews: 127,
      total_views: 2450
    },
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'biz-2',
    name: 'Brew & Bean Coffee',
    description: 'Artisanal coffee roastery with fresh pastries and free WiFi',
    category: 'food',
    subcategory: 'cafes',
    address: '456 Oak Ave, Coffee District',
    phone: '(555) 234-5678',
    website: 'https://brewandbean.com',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
    latitude: 40.7589,
    longitude: -73.9851,
    stats: {
      average_rating: 4.2,
      total_reviews: 89,
      total_views: 1820
    },
    created_at: '2024-02-01T14:15:00Z'
  },
  {
    id: 'biz-3',
    name: 'Galaxy Cinema',
    description: 'Modern movie theater with IMAX screens and luxury seating',
    category: 'entertainment',
    subcategory: 'movies',
    address: '789 Entertainment Blvd, Theater Row',
    phone: '(555) 345-6789',
    website: 'https://galaxycinema.com',
    image_url: 'https://images.unsplash.com/photo-1489185078527-2bbc19e90e5f?w=400&h=300&fit=crop',
    latitude: 40.7505,
    longitude: -73.9934,
    stats: {
      average_rating: 4.0,
      total_reviews: 203,
      total_views: 3200
    },
    created_at: '2024-01-20T09:45:00Z'
  },
  {
    id: 'biz-4',
    name: 'FitLife Gym',
    description: '24/7 fitness center with modern equipment and personal training',
    category: 'health',
    subcategory: 'gyms',
    address: '321 Fitness Way, Health District',
    phone: '(555) 456-7890',
    website: 'https://fitlifegym.com',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    latitude: 40.7282,
    longitude: -73.9942,
    stats: {
      average_rating: 4.3,
      total_reviews: 156,
      total_views: 2100
    },
    created_at: '2024-01-10T16:20:00Z'
  },
  {
    id: 'biz-5',
    name: 'Style Studio Salon',
    description: 'Full-service hair and beauty salon with experienced stylists',
    category: 'beauty',
    subcategory: 'salons',
    address: '654 Beauty Lane, Style Quarter',
    phone: '(555) 567-8901',
    website: 'https://stylestudio.com',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    latitude: 40.7614,
    longitude: -73.9776,
    stats: {
      average_rating: 4.7,
      total_reviews: 92,
      total_views: 1650
    },
    created_at: '2024-02-05T11:30:00Z'
  },
  {
    id: 'biz-6',
    name: 'Tech Repair Pro',
    description: 'Professional electronics repair service for phones, laptops, and tablets',
    category: 'services',
    subcategory: 'electronics',
    address: '987 Tech Street, Digital Downtown',
    phone: '(555) 678-9012',
    website: 'https://techrepairpro.com',
    image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
    latitude: 40.7357,
    longitude: -74.0012,
    stats: {
      average_rating: 4.1,
      total_reviews: 78,
      total_views: 1350
    },
    created_at: '2024-01-25T13:45:00Z'
  }
];

// Dummy reviews data
export const DUMMY_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    business_id: 'biz-1',
    user_id: 'dummy-user-id',
    rating: 5,
    title: 'Amazing farm-to-table experience!',
    content: 'The Rustic Table exceeded my expectations. The ingredients were incredibly fresh and the seasonal menu was creative. The atmosphere is cozy and perfect for date nights. Highly recommended!',
    tags: ['Trustworthy', 'Good Value', 'Friendly'],
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop'],
    created_at: '2024-03-01T19:30:00Z',
    user: { email: 'foodlover@example.com' }
  },
  {
    id: 'rev-2',
    business_id: 'biz-1',
    user_id: 'dummy-user-id',
    rating: 4,
    title: 'Great food, slow service',
    content: 'The food quality is outstanding and you can really taste the freshness of local ingredients. However, service was quite slow during peak hours. Still worth visiting for the quality.',
    tags: ['Good Value'],
    created_at: '2024-03-05T20:15:00Z',
    user: { email: 'critic@example.com' }
  },
  {
    id: 'rev-3',
    business_id: 'biz-2',
    user_id: 'dummy-user-id',
    rating: 4,
    title: 'Perfect coffee spot for work',
    content: 'Brew & Bean has become my go-to work spot. Great WiFi, comfortable seating, and the best cold brew in town. The pastries are fresh every morning. Love this place!',
    tags: ['Trustworthy', 'On Time', 'Friendly'],
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'],
    created_at: '2024-03-02T08:45:00Z',
    user: { email: 'coffeeaddict@example.com' }
  },
  {
    id: 'rev-4',
    business_id: 'biz-3',
    user_id: 'dummy-user-id',
    rating: 5,
    title: 'IMAX experience was incredible',
    content: 'Galaxy Cinema\'s IMAX screen is massive and the sound quality is phenomenal. The luxury seats are super comfortable. A bit pricey but worth it for blockbuster movies.',
    tags: ['On Time', 'Good Value'],
    created_at: '2024-03-03T22:00:00Z',
    user: { email: 'moviefan@example.com' }
  },
  {
    id: 'rev-5',
    business_id: 'biz-4',
    user_id: 'dummy-user-id',
    rating: 4,
    title: 'Great equipment, needs more classes',
    content: 'FitLife has all the modern equipment you need and it\'s always clean. The 24/7 access is convenient for my schedule. Would love to see more group fitness classes offered.',
    tags: ['Trustworthy', 'On Time'],
    created_at: '2024-03-04T06:30:00Z',
    user: { email: 'fitnessfan@example.com' }
  },
  {
    id: 'rev-6',
    business_id: 'biz-5',
    user_id: 'dummy-user-id',
    rating: 5,
    title: 'Best haircut I\'ve had in years!',
    content: 'The stylists at Style Studio are true artists. They listened to exactly what I wanted and delivered perfectly. The salon has a great atmosphere and reasonable prices.',
    tags: ['Trustworthy', 'Friendly', 'Good Value'],
    images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop'],
    created_at: '2024-03-06T15:20:00Z',
    user: { email: 'beautylover@example.com' }
  }
];

// Helper functions for dummy data
export const getBusinessById = (id: string): Business | undefined => {
  return DUMMY_BUSINESSES.find(business => business.id === id);
};

export const getBusinessesByCategory = (category: string): Business[] => {
  return DUMMY_BUSINESSES.filter(business => business.category === category);
};

export const getReviewsByBusinessId = (businessId: string): Review[] => {
  return DUMMY_REVIEWS.filter(review => review.business_id === businessId);
};

export const searchBusinesses = (query: string): Business[] => {
  const lowercaseQuery = query.toLowerCase();
  return DUMMY_BUSINESSES.filter(business =>
    business.name.toLowerCase().includes(lowercaseQuery) ||
    business.description?.toLowerCase().includes(lowercaseQuery) ||
    business.category.toLowerCase().includes(lowercaseQuery) ||
    business.subcategory.toLowerCase().includes(lowercaseQuery)
  );
};

// Generate random business stats for variety
export const generateRandomStats = () => ({
  average_rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
  total_reviews: Math.floor(Math.random() * 200) + 10, // 10 - 210
  total_views: Math.floor(Math.random() * 3000) + 500 // 500 - 3500
});

// Simulate API delay
export const simulateDelay = (ms: number = 300) =>
  new Promise(resolve => setTimeout(resolve, ms));