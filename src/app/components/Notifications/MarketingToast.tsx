"use client";

import { useState, useEffect } from "react";

interface UploadNotification {
  id: string;
  type: 'business' | 'event';
  name: string;
  category?: string;
  location?: string;
  image?: string;
}

const MOCK_UPLOADS: UploadNotification[] = [
  {
    id: '1',
    type: 'business',
    name: 'Artisan Coffee Co.',
    category: 'Coffee Shop',
    location: 'Downtown',
    image: '☕'
  },
  {
    id: '2',
    type: 'event',
    name: 'Jazz Night at Blue Moon',
    category: 'Live Music',
    location: 'Blue Moon Bar',
    image: '🎵'
  },
  {
    id: '3',
    type: 'business',
    name: 'Fresh Bites Bistro',
    category: 'Restaurant',
    location: 'Uptown',
    image: '🍽️'
  },
  {
    id: '4',
    type: 'event',
    name: 'Art Gallery Opening',
    category: 'Art Exhibition',
    location: 'City Gallery',
    image: '🎨'
  },
  {
    id: '5',
    type: 'business',
    name: 'Urban Fitness Studio',
    category: 'Gym & Fitness',
    location: 'Midtown',
    image: '💪'
  }
];

export default function MarketingToast() {
  const [currentNotification, setCurrentNotification] = useState<UploadNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const showNextNotification = () => {
      if (MOCK_UPLOADS.length === 0) return;

      // Hide current notification
      setIsVisible(false);

      setTimeout(() => {
        // Show next notification
        const notification = MOCK_UPLOADS[currentIndex];
        setCurrentNotification(notification);
        setIsVisible(true);

        // Update index for next iteration
        setCurrentIndex((prev) => (prev + 1) % MOCK_UPLOADS.length);
      }, 300); // Small delay for smooth transition
    };

    // Show first notification immediately
    showNextNotification();

    // Then show every 7 seconds
    const interval = setInterval(showNextNotification, 7000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!currentNotification) return null;

  return (
    <div
      className={`
        fixed bottom-4 left-4 z-[9998] max-w-[280px] w-full
        transform transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
    >
      <div className={`
        bg-gradient-to-r from-sage/95 to-sage/90 backdrop-blur-xl
        border border-sage/20 rounded-2xl p-4 shadow-2xl
        relative overflow-hidden
      `}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start gap-3">
            {/* Icon/Image */}
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg">
              {currentNotification.image}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-coral rounded-full animate-pulse" />
                <span className="text-white/90 text-xs font-urbanist font-600 uppercase tracking-wide">
                  New {currentNotification.type}
                </span>
              </div>

              <h4 className="text-white font-urbanist font-700 text-sm leading-tight mb-1">
                {currentNotification.name}
              </h4>

              <div className="flex items-center gap-2 text-white/80 text-xs">
                {currentNotification.category && (
                  <>
                    <span>{currentNotification.category}</span>
                    {currentNotification.location && <span>•</span>}
                  </>
                )}
                {currentNotification.location && (
                  <span>{currentNotification.location}</span>
                )}
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className={`flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30
                       flex items-center justify-center transition-colors duration-200`}
              aria-label="Dismiss notification"
            >
              <ion-icon
                name="close"
                style={{ fontSize: '14px', color: 'white' }}
              />
            </button>
          </div>

          {/* CTA */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <button className={`
              w-full text-center text-white font-urbanist font-600 text-xs
              hover:text-coral transition-colors duration-200
            `}>
              Explore now →
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20">
          <div
            className="h-full bg-coral animate-pulse"
            style={{
              width: '100%',
              animation: 'progress 7s linear infinite'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}