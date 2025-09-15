"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { OnboardingRoute } from "../components/ProtectedRoute/ProtectedRoute";
import { useRouter } from "next/navigation";

interface Interest {
  id: string;
  label: string;
  subcategory: string;
}

const interests: Interest[] = [
  { id: "food-drink", label: "Food & Drink", subcategory: "food-drink" },
  { id: "beauty-wellness", label: "Beauty & Wellness", subcategory: "beauty-wellness" },
  { id: "home-services", label: "Home & Services", subcategory: "home-services" },
  { id: "outdoors-adventure", label: "Outdoors & Adventure", subcategory: "outdoors-adventure" },
  { id: "nightlife-entertainment", label: "Nightlife & Entertainment", subcategory: "nightlife-entertainment" },
  { id: "arts-culture", label: "Arts & Culture", subcategory: "arts-culture" },
  { id: "family-pets", label: "Family & Pets", subcategory: "family-pets" },
  { id: "shopping-lifestyle", label: "Shopping & Lifestyle", subcategory: "shopping-lifestyle" },
];

function InterestsContent() {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const fullText = "Let's get to know you";

  const { user } = useAuth();
  const {
    interests: availableInterests,
    selectedInterests,
    setSelectedInterests,
    nextStep,
    loadInterests,
    isLoading: onboardingLoading,
    error: onboardingError
  } = useOnboarding();
  const router = useRouter();

  // Load interests on mount
  useEffect(() => {
    loadInterests();
  }, [loadInterests]);

  useEffect(() => {
    let currentIndex = 0;

    // Start cursor blinking immediately
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Start typing after a small delay
    const startTyping = () => {
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          // Typing completed - hide cursor permanently
          clearInterval(typingInterval);
          clearInterval(cursorInterval);
          setShowCursor(false);
        }
      }, 80);
      return typingInterval;
    };

    // Start typing immediately
    const typingInterval = startTyping();

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [fullText]);

  const handleInterestToggle = useCallback((interestId: string) => {
    const newSelection = selectedInterests.includes(interestId)
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];
    setSelectedInterests(newSelection);
  }, [selectedInterests, setSelectedInterests]);

  const canProceed = useMemo(() =>
    selectedInterests.length > 0 && user && !isNavigating,
    [selectedInterests.length, user, isNavigating]
  );

  const handleNext = useCallback(async () => {
    if (!canProceed || onboardingLoading) return;

    setIsNavigating(true);
    try {
      await nextStep();
      // Navigation will be handled by the onboarding context
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      setIsNavigating(false);
    }
  }, [canProceed, nextStep, onboardingLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Back button - top left */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/register" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full">
          <ion-icon name="arrow-back-outline" size="small"></ion-icon>
        </Link>
      </div>

      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 opacity-4">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sage/20 to-sage/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-coral/15 to-coral/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-charcoal/10 to-charcoal/3 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Subtle geometric accents */}
        <div className="absolute top-16 right-20 w-1 h-1 bg-sage/30 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-1 h-1 bg-coral/30 rounded-full animate-ping delay-1500"></div>
      </div>

      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-off-white/30 via-transparent to-off-white/20 pointer-events-none"></div>

      <div className="w-[90%] max-w-[700px] mx-auto relative z-10">
        {/* Header with premium styling */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block relative mb-6">
            <h1 className="font-urbanist text-2 md:text-6xl lg:text-5xl font-700 text-charcoal mb-4 relative min-h-[3rem] md:min-h-[5rem] flex items-center justify-center">
              <span className="relative">
                {displayedText}
                <span
                  className={`inline-block w-1 md:w-2 h-6 md:h-12 bg-sage ml-1 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                  style={{ animation: showCursor ? 'blink 1s infinite' : 'none' }}
                ></span>
              </span>
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-sage via-coral to-sage rounded-full"></div>
          </div>
          <p className="font-urbanist text-6 md:text-5 font-400 text-charcoal/70 max-w-md mx-auto leading-relaxed">
            Pick a few things you love and let&apos;s personalize your experience
          </p>
        </div>

        {/* Premium Interests Card */}
        <div className="bg-off-white/95 backdrop-blur-lg rounded-3 p-6 md:p-16 mb-8 relative overflow-visible md:py-10">
          {/* Card decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-2xl"></div>

          <div className="relative z-10 py-8">
            {/* Error Message */}
            {onboardingError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-6">
                <p className="font-urbanist text-sm font-600 text-red-600">{onboardingError}</p>
              </div>
            )}

            {/* Loading State */}
            {onboardingLoading && availableInterests.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-urbanist text-base text-charcoal/70">Loading interests...</p>
              </div>
            ) : (
              <>
                {/* Interests Grid - Preserving Wireframe Style */}
                <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12 overflow-visible">
                  {(availableInterests.length > 0 ? availableInterests : interests).map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`
                    relative z-30 w-[85%] aspect-square rounded-full border-2 transition-all duration-300 ease-cubic-out mx-auto
                    ${selectedInterests.includes(interest.id)
                      ? 'bg-coral border-coral text-white shadow-lg animate-bounce'
                      : 'bg-sage border-sage text-white hover:bg-sage/90'
                    }
                    focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2
                  `}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="font-urbanist text-7 md:text-6 font-600 text-center leading-tight">
                      {interest.name || interest.label}
                    </span>
                    {selectedInterests.includes(interest.id) && (
                      <div className="absolute top-2 right-2">
                        <ion-icon name="checkmark-circle" size="small" style={{ color: 'white' }}></ion-icon>
                      </div>
                    )}
                  </div>
                </button>
              ))}
                </div>

                {/* Next Button */}
                <div className="pt-6">
                  <button
                    className={`
                      group block w-full py-5 md:w-1/2 md:py-6 px-8 md:px-10 rounded-3 md:rounded-full text-center font-urbanist text-6 md:text-5 font-600 transition-all duration-300 relative overflow-hidden
                      ${canProceed
                        ? 'bg-gradient-to-r from-sage to-sage/90 text-white hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2'
                        : 'bg-light-gray/50 text-charcoal/40 cursor-not-allowed'
                      }
                    `}
                    onClick={handleNext}
                    disabled={!canProceed}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {(isNavigating || onboardingLoading) && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      )}
                      Next {selectedInterests.length > 0 && `(${selectedInterests.length} selected)`}
                    </span>
                    {canProceed && (
                      <div className="absolute inset-0 bg-gradient-to-r from-sage/80 to-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center items-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-sage rounded-full"></div>
          <div className="w-3 h-3 bg-charcoal/20 rounded-full"></div>
          <div className="w-3 h-3 bg-charcoal/20 rounded-full"></div>
          <div className="w-3 h-3 bg-charcoal/20 rounded-full"></div>
        </div>

        <div className="text-center">
          <p className="font-urbanist text-8 font-400 text-charcoal/50">
            Step 1 of 4
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InterestsPage() {
  return (
    <OnboardingRoute step="interests">
      <InterestsContent />
    </OnboardingRoute>
  );
}
