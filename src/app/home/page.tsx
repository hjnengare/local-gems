"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header/Header";
import BusinessRow from "../components/BusinessRow/BusinessRow";
import { useScrollRevealMultiple } from "../hooks/useScrollReveal";
import { TRENDING_BUSINESSES, NEARBY_FAVORITES } from "../data/businessData";
import { EVENTS_AND_SPECIALS } from "../data/eventsData";
import { FEATURED_REVIEWS, TOP_REVIEWERS, BUSINESSES_OF_THE_MONTH } from "../data/communityHighlightsData";

// Dynamic imports for heavy components with optimized loading
const EventsSpecials = dynamic(() => import("../components/EventsSpecials/EventsSpecials"), {
  loading: () => (
    <div className="px-4 sm:px-6 md:px-8 mb-8 md:mb-16">
      <div className="max-w-[1300px] mx-auto">
        <div className="animate-pulse bg-sage/10 rounded-2xl h-64"></div>
      </div>
    </div>
  ),
  ssr: false, // Disable SSR for heavy components
});

const CommunityHighlights = dynamic(() => import("../components/CommunityHighlights/CommunityHighlights"), {
  loading: () => (
    <div className="px-4 sm:px-6 md:px-8 mb-8 md:mb-16">
      <div className="max-w-[1300px] mx-auto">
        <div className="animate-pulse bg-coral/10 rounded-2xl h-64"></div>
      </div>
    </div>
  ),
  ssr: false,
});

const FloatingElements = dynamic(() => import("../components/Animations/FloatingElements"), {
  ssr: false,
  loading: () => null,
});

const BottomNav = dynamic(() => import("../components/Navigation/BottomNav"), {
  loading: () => null,
});

const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

// Memoized BusinessRow component
const MemoizedBusinessRow = memo(BusinessRow);

export default function Home() {
  // Initialize scroll reveal for all data-scroll-reveal elements
  useScrollRevealMultiple({ staggerDelay: 150 });

  return (
    <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white relative overflow-hidden">
      {/* Static background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/3 via-transparent to-coral/3" />
        <div className="absolute inset-0 bg-gradient-to-tr from-off-white/50 via-transparent to-off-white/30" />
      </div>

      {/* Floating elements without parallax */}
      <FloatingElements />

      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="pt-[124px] md:pt-[144px] pb-24 md:pb-6 relative z-10">
      
        {/* Business Rows with Enhanced CSS Scroll Animations */}
        <div className="scroll-reveal stagger-1" data-scroll-reveal>
          <MemoizedBusinessRow title="For You" businesses={TRENDING_BUSINESSES} cta="View All Trending" />
        </div>

        <div className="scroll-reveal-right stagger-2" data-scroll-reveal>
          <MemoizedBusinessRow title="Trending Now" businesses={NEARBY_FAVORITES} cta="View All Favorites" />
        </div>

        <div className="scroll-reveal-left stagger-3" data-scroll-reveal>
          <EventsSpecials events={EVENTS_AND_SPECIALS} />
        </div>

        <div className="scroll-reveal-scale stagger-4" data-scroll-reveal>
          <CommunityHighlights
            reviews={FEATURED_REVIEWS}
            topReviewers={TOP_REVIEWERS}
            businessesOfTheMonth={BUSINESSES_OF_THE_MONTH}
            variant="reviews"
          />
        </div>

       
      </div>

      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-3xl gentle-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-2xl gentle-float-delayed" />
      </div>

      {/* Footer - only on larger screens */}
      <Footer />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}