"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { Review, Reviewer } from "../../data/communityHighlightsData";
import ProfilePicture from "./ProfilePicture";
import ReviewerStats from "./ReviewerStats";
import ReviewContent from "./ReviewContent";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";

interface ReviewerCardProps {
  review?: Review;
  reviewer?: Reviewer;
  variant?: "reviewer" | "review";
}

export default function ReviewerCard({ review, reviewer, variant = "review" }: ReviewerCardProps) {
  const reviewerData = reviewer || review?.reviewer;
  const idForSnap = useMemo(() => `reviewer-${reviewerData?.id}`, [reviewerData?.id]);

  if (variant === "reviewer" || reviewer) {
    return (
      <li id={idForSnap} className="snap-start w-[280px] sm:w-[320px] flex-shrink-0">
        <div className="bg-off-white rounded-[6px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group cursor-pointer">
          <div className="relative overflow-hidden rounded-t-[6px]">
            <Image
              src={reviewerData?.profilePicture || '/placeholder-avatar.jpg'}
              alt={reviewerData?.name || 'User avatar'}
              width={400}
              height={320}
              className="h-[200px] w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-[6px]"
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Silver shimmer effect on hover */}
            <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 group-hover:left-full transition-transform duration-700 ease-out" />

            {/* Instagram-style verified badge - positioned above image */}
            {reviewerData?.badge === 'verified' && (
              <div className="absolute left-2 top-2 z-20">
                <VerifiedBadge />
              </div>
            )}
            
            {/* Numeric rating badge - positioned above image */}
            <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-3 bg-white/50 backdrop-blur-sm px-2 py-1 text-charcoal shadow-lg">
              <ion-icon name="star" class="text-coral text-sm drop-shadow-sm" />
              <span className="font-urbanist text-sm font-700">{reviewerData?.rating.toFixed(1)}</span>
            </span>

            {/* Card Actions - slide in from right on hover - hidden on mobile */}
            <div className="hidden sm:flex absolute right-2 bottom-2 z-20 flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
              <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
                <ion-icon name="person-add-outline" class="text-charcoal" style={{fontSize: '24px'}} />
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
                <ion-icon name="chatbubble-outline" class="text-charcoal" style={{fontSize: '24px'}} />
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
                <ion-icon name="share-outline" class="text-charcoal" style={{fontSize: '24px'}} />
              </button>
            </div>
          </div>

          <div className="p-5 relative">
            {/* Reviewer name - left aligned */}
            <div className="mb-1">
              <h3 className="font-urbanist text-base md:text-lg font-600 text-charcoal transition-colors duration-200 group-hover:text-sage">
                <Link href={`/reviewer/${reviewerData?.id}` || "#"} className="hover:underline decoration-2 underline-offset-2">
                  {reviewerData?.name}
                </Link>
              </h3>
            </div>

            {/* Location line - left aligned and subtle */}
            <p className="mb-3 font-urbanist text-sm font-400 text-charcoal/70 transition-colors duration-200 group-hover:text-charcoal/80">
              Local Reviewer • {reviewerData?.location}
            </p>

            {/* Stats - left aligned */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <ion-icon name="star" class="text-coral text-sm" />
                <span className="font-urbanist text-sm font-400 leading-none text-charcoal/70">{reviewerData?.rating.toFixed(1)}</span>
              </div>
              <p className="font-urbanist text-sm font-400 leading-none text-charcoal/70 transition-colors duration-200">{reviewerData?.reviewCount} reviews</p>
            </div>

            {/* Badge info at bottom */}
            {reviewerData?.badge && (
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-full text-sm font-urbanist font-700 ${
                  reviewerData.badge === 'top' ? 'bg-amber-100 text-amber-700' :
                  reviewerData.badge === 'verified' ? 'bg-blue-100 text-blue-700' :
                  'bg-sage/10 text-sage'
                }`}>
                  {reviewerData.badge === 'top' ? '🏆 Top Reviewer' : 
                   reviewerData.badge === 'verified' ? '✓ Verified' : 
                   '📍 Local Expert'}
                </div>
              </div>
            )}
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="snap-start w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[320px]">
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group cursor-pointer h-[280px] flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <ProfilePicture
              src={review?.reviewer.profilePicture || ''}
              alt={review?.reviewer.name || ''}
              size="md"
              badge={review?.reviewer.badge}
            />
            {/* Instagram-style verified badge for profile picture */}
            {review?.reviewer.badge === 'verified' && (
              <div className="absolute -right-1 -top-1 z-20">
                <VerifiedBadge />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-urbanist font-700 text-charcoal truncate">{review?.reviewer.name}</h3>
            <ReviewerStats
              reviewCount={review?.reviewer.reviewCount || 0}
              rating={review?.reviewer.rating || 0}
              location={review?.reviewer.location || ''}
            />
          </div>
        </div>

        <ReviewContent
          businessName={review?.businessName || ''}
          businessType={review?.businessType || ''}
          rating={review?.rating || 0}
          reviewText={review?.reviewText || ''}
          date={review?.date || ''}
          likes={review?.likes || 0}
          images={review?.images}
        />
      </div>
    </li>
  );
}