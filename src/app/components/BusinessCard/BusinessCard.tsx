"use client";

import Link from "next/link";
import { useMemo } from "react";
import Stars from "../Stars/Stars";
import PercentileChip from "../PercentileChip/PercentileChip";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";

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
    <li id={idForSnap} className="snap-start min-w-[85%] sm:min-w-[48%] md:min-w-[33%] xl:min-w-[20%]">
      <div className="bg-white rounded-3 overflow-hidden shadow-2 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer border border-white/20">
        <div className="relative overflow-hidden">
          <img src={business.image} alt={business.alt} loading="lazy" className="h-[360px] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Instagram-style verified badge - positioned top left */}
          {business.verified && <VerifiedBadge />}
          
          {/* Numeric rating badge - positioned top right on image */}
          <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-3 bg-white/95 backdrop-blur-sm px-3 py-2 text-charcoal shadow-lg border border-white/20">
            <ion-icon name="star" class="text-coral text-sm drop-shadow-sm" />
            <span className="font-urbanist text-9 font-700">{business.totalRating.toFixed(1)}</span>
          </span>
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
              <PercentileChip label="Svc" value={business.percentiles.service} />
              <PercentileChip label="Price" value={business.percentiles.price} />
              <PercentileChip label="Amb" value={business.percentiles.ambience} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export type { Business };