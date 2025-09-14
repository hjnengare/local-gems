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
            <span className="font-urbanist text-9 font-700">{business.totalRating.toFixed(1)}</span>
          </span>

          {/* Enhanced Card Actions - mobile click, desktop hover/focus */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1
                }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut", staggerChildren: 0.1 }}
                className="absolute inset-0 flex items-center justify-center z-30 sm:hidden"
              >
                {/* Beautiful backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm rounded-t-[6px]"
                />

                {/* Action buttons container - vertically centered */}
                <motion.div className="relative z-10 flex items-center justify-center space-x-4">
                  {[
                    { icon: "create-outline", color: "sage", label: "Review", handler: handleWriteReview },
                    { icon: "bookmark-outline", color: "coral", label: "Save", handler: handleBookmark },
                    { icon: "share-outline", color: "charcoal", label: "Share", handler: handleShare }
                  ].map((action, index) => (
                    <motion.button
                      key={action.icon}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{
                        scale: 1.2,
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.9 }}
                      className={`
                        group/btn relative w-14 h-14 md:w-16 md:h-16
                        bg-gradient-to-br from-off-white via-white to-off-white/90
                        backdrop-blur-xl rounded-2xl
                        flex items-center justify-center
                        shadow-2xl border border-white/20
                        transition-all duration-300
                        hover:shadow-3xl hover:border-white/40
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.handler();
                      }}
                    >
                      {/* Gradient background on hover */}
                      <div className={`
                        absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300
                        bg-gradient-to-br from-${action.color} to-${action.color}/70
                      `} />

                      {/* Icon */}
                      <ion-icon
                        name={action.icon}
                        class={`text-${action.color} group-hover/btn:text-${action.color}/80 transition-colors duration-300 relative z-10`}
                        style={{fontSize: '28px'}}
                      />

                      {/* Label tooltip */}
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-charcoal/90 text-white text-xs font-urbanist font-500 px-2 py-1 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Close button for mobile */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg sm:hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(false);
                  }}
                >
                  <ion-icon name="close" style={{fontSize: '20px'}} class="text-charcoal" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop hover/focus actions - appear on image hover */}
          <div className="hidden sm:block absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-400 ease-out z-30">
            <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm rounded-t-[6px]"></div>

            <div className="relative z-10 flex items-center justify-center h-full space-x-4">
              {[
                { icon: "create-outline", color: "sage", label: "Review", handler: handleWriteReview },
                { icon: "bookmark-outline", color: "coral", label: "Save", handler: handleBookmark },
                { icon: "share-outline", color: "charcoal", label: "Share", handler: handleShare }
              ].map((action, index) => (
                <motion.button
                  key={action.icon}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{
                    scale: 1.2,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    group/btn relative w-14 h-14 md:w-16 md:h-16
                    bg-gradient-to-br from-off-white via-white to-off-white/90
                    backdrop-blur-xl rounded-2xl
                    flex items-center justify-center
                    shadow-2xl border border-white/20
                    transition-all duration-300
                    hover:shadow-3xl hover:border-white/40
                    focus:outline-none focus:ring-2 focus:ring-${action.color}/50
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.handler();
                  }}
                  tabIndex={0}
                >
                  {/* Gradient background on hover */}
                  <div className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-20 group-focus/btn:opacity-20 transition-opacity duration-300
                    bg-gradient-to-br from-${action.color} to-${action.color}/70
                  `} />

                  {/* Icon */}
                  <ion-icon
                    name={action.icon}
                    class={`text-${action.color} group-hover/btn:text-${action.color}/80 group-focus/btn:text-${action.color}/80 transition-colors duration-300 relative z-10`}
                    style={{fontSize: '28px'}}
                  />

                  {/* Label tooltip */}
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-charcoal/90 text-white text-xs font-urbanist font-500 px-2 py-1 rounded-full opacity-0 group-hover/btn:opacity-100 group-focus/btn:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile click overlay */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="sm:hidden absolute inset-0 bg-charcoal/40 backdrop-blur-sm rounded-t-[6px] z-40 flex items-center justify-center"
              >
                {/* Beautiful backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm rounded-t-[6px]"
                />

                {/* Action buttons container - vertically centered */}
                <motion.div className="relative z-10 flex items-center justify-center space-x-4">
                  {[
                    { icon: "create-outline", color: "sage", label: "Review", handler: handleWriteReview },
                    { icon: "bookmark-outline", color: "coral", label: "Save", handler: handleBookmark },
                    { icon: "share-outline", color: "charcoal", label: "Share", handler: handleShare }
                  ].map((action, index) => (
                    <motion.button
                      key={action.icon}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{
                        scale: 1.2,
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.9 }}
                      className={`
                        group/btn relative w-14 h-14 md:w-16 md:h-16
                        bg-gradient-to-br from-off-white via-white to-off-white/90
                        backdrop-blur-xl rounded-2xl
                        flex items-center justify-center
                        shadow-2xl border border-white/20
                        transition-all duration-300
                        hover:shadow-3xl hover:border-white/40
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.handler();
                      }}
                    >
                      {/* Gradient background on hover */}
                      <div className={`
                        absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300
                        bg-gradient-to-br from-${action.color} to-${action.color}/70
                      `} />

                      {/* Icon */}
                      <ion-icon
                        name={action.icon}
                        class={`text-${action.color} group-hover/btn:text-${action.color}/80 transition-colors duration-300 relative z-10`}
                        style={{fontSize: '28px'}}
                      />

                      {/* Label tooltip */}
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-charcoal/90 text-white text-xs font-urbanist font-500 px-2 py-1 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Close button for mobile */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg sm:hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(false);
                  }}
                >
                  <ion-icon name="close" style={{fontSize: '20px'}} class="text-charcoal" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        </div>

        <div className="p-5 relative">
          {/* Business name - left aligned as in wireframe */}
          <div className="mb-1">
            <h3 className="font-urbanist text-7 font-600 text-charcoal transition-colors duration-200 group-hover:text-sage">
              <Link href={business.href || "#"} prefetch={true} className="hover:underline decoration-2 underline-offset-2">
                {business.name}
              </Link>
            </h3>
          </div>

          {/* Category line - left aligned and subtle */}
          <p className="mb-3 font-urbanist text-8 font-400 text-charcoal/70 transition-colors duration-200 group-hover:text-charcoal/80">
            {business.category} - {business.location}
          </p>

          {/* Stars + reviews - left aligned */}
          <div className="mb-4 flex items-center gap-2">
            <Stars value={business.rating} />
            <p className="font-urbanist text-8 font-400 leading-none text-charcoal/70 transition-colors duration-200">{business.reviews} reviews</p>
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