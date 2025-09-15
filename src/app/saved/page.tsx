"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header/Header";
import BusinessCard from "../components/BusinessCard/BusinessCard";
import { TRENDING_BUSINESSES } from "../data/businessData";

// Dynamic import for bottom navigation
const BottomNav = dynamic(() => import("../components/Navigation/BottomNav"));
const ScrollReveal = dynamic(() => import("../components/Animations/ScrollReveal"), {
  ssr: false,
});

export default function SavedPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mock saved businesses - in real app this would come from user data
  const savedBusinesses = TRENDING_BUSINESSES.slice(0, 3);
  const categories = ["All", "Restaurants", "Services", "Shopping"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="pt-[124px] md:pt-[144px] pb-24 md:pb-6 relative z-10">
        <div className="px-4 sm:px-6 md:px-8 mb-6">
          <div className="max-w-[1300px] mx-auto">
            <ScrollReveal delay={0.1}>
              <div className="text-center mb-8">
                <h1 className="font-urbanist text-2 md:text-4xl font-700 text-charcoal mb-4">
                  Saved Gems
                </h1>
                <p className="font-urbanist text-6 md:text-5 text-charcoal/70 max-w-md mx-auto">
                  Your collection of favorite local spots
                </p>
              </div>
            </ScrollReveal>

            {/* Category Filter */}
            <ScrollReveal delay={0.2}>
              <div className="horizontal-scroll flex space-x-3 mb-8 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-full font-urbanist text-7 font-500 whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-sage text-white shadow-lg"
                        : "bg-white/80 text-charcoal/70 hover:bg-sage/10 hover:text-sage border border-sage/20"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Saved Businesses */}
            {savedBusinesses.length > 0 ? (
              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {savedBusinesses.map((business, index) => (
                    <div key={business.id} className="relative">
                      <BusinessCard business={business} />
                      {/* Saved indicator */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-coral rounded-full flex items-center justify-center shadow-lg">
                        <ion-icon
                          name="bookmark"
                          style={{ color: "white", fontSize: "16px" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            ) : (
              <ScrollReveal delay={0.3}>
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-sage/10 rounded-full flex items-center justify-center">
                    <ion-icon
                      name="bookmark-outline"
                      style={{ fontSize: "32px", color: "#749176" }}
                    />
                  </div>
                  <h3 className="font-urbanist text-5 font-600 text-charcoal mb-4">
                    No saved gems yet
                  </h3>
                  <p className="font-urbanist text-6 text-charcoal/70 mb-8 max-w-sm mx-auto">
                    Start exploring and save your favorite local businesses to see them here
                  </p>
                  <a
                    href="/all"
                    className="inline-flex items-center px-6 py-3 bg-sage text-white font-urbanist text-6 font-600 rounded-full hover:bg-sage/90 transition-all duration-300 shadow-lg"
                  >
                    <ion-icon name="search-outline" style={{ marginRight: "8px" }} />
                    Explore Gems
                  </a>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}