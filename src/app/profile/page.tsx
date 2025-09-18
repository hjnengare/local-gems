"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header/Header";
// NOTE: We’re not using your existing FallbackImage here; this file includes its own SafeAvatar.
// If you prefer your component, swap it back in where <SafeAvatar /> is used.
import { useScrollReveal } from "../hooks/useScrollReveal";

// Dynamic imports
const BottomNav = dynamic(() => import("../components/Navigation/BottomNav"), { ssr: false });

/** A robust avatar that:
 *  - Uses `profilePicture` if provided
 *  - Falls back to DiceBear initials (already allowed in your next.config.js)
 *  - Handles image load errors and swaps to fallback gracefully
 */
function SafeAvatar({
  src,
  alt,
  username,
  size = 64,
  className = "",
}: {
  src?: string;
  alt: string;
  username: string;
  size?: number;
  className?: string;
}) {
  // Build a pretty DiceBear initials avatar as fallback
  const dicebear = useMemo(() => {
    const seed = encodeURIComponent(username || "User");
    // You already allowed api.dicebear.com in next.config.js
    return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundType=gradientLinear&fontWeight=700`;
  }, [username]);

  const [currentSrc, setCurrentSrc] = useState<string>(src && src.trim() ? src : dicebear);
  const [errored, setErrored] = useState(false);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
      // If the remote image 404s or fails, switch to DiceBear
      onError={() => {
        if (!errored) {
          setErrored(true);
          setCurrentSrc(dicebear);
        }
      }}
      // Optional blur placeholder for nicer loading
      placeholder="empty"
      // NOTE: if you are doing static export, use `unoptimized` here or set `images.unoptimized = true`
      // unoptimized
    />
  );
}

function ProfileContent() {
  const { user, logout } = useAuth();
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Mock user data - based on wireframe
  const userData = {
    username: "JessCleigh",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", // Empty on purpose to trigger fallback
    isTopReviewer: true,
    reviewsCount: 120,
    badgesCount: 3,
    memberSince: "Jan 1 '24",
    achievements: [
      { id: 1, name: "Trust Expert", icon: "shield-checkmark", earned: true },
      { id: 2, name: "Top Reviewer in Cape Town March 2023", icon: "trophy", earned: true },
      { id: 3, name: "Local Explorer", icon: "location", earned: false }
    ],
    recentReviews: [
      { id: 1, business: "Mama's Kitchen", rating: 4, date: "Feb 2023", featured: true },
      { id: 2, business: "Tiger's Milk",  rating: 4, date: "March 2023", featured: false }
    ]
  };

  // IMPORTANT: pass tokens separately to avoid DOMTokenList InvalidCharacterError
  const headerRef = useScrollReveal({ className: ["scroll-reveal"] });
  const statsRef = useScrollReveal({ className: ["scroll-reveal", "stagger-1"] });
  const contributionsRef = useScrollReveal({ className: ["scroll-reveal", "stagger-2"] });
  const achievementsRef = useScrollReveal({ className: ["scroll-reveal", "stagger-3"] });
  const settingsRef = useScrollReveal({ className: ["scroll-reveal", "stagger-4"] });

  const handleLogout = () => {
    logout();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <ion-icon
        key={index}
        name={index < rating ? "star" : "star-outline"}
        style={{ color: index < rating ? "#FF6B6B" : "#D1D5DB", fontSize: "14px" }}
      />
    ));
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white relative">
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
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Profile Header Card */}
            <div ref={headerRef} className="bg-off-white/90 backdrop-blur-sm p-6 border border-sage/10 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-sage/20">
                      <SafeAvatar
                        src={userData.profilePicture}
                        alt="Profile picture"
                        username={userData.username}
                        size={64}
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h1 className="font-urbanist text-xl font-700 text-charcoal">
                        @{userData.username}
                      </h1>
                      <span className="text-xs text-coral font-500">Username</span>
                    </div>
                    {userData.isTopReviewer && (
                      <div className="flex items-center space-x-1 mb-2">
                        <ion-icon name="trophy" style={{ color: "#FF6B6B", fontSize: "16px" }} />
                        <span className="text-sm font-600 text-coral">
                          Top Reviewer in Cape Town this Month
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button className="w-8 h-8 bg-sage/10 hover:bg-sage/20 rounded-full flex items-center justify-center transition-colors duration-200">
                  <ion-icon name="create-outline" style={{ color: "#749176", fontSize: "16px" }} />
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div ref={statsRef} className="bg-off-white/90 backdrop-blur-sm p-5 border border-sage/10 shadow-sm">
              <h2 className="font-urbanist text-lg font-600 text-charcoal mb-4">Stats Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ion-icon name="star" style={{ color: "#FF6B6B", fontSize: "18px", marginRight: "4px" }} />
                    <span className="font-urbanist text-2xl font-700 text-charcoal">
                      {userData.reviewsCount}
                    </span>
                  </div>
                  <span className="text-sm text-charcoal/60">reviews</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ion-icon name="trophy" style={{ color: "#749176", fontSize: "18px", marginRight: "4px" }} />
                    <span className="font-urbanist text-2xl font-700 text-charcoal">
                      {userData.badgesCount}
                    </span>
                  </div>
                  <span className="text-sm text-charcoal/60">Badges</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ion-icon name="calendar" style={{ color: "#749176", fontSize: "18px", marginRight: "4px" }} />
                    <span className="font-urbanist text-sm font-600 text-charcoal">
                      Member since {userData.memberSince}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Contributions */}
            <div ref={contributionsRef} className="bg-off-white/90 backdrop-blur-sm p-5 border border-sage/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-urbanist text-lg font-600 text-charcoal">Your Contributions</h2>
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-sm text-coral font-500 hover:text-coral/80 transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>{showAllReviews ? "Hide" : "See all reviews"}</span>
                  <ion-icon name={showAllReviews ? "chevron-up" : "chevron-forward"} style={{ fontSize: "14px" }} />
                </button>
              </div>
              <div className="space-y-3">
                {userData.recentReviews.slice(0, showAllReviews ? undefined : 2).map((review) => (
                  <div key={review.id} className="flex items-center justify-between py-3 border-b border-sage/10 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-urbanist text-base font-600 text-charcoal">
                          {review.business}
                        </span>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        {review.featured && (
                          <span className="text-xs text-coral font-500">
                            (Featured)
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-charcoal/60">
                        {review.date}
                      </span>
                    </div>
                    <div className="text-right">
                      <button className="text-coral text-sm font-500 hover:text-coral/80 transition-colors duration-200">
                        Click to see
                      </button>
                      <div className="text-xs text-charcoal/50 mt-1">
                        full review
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Achievements */}
            <div ref={achievementsRef} className="bg-off-white/90 backdrop-blur-sm p-5 border border-sage/10 shadow-sm">
              <h2 className="font-urbanist text-lg font-600 text-charcoal mb-4">Your Achievements</h2>
              <div className="space-y-3">
                {userData.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center space-x-3 p-3 transition-all duration-200 ${
                      achievement.earned ? "bg-sage/10 border border-sage/20" : "bg-gray-50 border border-gray-200 opacity-60"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.earned ? "bg-sage/20" : "bg-gray-200"
                      }`}
                    >
                      <ion-icon
                        name={achievement.icon}
                        style={{ color: achievement.earned ? "#749176" : "#9CA3AF", fontSize: "20px" }}
                      />
                    </div>
                    <div className="flex-1">
                      <span
                        className={`font-urbanist text-base font-600 ${
                          achievement.earned ? "text-charcoal" : "text-gray-400"
                        }`}
                      >
                        {achievement.name}
                      </span>
                    </div>
                    {achievement.earned && (
                      <ion-icon name="checkmark-circle" style={{ color: "#749176", fontSize: "18px" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Account Settings */}
            <div ref={settingsRef} className="bg-off-white/90 backdrop-blur-sm p-5 border border-sage/10 shadow-sm">
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group">
                  <div className="flex items-center space-x-3">
                    <ion-icon name="settings-outline" style={{ color: "#6B7280", fontSize: "20px" }} />
                    <span className="font-urbanist text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                      Account Settings
                    </span>
                  </div>
                  <ion-icon name="chevron-forward" style={{ color: "#9CA3AF", fontSize: "16px" }} />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group">
                  <div className="flex items-center space-x-3">
                    <ion-icon name="notifications-outline" style={{ color: "#6B7280", fontSize: "20px" }} />
                    <span className="font-urbanist text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                      Notifications
                    </span>
                  </div>
                  <ion-icon name="chevron-forward" style={{ color: "#9CA3AF", fontSize: "16px" }} />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group">
                  <div className="flex items-center space-x-3">
                    <ion-icon name="lock-closed-outline" style={{ color: "#6B7280", fontSize: "20px" }} />
                    <span className="font-urbanist text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                      Privacy & Data
                    </span>
                  </div>
                  <ion-icon name="chevron-forward" style={{ color: "#9CA3AF", fontSize: "16px" }} />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 hover:bg-coral/5 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <ion-icon name="log-out-outline" style={{ color: "#FF6B6B", fontSize: "20px" }} />
                    <span className="font-urbanist text-base font-500 text-coral group-hover:text-coral/80 transition-colors duration-200">
                      Log Out
                    </span>
                  </div>
                  <ion-icon name="chevron-forward" style={{ color: "#FF6B6B", fontSize: "16px" }} />
                </button>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4">
              <Link
                href="/home"
                className="w-full bg-sage/10 hover:bg-sage/15 p-4 font-urbanist text-base font-600 text-sage hover:text-sage/80 transition-all duration-300 flex items-center justify-center space-x-2 border border-sage/20"
              >
                <ion-icon name="chevron-back" style={{ fontSize: "18px" }} />
                <span>Back</span>
              </Link>
            </div>

          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
