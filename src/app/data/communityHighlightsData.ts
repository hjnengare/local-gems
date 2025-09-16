export interface Reviewer {
  id: string;
  name: string;
  profilePicture: string;
  reviewCount: number;
  rating: number;
  badge?: "top" | "verified" | "local";
  trophyBadge?: "gold" | "silver" | "bronze" | "rising-star" | "community-favorite";
  location: string;
}

export interface Review {
  id: string;
  reviewer: Reviewer;
  businessName: string;
  businessType: string;
  rating: number;
  reviewText: string;
  date: string;
  likes: number;
  images?: string[];
}

// Utility function to randomly assign trophy badges
const getRandomTrophyBadge = (): Reviewer['trophyBadge'] | undefined => {
  const trophies: (Reviewer['trophyBadge'])[] = ["gold", "silver", "bronze", "rising-star", "community-favorite"];
  const shouldHaveTrophy = Math.random() > 0.3; // 70% chance of having a trophy

  if (!shouldHaveTrophy) return undefined;

  return trophies[Math.floor(Math.random() * trophies.length)];
};

export const TOP_REVIEWERS: Reviewer[] = [
  {
    id: "1",
    name: "Sarah Chen",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format",
    reviewCount: 127,
    rating: 4.8,
    badge: "top",
    trophyBadge: "gold",
    location: "Downtown"
  },
  {
    id: "2",
    name: "Marcus Johnson",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    reviewCount: 89,
    rating: 4.7,
    badge: "verified",
    trophyBadge: "community-favorite",
    location: "Midtown"
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    reviewCount: 156,
    rating: 4.9,
    badge: "local",
    trophyBadge: "silver",
    location: "Arts District"
  },
  {
    id: "4",
    name: "David Kim",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    reviewCount: 73,
    rating: 4.6,
    trophyBadge: "rising-star",
    location: "Westside"
  }
];

export const FEATURED_REVIEWS: Review[] = [
  {
    id: "1",
    reviewer: TOP_REVIEWERS[0],
    businessName: "The Cozy Corner Cafe",
    businessType: "Coffee Shop",
    rating: 5,
    reviewText: "Absolutely love this hidden gem! The barista remembers my order and the atmosphere is perfect for working. Their lavender latte is to die for!",
    date: "2 days ago",
    likes: 24,
    images: ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop"]
  },
  {
    id: "2", 
    reviewer: TOP_REVIEWERS[1],
    businessName: "Mama Rosa's Trattoria",
    businessType: "Italian Restaurant",
    rating: 5,
    reviewText: "Best authentic Italian food outside of Italy! The pasta is made fresh daily and the tiramisu is heavenly. Service is impeccable too.",
    date: "1 week ago",
    likes: 31,
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop"]
  },
  {
    id: "3",
    reviewer: TOP_REVIEWERS[2], 
    businessName: "Sunset Yoga Studio",
    businessType: "Wellness",
    rating: 5,
    reviewText: "This place transformed my wellness journey. The instructors are amazing and the rooftop classes during sunset are magical. Highly recommend!",
    date: "3 days ago", 
    likes: 18
  },
  {
    id: "4",
    reviewer: TOP_REVIEWERS[3],
    businessName: "The Book Nook",
    businessType: "Bookstore",
    rating: 4,
    reviewText: "Charming little bookstore with rare finds and great coffee. The owner is incredibly knowledgeable and always has perfect recommendations.",
    date: "5 days ago",
    likes: 12
  }
];

export interface BusinessOfTheMonth {
  id: string;
  name: string;
  image: string;
  alt: string;
  category: string;
  location: string;
  rating: number;
  totalRating: number;
  reviews: number;
  badge: "winner" | "runner-up" | "featured";
  href?: string;
  monthAchievement: string;
  verified?: boolean;
}

export const BUSINESSES_OF_THE_MONTH: BusinessOfTheMonth[] = [
  {
    id: "1",
    name: "Artisan Coffee Roasters",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop&auto=format",
    alt: "Artisan Coffee Roasters interior",
    category: "Coffee Shop",
    location: "Arts District",
    rating: 5,
    totalRating: 4.9,
    reviews: 234,
    badge: "winner",
    monthAchievement: "Most Loved Coffee Shop",
    verified: true,
    href: "/business/artisan-coffee"
  },
  {
    id: "2",
    name: "Luna's Garden Bistro",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop&auto=format",
    alt: "Luna's Garden Bistro dining area",
    category: "Restaurant",
    location: "Downtown",
    rating: 5,
    totalRating: 4.8,
    reviews: 189,
    badge: "runner-up",
    monthAchievement: "Outstanding Service",
    verified: true,
    href: "/business/lunas-garden"
  },
  {
    id: "3",
    name: "The Book & Brew",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&auto=format",
    alt: "The Book & Brew bookstore cafe",
    category: "Bookstore & Cafe",
    location: "University District",
    rating: 5,
    totalRating: 4.7,
    reviews: 156,
    badge: "featured",
    monthAchievement: "Community Favorite",
    href: "/business/book-and-brew"
  },
  {
    id: "4",
    name: "Green Valley Yoga Studio",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&auto=format",
    alt: "Green Valley Yoga Studio interior",
    category: "Wellness",
    location: "Westside",
    rating: 5,
    totalRating: 4.8,
    reviews: 98,
    badge: "featured",
    monthAchievement: "Wellness Champion",
    href: "/business/green-valley-yoga"
  }
];

export type { Review as CommunityReview, Reviewer as CommunityReviewer };