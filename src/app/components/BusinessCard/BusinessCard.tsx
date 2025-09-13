"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
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

export default function BusinessCard({ business }: { business: Business }) {
  const idForSnap = useMemo(() => `business-${business.id}`, [business.id]);
  return (
    <li id={idForSnap} className="snap-start w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[52%] md:min-w-[36%] xl:min-w-[22%]">
      <PremiumHover scale={1.03} shadowIntensity="strong" duration={0.4}>
        <div className="bg-off-white rounded-[6px] overflow-hidden shadow-sm group cursor-pointer">
        <div className="relative overflow-hidden rounded-t-[6px]">
          <Image
            src={business.image}
            alt={business.alt}
            width={400}
            height={320}
            className="h-[360px] md:h-[320px] lg:h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-[6px]"
            priority={false}
            loading="lazy"
            quality={85}
          />
          
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
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

          {/* Card Actions - slide in from right on hover - hidden on mobile */}
          <div className="hidden sm:flex absolute right-2 bottom-2 z-20 flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
              <ion-icon name="create-outline" class="text-charcoal" style={{fontSize: '24px'}} />
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
              <ion-icon name="bookmark-outline" class="text-charcoal" style={{fontSize: '24px'}} />
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
              <ion-icon name="share-outline" class="text-charcoal" style={{fontSize: '24px'}} />
            </button>
          </div>
        </div>

        <div className="p-5 relative">
          {/* Business name - left aligned as in wireframe */}
          <div className="mb-1">
            <h3 className="font-urbanist text-7 font-600 text-charcoal transition-colors duration-200 group-hover:text-sage">
              <Link href={business.href || "#"} className="hover:underline decoration-2 underline-offset-2">
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
        </div>
      </PremiumHover>
    </li>
  );
}

export type { Business };