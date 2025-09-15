"use client";

import { useRouter } from "next/navigation";
import ReviewerCard from "../ReviewerCard/ReviewerCard";
import BusinessOfTheMonthCard from "../BusinessCard/BusinessOfTheMonthCard";
import { Review, Reviewer, BusinessOfTheMonth } from "../../data/communityHighlightsData";

interface CommunityHighlightsProps {
  title?: string;
  reviews: Review[];
  topReviewers: Reviewer[];
  businessesOfTheMonth?: BusinessOfTheMonth[];
  cta?: string;
  href?: string;
  variant?: "reviews" | "reviewers";
}

export default function CommunityHighlights({
  title = "Community Highlights", 
  reviews,
  topReviewers,
  businessesOfTheMonth,
  cta = "See Leaderboard...",
  href = "/community",
  variant = "reviews"
}: CommunityHighlightsProps) {
  const router = useRouter();

  const handleSeeMore = () => {
    router.push(href);
  };

  const displayData = variant === "reviewers" 
    ? topReviewers.map(reviewer => ({
        id: reviewer.id,
        reviewer,
        businessName: "",
        businessType: "",
        rating: reviewer.rating,
        reviewText: "",
        date: "",
        likes: 0
      }))
    : reviews;

  return (
    <section className="bg-gradient-to-b from-off-white/95 to-off-white relative" aria-label="community highlights" data-section>
      {/* Subtle section decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-sage/8 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-xl" />
      </div>
      
      <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 md:px-8 relative z-10 py-8 sm:py-12 md:py-16">
        <div className="mb-8 sm:mb-10 md:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-[18px]">
          <div>
            <h2 className="font-urbanist text-2xl sm:text-3xl font-800 text-charcoal relative mb-2">
              {title}
              <div className="absolute -bottom-2 left-0 w-8 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r from-sage to-coral rounded-full" />
            </h2>
            
          </div>
          <button 
            onClick={handleSeeMore}
            className="group font-urbanist font-700 text-charcoal/70 transition-all duration-300 hover:text-sage hover:scale-105 text-lg sm:text-xl md:text-2xl self-start sm:self-auto"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-[-1px]">
              {cta}
            </span>
          </button>
        </div>

        {/* Top Reviewers Subsection */}
        <div className="mt-12 sm:mt-14 md:mt-16">
          <div className="mb-6 sm:mb-7 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-[18px]">
            <h3 className="font-urbanist text-xl sm:text-2xl font-700 text-charcoal relative">
              Top Reviewers This Month In Claremont
            </h3>
            
          </div>

          <div className="overflow-hidden">
            <ul className="flex snap-x gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 sm:pb-5 md:pb-6 -mb-4 sm:-mb-5 md:-mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
              {topReviewers.map((reviewer) => (
                <div key={reviewer.id}>
                  <ReviewerCard 
                    reviewer={reviewer}
                    variant="reviewer"
                  />
                </div>
              ))}
            </ul>
          </div>
        </div>

        {/* Businesses of the Month Subsection */}
        {businessesOfTheMonth && businessesOfTheMonth.length > 0 && (
          <div className="mt-12 sm:mt-14 md:mt-16">
            <div className="mb-6 sm:mb-7 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-[18px]">
              <h3 className="font-urbanist text-xl sm:text-2xl font-700 text-charcoal relative">
                Businesses of the Month
              </h3>
              <button 
                onClick={() => router.push('/awards')}
                className="group font-urbanist font-700 text-charcoal/70 transition-all duration-300 hover:text-coral hover:scale-105 text-lg sm:text-xl md:text-2xl self-start sm:self-auto"
              >
                <span className="transition-transform duration-300 group-hover:translate-x-[-1px]">
                  View All Awards
                </span>
              </button>
            </div>

            <div className="mb-4 sm:mb-5 md:mb-6 text-center">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-coral/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                <ion-icon name="trophy" class="text-coral text-base sm:text-lg" />
                <span className="font-urbanist font-600 text-coral text-[14px] sm:text-base">
                  September 2025 Winners
                </span>
              </div>
            </div>

            <div className="overflow-hidden">
              <ul className="flex snap-x gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 sm:pb-5 md:pb-6 -mb-4 sm:-mb-5 md:-mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
                {businessesOfTheMonth.map((business) => (
                  <div key={business.id}>
                    <BusinessOfTheMonthCard business={business} />
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}