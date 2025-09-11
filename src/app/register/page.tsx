"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Create your account";
  
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
      {/* Back button - top left */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/onboarding" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full">
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
            Join the Local Gems community and discover authentic experiences
          </p>
        </div>

        {/* Premium Form Card */}
        <div className="bg-off-white/95 backdrop-blur-lg rounded-3 shadow-xl p-6 md:p-16 mb-8 relative overflow-hidden">
          {/* Card decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-2xl"></div>
          
          <form className="space-y-6 md:space-y-8 relative z-10">
            {/* Username with icon */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 group-focus-within:text-sage transition-colors duration-300 z-10">
                <ion-icon name="person-outline" size="small"></ion-icon>
              </div>
              <input
                type="text"
                placeholder="@username"
                className="w-full bg-cultured-1/50 border border-light-gray/50 rounded-3 pl-14 pr-4 py-4 md:py-5 font-urbanist text-6 font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage focus:bg-white transition-all duration-300 hover:border-sage/50"
              />
            </div>

            {/* Email with icon */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 group-focus-within:text-sage transition-colors duration-300 z-10">
                <ion-icon name="mail-outline" size="small"></ion-icon>
              </div>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-cultured-1/50 border border-light-gray/50 rounded-3 pl-14 pr-4 py-4 md:py-5 font-urbanist text-6 font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage focus:bg-white transition-all duration-300 hover:border-sage/50"
              />
            </div>

            {/* Password with enhanced styling */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 group-focus-within:text-sage transition-colors duration-300 z-10">
                <ion-icon name="lock-closed-outline" size="small"></ion-icon>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="w-full bg-cultured-1/50 border border-light-gray/50 rounded-3 pl-14 pr-16 py-4 md:py-5 font-urbanist text-6 font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage focus:bg-white transition-all duration-300 hover:border-sage/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors duration-300 p-1 z-10"
              >
                <ion-icon 
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size="small"
                ></ion-icon>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6 md:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-light-gray/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-off-white/90 text-charcoal/60 font-urbanist text-8 font-400">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <button
                type="button"
                className="flex items-center justify-center bg-white border border-light-gray/50 rounded-3 px-4 md:px-6 py-4 md:py-5 font-urbanist text-7 md:text-6 font-500 text-charcoal hover:border-sage/50 hover:bg-sage/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 group"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="group-hover:text-sage transition-colors duration-300">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center bg-white border border-light-gray/50 rounded-3 px-4 md:px-6 py-4 md:py-5 font-urbanist text-7 md:text-6 font-500 text-charcoal hover:border-sage/50 hover:bg-sage/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 group"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="group-hover:text-sage transition-colors duration-300">Apple</span>
              </button>
            </div>

            {/* Create Account Button */}
            <div className="pt-8">
              <Link
                href="/interests"
                className="group block w-full bg-gradient-to-r from-sage to-sage/90 text-white font-urbanist text-6 md:text-5 font-600 py-5 md:py-6 px-8 md:px-10 rounded-3 md:rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2 relative overflow-hidden text-center"
              >
                <span className="relative z-10">Next</span>
                <div className="absolute inset-0 bg-gradient-to-r from-sage/80 to-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </form>

          {/* Enhanced footer */}
          <div className="text-center mt-8 pt-6 border-t border-light-gray/30">
            <p className="font-urbanist text-7 font-400 text-charcoal/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-coral font-600 hover:text-coral/80 transition-colors duration-300 relative group"
              >
                <span>Log in</span>
                <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-coral/30 group-hover:bg-coral/60 transition-colors duration-300 rounded-full"></div>
              </Link>
            </p>
          </div>
        </div>

        {/* Premium Trust Indicators */}
        <div className="flex justify-center items-center space-x-8 md:space-x-12 text-charcoal/60 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-sage/10 rounded-full flex items-center justify-center">
              <ion-icon name="shield-checkmark-outline" style={{ color: "#749176" }} size="small"></ion-icon>
            </div>
            <span className="font-urbanist text-8 md:text-7 font-500">Secure</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-coral/10 rounded-full flex items-center justify-center">
              <ion-icon name="people-outline" style={{ color: "#d67469" }} size="small"></ion-icon>
            </div>
            <span className="font-urbanist text-8 md:text-7 font-500">Community</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-charcoal/10 rounded-full flex items-center justify-center">
              <ion-icon name="star-outline" style={{ color: "#211e1d" }} size="small"></ion-icon>
            </div>
            <span className="font-urbanist text-8 md:text-7 font-500">Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
}