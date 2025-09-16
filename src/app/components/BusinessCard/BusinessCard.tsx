"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useMemo, useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Stars from "../Stars/Stars";
import PercentileChip from "../PercentileChip/PercentileChip";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";
import PremiumHover from "../Animations/PremiumHover";

type Percentiles = {
  service: number;   // percentile 0-100
  price: number;     // percentile 0-100
  ambience: number;  // percentile 0-100
};

type Business = {
  id: string;
  name: string;
  image: string;
  alt: string;
  category: string;
  location: string;
  rating: number;      // 0-5 stars
  totalRating: number; // numeric (e.g., 4.7)
  reviews: number;
  badge?: string;      // e.g., "Trending", "New"
  href?: string;
  percentiles?: Percentiles;
  verified?: boolean;
  distance?: string;   // e.g., "0.3 mi"
  priceRange?: string; // e.g., "$$"
};

function BusinessCard({ business }: { business: Business }) {
  const router = useRouter();
  const idForSnap = useMemo(() => `business-${business.id}`, [business.id]);
  const [showActions, setShowActions] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Preload the review route for faster navigation
  const reviewRoute = useMemo(() => {
    const businessSlug = business.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `/business/${businessSlug}/review`;
  }, [business.name]);

  // Check if we're on desktop after component mounts
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    // Preload review route after component mounts
    router.prefetch(reviewRoute);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, [router, reviewRoute]);

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const handleWriteReview = () => {
    router.push(reviewRoute);
  };

  const handleBookmark = () => {
    console.log('Bookmark clicked for:', business.name);
    // Add bookmark functionality here
  };

  const handleShare = () => {
    console.log('Share clicked for:', business.name);
    // Add share functionality here
  };
  return (
    <li id={idForSnap} className="snap-start w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[52%] md:min-w-[36%] xl:min-w-[22%]">
      <PremiumHover scale={1.03} shadowIntensity="strong" duration={0.4}>
        <div className="bg-off-white rounded-[6px] overflow-hidden shadow-sm group cursor-pointer">
        <div className="relative overflow-hidden rounded-t-[6px]" onClick={toggleActions}>
          <motion.div
            animate={{ scale: showActions ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <Image
              src={business.image}
              alt={business.alt}
              width={400}
              height={320}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="h-[360px] md:h-[320px] lg:h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-[6px]"
              priority={false}
              loading="lazy"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </motion.div>

          {/* Enhanced overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Silver shimmer effect on hover */}
          <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 group-hover:left-full transition-transform duration-700 ease-out" />

          {/* Instagram-style verified badge - positioned above image */}
          {business.verified && (
            <div className="absolute left-2 top-2 z-20">
              <VerifiedBadge />
            </div>
          )}

          {/* Numeric rating badge - positioned above image */}
          <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-3 bg-white/50 backdrop-blur-sm px-2 py-1 text-charcoal shadow-lg">
            <ion-icon name="star" class="text-coral text-sm drop-shadow-sm" />
            <span className="font-urbanist text-sm font-700">{business.totalRating.toFixed(1)}</span>
          </span>

          {/* Simple card actions - slide in from right on hover - hidden on mobile */}
          <div className="hidden sm:flex absolute right-2 top-1/2 transform -translate-y-1/2 z-20 flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <button
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleWriteReview();
              }}
            >
              <svg className="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
            >
              <svg className="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
            >
              <svg className="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        </div>

        <div className="p-5 relative">
          {/* Business name - left aligned as in wireframe */}
          <div className="mb-1">
            <h3 className="font-urbanist text-base md:text-lg font-600 text-charcoal transition-colors duration-200 group-hover:text-sage">
              <Link href={business.href || "#"} prefetch={true} className="hover:underline decoration-2 underline-offset-2">
                {business.name}
              </Link>
            </h3>
          </div>

          {/* Category line - left aligned and subtle */}
          <p className="mb-3 font-urbanist text-sm font-400 text-charcoal/70 transition-colors duration-200 group-hover:text-charcoal/80">
            {business.category} - {business.location}
          </p>

          {/* Stars + reviews - left aligned */}
          <div className="mb-4 flex items-center gap-2">
            <Stars value={business.rating} />
            <p className="font-urbanist text-sm font-400 leading-none text-charcoal/70 transition-colors duration-200">{business.reviews} reviews</p>
          </div>

          {/* Percentiles row at bottom - left aligned */}
          {business.percentiles && (
            <div className="flex items-center gap-2">
              <PercentileChip label="Speed" value={business.percentiles.service} />
              <PercentileChip label="Hospitality" value={business.percentiles.price} />
              <PercentileChip label="Quality" value={business.percentiles.ambience} />
            </div>
          )}
        </div>
      </PremiumHover>
    </li>
  );
}

// Memoize the component for better performance
export default memo(BusinessCard);

export type { Business };