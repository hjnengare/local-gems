"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header/Header";

// Dynamic imports
const BottomNav = dynamic(() => import("../components/Navigation/BottomNav"));
const ScrollReveal = dynamic(() => import("../components/Animations/ScrollReveal"), {
  ssr: false,
});

export default function ProfilePage() {
  const { user, logout } = useAuth();

  // Mock user stats - in real app this would come from API
  const userStats = {
    reviewsCount: 24,
    savedCount: 12,
    badgesCount: 3,
    level: "Local Explorer",
    points: 1250,
    nextLevelPoints: 1500
  };

  const handleLogout = () => {
    logout();
  };

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
        <div className="px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">

            {/* Profile Header */}
            <ScrollReveal delay={0.1}>
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-sage to-coral rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-urbanist text-2 font-700">
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <h1 className="font-urbanist text-2 md:text-4xl font-700 text-charcoal mb-2">
                  {user?.username || "User"}
                </h1>
                <p className="font-urbanist text-6 text-charcoal/70 mb-4">
                  {userStats.level}
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-sage/10 rounded-full">
                  <ion-icon name="star" style={{ color: "#749176", marginRight: "6px" }} />
                  <span className="font-urbanist text-7 font-600 text-sage">
                    {userStats.points} points
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Stats Cards */}
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-sage/10">
                  <div className="text-2 font-700 text-charcoal">{userStats.reviewsCount}</div>
                  <div className="text-7 text-charcoal/70">Reviews</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-coral/10">
                  <div className="text-2 font-700 text-charcoal">{userStats.savedCount}</div>
                  <div className="text-7 text-charcoal/70">Saved</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-sage/10">
                  <div className="text-2 font-700 text-charcoal">{userStats.badgesCount}</div>
                  <div className="text-7 text-charcoal/70">Badges</div>
                </div>
              </div>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal delay={0.3}>
              <div className="space-y-4">
                <button className="w-full bg-white/80 backdrop-blur-sm border border-sage/20 rounded-2xl p-4 font-urbanist text-6 font-500 text-charcoal hover:bg-sage/10 hover:border-sage/40 transition-all duration-300 flex items-center justify-center">
                  <ion-icon name="settings-outline" style={{ marginRight: "8px" }} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-white/80 backdrop-blur-sm border border-coral/20 rounded-2xl p-4 font-urbanist text-6 font-500 text-coral hover:bg-coral/10 hover:border-coral/40 transition-all duration-300 flex items-center justify-center"
                >
                  <ion-icon name="log-out-outline" style={{ marginRight: "8px" }} />
                  Sign Out
                </button>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}