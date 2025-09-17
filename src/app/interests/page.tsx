"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useOnboarding } from "../contexts/OnboardingContext";

// CSS animations for decorative elements
const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-600 { animation-delay: 0.6s; }
`;

interface Interest {
  id: string;
  name: string;
}

const interests: Interest[] = [
  { id: "food-drink", name: "Food & Drink" },
  { id: "beauty-wellness", name: "Beauty & Wellness" },
  { id: "home-services", name: "Home & Services" },
  { id: "outdoors-adventure", name: "Outdoors & Adventure" },
  { id: "nightlife-entertainment", name: "Nightlife & Entertainment" },
  { id: "arts-culture", name: "Arts & Culture" },
  { id: "family-pets", name: "Family & Pets" },
  { id: "shopping-lifestyle", name: "Shopping & Lifestyle" },
];

function InterestsContent() {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const fullText = "Let's get to know you";
  const hasLoadedInterests = useRef(false);

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

  // Load interests on mount
  useEffect(() => {
    if (!hasLoadedInterests.current && availableInterests.length === 0 && !onboardingLoading) {
      hasLoadedInterests.current = true;
      loadInterests();
    }
  }, [loadInterests, availableInterests.length, onboardingLoading]);

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
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col px-4 py-6 sm:py-8 relative overflow-hidden">
      {/* Back button - top left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link href="/register" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full">
          <ion-icon name="arrow-back-outline" size="small"></ion-icon>
        </Link>
      </div>


      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative z-10 flex-1 flex flex-col justify-center py-8 sm:py-12">
        {/* Header with premium styling */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="inline-block relative mb-6">
            <h2 className="font-urbanist text-2xl md:text-4xl lg:text-5xl font-700 text-charcoal mb-3 md:mb-3 text-center leading-snug px-2 tracking-[0.01em]">
              <span className="relative">
                {displayedText}
                <span
                  className={`inline-block w-1 md:w-2 h-6 md:h-12 bg-sage ml-1 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                  style={{ animation: showCursor ? 'blink 1s infinite' : 'none' }}
                ></span>
              </span>
            </h2>
          </div>
          <p className="font-urbanist text-sm md:text-base font-400 text-charcoal/70 mb-10 md:mb-12 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto">
            Pick a few things you love and let&apos;s personalize your experience!
          </p>
        </div>

        {/* Premium Interests Card */}
        <div className="bg-off-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 mb-4 sm:mb-6 relative overflow-visible">

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
                    relative z-30 w-[85%] aspect-square rounded-full border-2 transition-all duration-300 ease-out mx-auto
                    ${selectedInterests.includes(interest.id)
                      ? 'bg-coral border-coral text-white shadow-lg animate-bounce'
                      : 'bg-sage border-sage text-white hover:bg-sage/90'
                    }
                    focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2
                  `}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="font-urbanist text-7 md:text-6 font-600 text-center leading-tight">
                      {interest.name}
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
                      group block w-full bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 text-white font-urbanist text-sm md:text-base font-600 py-3.5 md:py-4 px-6 md:px-8 rounded-2xl md:rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sage/20 hover:focus:ring-coral/20 focus:ring-offset-1 relative overflow-hidden text-center hover:scale-[1.02] overflow-hidden
                      ${canProceed
                        ? 'bg-gradient-to-r from-sage to-sage/90 text-white hover:scale-105 shadow-lg  focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2'
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
    </>
  );
}

export default function InterestsPage() {
  return <InterestsContent />;
}
