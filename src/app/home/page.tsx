"use client";

import dynamic from "next/dynamic";
import Header from "../components/Header/Header";
import BusinessRow from "../components/BusinessRow/BusinessRow";
import { TRENDING_BUSINESSES, NEARBY_FAVORITES } from "../data/businessData";
import { EVENTS_AND_SPECIALS } from "../data/eventsData";
import { FEATURED_REVIEWS, TOP_REVIEWERS, BUSINESSES_OF_THE_MONTH } from "../data/communityHighlightsData";

// Dynamic imports for heavy components
const EventsSpecials = dynamic(() => import("../components/EventsSpecials/EventsSpecials"), {
  loading: () => (
    <div className="px-4 sm:px-6 md:px-8 mb-8 md:mb-16">
      <div className="max-w-[1300px] mx-auto">
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
      </div>
    </div>
  ),
});

const CommunityHighlights = dynamic(() => import("../components/CommunityHighlights/CommunityHighlights"), {
  loading: () => (
    <div className="px-4 sm:px-6 md:px-8 mb-8 md:mb-16">
      <div className="max-w-[1300px] mx-auto">
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
      </div>
    </div>
  ),
});

const ScrollReveal = dynamic(() => import("../components/Animations/ScrollReveal"), {
  ssr: false,
});

const FloatingElements = dynamic(() => import("../components/Animations/FloatingElements"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white relative overflow-hidden">
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
      <div className="pt-[124px] md:pt-[144px] relative z-10">
      
        {/* Business Rows with Enhanced Scroll Animations */}
        <ScrollReveal delay={0.2} threshold={0.2} distance={100} direction="up">
          <BusinessRow title="For You" businesses={TRENDING_BUSINESSES} cta="View All Trending" />
        </ScrollReveal>

        <ScrollReveal delay={0.1} threshold={0.15} distance={80} direction="right">
          <BusinessRow title="Trending Now" businesses={NEARBY_FAVORITES} cta="View All Favorites" />
        </ScrollReveal>

        <ScrollReveal delay={0.3} threshold={0.2} distance={120} direction="left">
          <EventsSpecials events={EVENTS_AND_SPECIALS} />
        </ScrollReveal>

        <ScrollReveal delay={0.4} threshold={0.25} distance={90} direction="up">
          <CommunityHighlights
            reviews={FEATURED_REVIEWS}
            topReviewers={TOP_REVIEWERS}
            businessesOfTheMonth={BUSINESSES_OF_THE_MONTH}
            variant="reviews"
          />
        </ScrollReveal>

       
      </div>

      {/* Static background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-2xl" />
      </div>
    </div>
  );
}