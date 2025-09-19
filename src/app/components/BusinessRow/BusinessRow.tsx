"use client";

import { useRouter } from "next/navigation";
import BusinessCard, { Business } from "../BusinessCard/BusinessCard";
import ScrollableSection from "../ScrollableSection/ScrollableSection";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import KlioLoader from "../KlioLoader/KlioLoader";

export default function BusinessRow({
  title,
  businesses,
  loading = false,
  error = null,
  cta = "View All",
  href = "/all",
}: {
  title: string;
  businesses: Business[];
  loading?: boolean;
  error?: string | null;
  cta?: string;
  href?: string;
}) {
  const router = useRouter();
  const titleRef = useScrollReveal({ className: 'scroll-reveal-left' });
  const sectionRef = useScrollReveal({ className: 'scroll-reveal' });

  const handleSeeMore = () => {
    router.push(href);
  };
  return (
    <section ref={sectionRef} className="pb-4 sm:pb-6 sm:pt-2 bg-gradient-to-b from-off-white to-off-white/95 relative" aria-label="businesses" data-section>
      {/* Subtle section decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-xl" />
      </div>
      
      <div className="container mx-auto max-w-[1300px] px-4 relative z-10">
        <div ref={titleRef} className="mb-6 sm:mb-12 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="font-urbanist text-xl font-800 text-charcoal relative">
            {title}
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-sage to-coral rounded-full" />
          </h2>
          <button
            onClick={handleSeeMore}
            className="group font-urbanist font-700 text-charcoal/70 transition-all duration-300 hover:text-sage text-base premium-hover"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-[-1px]">
              See More...
            </span>
          </button>
        </div>

        <ScrollableSection>
          <div className="flex gap-6">
            {loading ? (
              // Minimal loading state
              <div className="w-full flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-sage/30 border-t-sage rounded-full animate-spin"></div>
                  <span className="font-urbanist text-sm text-charcoal/60">Loading {title.toLowerCase()}...</span>
                </div>
              </div>
            ) : error ? (
              // Error state
              <div className="w-full text-center py-12">
                <div className="text-charcoal/60 mb-4">
                  <ion-icon name="alert-circle-outline" size="large" />
                </div>
                <h3 className="font-urbanist font-600 text-charcoal mb-2">Failed to load businesses</h3>
                <p className="font-urbanist text-sm text-charcoal/60">{error}</p>
              </div>
            ) : businesses.length === 0 ? (
              // Empty state
              <div className="w-full text-center py-12">
                <div className="text-charcoal/40 mb-4">
                  <ion-icon name="business-outline" size="large" />
                </div>
                <h3 className="font-urbanist font-600 text-charcoal/60 mb-2">No businesses found</h3>
                <p className="font-urbanist text-sm text-charcoal/40">Check back later for new recommendations</p>
              </div>
            ) : (
              // Business cards
              businesses.map((business, index) => (
                <div
                  key={business.id}
                  className={`premium-hover card-entrance card-entrance-${Math.min(index + 1, 6)}`}
                  data-scroll-reveal
                >
                  <BusinessCard business={business} />
                </div>
              ))
            )}
          </div>
        </ScrollableSection>
      </div>
    </section>
  );
}