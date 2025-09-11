"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function OnboardingPage() {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Discover trusted local gems near you!";
  
  useEffect(() => {
    let currentIndex = 0;
    let typingInterval;
    let cursorInterval;
    
    // Start cursor blinking immediately
    cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    // Start typing after a small delay
    const startTyping = () => {
      typingInterval = setInterval(() => {
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
    };
    
    // Start typing immediately
    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 opacity-8">
        {/* Main floating orbs */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-sage/30 to-sage/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-56 h-56 bg-gradient-to-br from-coral/25 to-coral/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-charcoal/20 to-charcoal/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Additional subtle orbs */}
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-sage/15 to-sage/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-gradient-to-br from-coral/20 to-coral/5 rounded-full blur-3xl animate-pulse delay-3000"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-sage/20 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-10 left-10 w-2 h-2 bg-coral/20 rounded-full animate-ping delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-charcoal/25 rounded-full animate-ping delay-500"></div>
      </div>
      
      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-off-white/50 via-transparent to-off-white/30 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-sage/3 via-transparent to-coral/3 pointer-events-none"></div>

      <div className="w-full max-w-full px-6 md:max-w-4xl md:px-4 mx-auto relative z-10">
        {/* App Name */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block relative">
            <h1 className="font-urbanist text-4 md:text-4xl font-700 text-charcoal mb-2 relative">
              Local Gems
            </h1>
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-sage via-coral to-sage rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-urbanist text-2 md:text-6xl lg:text-7xl font-700 text-charcoal mb-8 md:mb-8 text-center leading-tight px-2 min-h-[4rem] md:min-h-[8rem] flex items-center justify-center">
            <span className="relative">
              {displayedText}
              <span 
                className={`inline-block w-1 md:w-2 h-8 md:h-16 bg-sage ml-1 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ animation: showCursor ? 'blink 1s infinite' : 'none' }}
              ></span>
            </span>
          </h2>
          
          <p className="font-urbanist text-6 md:text-5 font-400 text-charcoal/70 mb-12 md:mb-16 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto">
            Let&apos;s find your new favourite spot and connect with authentic experiences in your community
          </p>

          <div className="space-y-6 md:space-y-6 max-w-xs md:max-w-md mx-auto">
            <Link
              href="/register"
              className="group block w-full bg-gradient-to-r from-sage to-sage/90 text-white font-urbanist text-6 md:text-5 font-600 py-5 md:py-6 px-8 md:px-10 rounded-3 md:rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2 relative overflow-hidden text-center"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-sage/80 to-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              href="/login"
              className="group block w-full text-coral font-urbanist text-6 md:text-5 font-600 py-5 md:py-6 px-8 md:px-10 transition-all duration-300 hover:scale-105 focus:outline-none relative text-center"
            >
              <span className="relative z-10 group-hover:text-coral/80">Log in</span>
              <div className="absolute inset-x-0 bottom-2 h-0.5 bg-coral/30 group-hover:bg-coral/60 transition-colors duration-300 rounded-full"></div>
            </Link>
          </div>
        </div>

        {/* Trust indicators - centered and spaced for mobile */}
        <div className="flex justify-center items-center space-x-8 md:space-x-12 text-charcoal/60 text-center px-4">
          <div className="flex flex-col items-center space-y-2 md:space-y-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-sage/10 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 md:w-8 md:h-8 bg-sage rounded-full"></div>
            </div>
            <span className="font-urbanist text-8 md:text-7 font-500">Trusted</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2 md:space-y-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-coral/10 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 md:w-8 md:h-8 bg-coral rounded-full"></div>
            </div>
            <span className="font-urbanist text-8 md:text-7 font-500">Local</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2 md:space-y-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-charcoal/10 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 md:w-8 md:h-8 bg-charcoal rounded-full"></div>
            </div>
            <span className="font-urbanist text-8 md:text-7 font-500">Authentic</span>
          </div>
        </div>
      </div>
    </div>
  );
}