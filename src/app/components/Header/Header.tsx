"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface HeaderProps {
  showSearch?: boolean;
  showProfile?: boolean;
}

export default function Header({ showSearch = true, showProfile = true }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show navbar when near top
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Show navbar when scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide navbar when scrolling down and past 100px
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleFilterModal = () => {
    if (isFilterModalOpen) {
      // Start close animation
      setIsFilterModalOpen(false);
      // Hide modal after animation completes
      setTimeout(() => {
        setIsFilterModalVisible(false);
      }, 700);
    } else {
      // Show modal and start open animation
      setIsFilterModalVisible(true);
      setTimeout(() => {
        setIsFilterModalOpen(true);
      }, 50);
    }
  };

  // Preload ion-icons
  useEffect(() => {
    const preloadIcons = () => {
      const iconNames = ['search', 'close', 'person', 'options', 'restaurant', 'cafe', 'bag', 'game-controller', 'construct', 'star', 'location', 'walk', 'car', 'car-sport', 'airplane', 'checkmark'];
      iconNames.forEach(iconName => {
        const iconElement = document.createElement('ion-icon');
        iconElement.name = iconName;
        iconElement.style.display = 'none';
        document.body.appendChild(iconElement);
        // Remove after a short delay to clean up
        setTimeout(() => {
          if (document.body.contains(iconElement)) {
            document.body.removeChild(iconElement);
          }
        }, 100);
      });
    };

    preloadIcons();
  }, []);

  // Banner text rotation logic
  const bannerTexts = [
    "🔍 Discover hidden local gems in your neighborhood",
    "⭐ Share your experiences and help others find quality places",
    "🏆 Climb the leaderboard by reviewing local businesses",
    "📍 Find trusted recommendations from real local reviewers",
    "💎 Uncover the best kept secrets in your area",
    "🌟 Support small businesses and local entrepreneurs",
    "🍽️ Explore top-rated restaurants, cafes, and eateries",
    "☕ Find cozy spots for your next coffee break",
    "🎉 Discover fun local events and activities",
    "🛍️ Shop at unique local boutiques and stores",
    "🏞️ Explore beautiful parks and outdoor spaces nearby",
    "🎨 Find local art galleries and cultural experiences",
    "🚶‍♂️ Plan your next walking tour of hidden gems",
    "🍔 Satisfy your cravings with local food trucks and street food",
    "🍷 Discover the best local wineries and breweries",  
    "🎶 Find live music venues and local performances"
  ];

  useEffect(() => {
    const rotateText = () => {
      setTextVisible(false);
      
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => 
          prevIndex === bannerTexts.length - 1 ? 0 : prevIndex + 1
        );
        setTextVisible(true);
      }, 300);
    };

    const interval = setInterval(rotateText, 4000);

    return () => clearInterval(interval);
  }, [bannerTexts.length]);
  return (
    <>
      {/* Static Alert Banner with Dynamic Text */}
      <div className="fixed top-0 left-0 right-0 z-60 bg-gradient-to-r from-sage/90 to-sage/80 backdrop-blur-sm">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:block hidden">
          <p className={`text-center font-urbanist text-md sm:text-md md:text-xl font-600 text-white transition-opacity duration-300 ${textVisible ? 'opacity-100' : 'opacity-0'}`}>
            {bannerTexts[currentTextIndex]}
          </p>
        </div>
        {/* Mobile-specific banner with fixed dimensions */}
        <div className="md:hidden block px-4 py-3">
          <p className={`text-center font-urbanist text-sm font-600 text-white transition-opacity duration-300 ${textVisible ? 'opacity-100' : 'opacity-0'}`}>
            {bannerTexts[currentTextIndex]}
          </p>
        </div>
      </div>

      <header className={`fixed md:top-12 top-14 left-0 right-0 z-50 bg-off-white/80 backdrop-blur-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-sm ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
        {/* Subtle background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-2 right-10 w-8 h-8 bg-gradient-to-br from-sage/20 to-sage/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1 left-16 w-6 h-6 bg-gradient-to-br from-coral/15 to-coral/3 rounded-full blur-lg animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-[1300px] mx-auto relative z-10">
          {/* Header Top - Logo + Icons */}
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4">
            {/* Logo - mobile first */}
            <Link href="/home" className="flex items-center group">
              <span className="font-urbanist text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal transition-all duration-300 group-hover:from-sage/90 group-hover:to-sage relative">
                Local Gems
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sage to-sage/60 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </span>
            </Link>

            {/* Right side icons - mobile first */}
            <div className="flex items-center space-x-3">
              {/* Search toggle icon */}
              {showSearch && (
                <button
                  onClick={toggleSearch}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2 border border-charcoal/5 hover:border-sage/20"
                >
                  <ion-icon
                    name={isSearchOpen ? "close" : "search"}
                    class="text-xl sm:text-2xl text-charcoal/70 hover:text-sage transition-colors duration-300"
                  />
                </button>
              )}
              
              {/* Profile icon */}
              {showProfile && (
                <Link
                  href="/profile"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2 border border-charcoal/5 hover:border-sage/20"
                >
                  <ion-icon
                    name="person"
                    class="text-xl sm:text-2xl text-charcoal/70 group-hover:text-sage transition-colors duration-300"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom gradient accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sage/30 to-transparent"></div>
      </header>

      {/* Search Overlay - slides from top */}
      {showSearch && (
        <div className={`fixed left-0 right-0 z-70 bg-gradient-to-b from-white/98 to-off-white/98 backdrop-blur-lg border-b border-sage/20 shadow-2xl transition-all duration-500 ease-out ${
          isSearchOpen ? 'top-0 translate-y-0 opacity-100' : '-top-32 -translate-y-full opacity-0'
        }`}>
          {/* Close button - top right corner */}
          <button
            onClick={toggleSearch}
            className="absolute top-6 right-6 w-12 h-12 bg-charcoal/10 hover:bg-sage/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-charcoal/10 hover:border-sage/30 z-20"
          >
            <ion-icon
              name="close"
              class="text-2xl text-charcoal/60 hover:text-sage transition-colors duration-300"
            />
          </button>

          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-6 pt-24">
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                {/* Premium Search icon */}
                <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-sage/60 group-focus-within:text-sage group-focus-within:scale-110 transition-all duration-300 z-10">
                  <ion-icon name="search" class="text-3xl drop-shadow-sm"></ion-icon>
                </div>
                
                {/* Filter icon - right side */}
                <button
                  onClick={toggleFilterModal}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-sage/60 hover:text-sage hover:scale-110 transition-all duration-300 z-10 p-2"
                >
                  <ion-icon name="options" class="text-2xl drop-shadow-sm"></ion-icon>
                </button>

                {/* Premium Search input */}
                <input
                  type="text"
                  placeholder="Discover exceptional local experiences, premium dining, and hidden gems..."
                  className="w-full bg-off-white/95 border-2 border-sage/30 rounded-full pl-20 pr-20 py-6 md:py-8 font-urbanist text-xl md:text-2xl font-500 text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-4 focus:ring-sage/20 focus:border-sage/60 focus:bg-white focus:shadow-2xl transition-all duration-300 hover:border-sage/50 hover:shadow-xl backdrop-blur-sm italic"
                  autoFocus={isSearchOpen}
                />
              </div>
              
              {/* Premium search suggestions */}
              <div className="mt-8 text-center">
                <p className="font-urbanist text-lg font-500 text-sage/80 mb-2">
                  ✨ Curated Recommendations
                </p>
                <p className="font-urbanist text-base font-400 text-charcoal/60">
                  Search for award-winning restaurants • artisan coffee shops • boutique experiences • cultural landmarks
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterModalVisible && (
        <div className={`fixed inset-0 z-80 flex items-center justify-center bg-charcoal/30 backdrop-blur-md overflow-hidden transition-all duration-500 ease-out ${
          isFilterModalOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className={`bg-gradient-to-b from-off-white/98 to-white/95 backdrop-blur-lg rounded-none md:rounded-3xl shadow-2xl border border-sage/20 w-full h-full md:w-full md:h-auto md:max-w-lg lg:max-w-[75%] mx-0 md:mx-4 max-h-full md:max-h-[85vh] flex flex-col transition-all duration-700 ease-out ${
            isFilterModalOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-75 -translate-y-10 opacity-0'
          }`}>
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-6 right-12 w-12 h-12 bg-gradient-to-br from-sage/30 to-sage/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-20 left-8 w-8 h-8 bg-gradient-to-br from-coral/20 to-coral/5 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>

            {/* Modal Header - Fixed */}
            <div className="relative z-10 flex items-center justify-between p-8 pb-6 flex-shrink-0">
              <div>
                <h2 className="font-urbanist text-3xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal flex items-center">
                  <ion-icon name="options" class="text-sage mr-3 text-2xl"></ion-icon>
                  Filter Options
                </h2>
                <p className="font-urbanist text-sm font-400 text-charcoal/60 mt-1">
                  Refine your search for the perfect local gems
                </p>
              </div>
              <button
                onClick={toggleFilterModal}
                className="w-12 h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-charcoal/5 hover:border-sage/20"
              >
                <ion-icon name="close" class="text-2xl text-charcoal/60 hover:text-sage transition-colors duration-300"></ion-icon>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="relative z-10 px-8 pb-4 space-y-6 overflow-y-auto flex-1 min-h-0">
              {/* Category Filter */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-sage/10 hover:border-sage/20 transition-all duration-300">
                <h3 className="font-urbanist text-xl font-600 text-charcoal mb-4 flex items-center">
                  <ion-icon name="restaurant" class="text-sage mr-3 text-xl"></ion-icon>
                  Category
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { name: 'Restaurants', icon: 'restaurant' },
                    { name: 'Coffee Shops', icon: 'cafe' },
                    { name: 'Shopping', icon: 'bag' },
                    { name: 'Entertainment', icon: 'game-controller' },
                    { name: 'Services', icon: 'construct' }
                  ].map((category) => (
                    <label key={category.name} className="group flex items-center space-x-4 cursor-pointer hover:bg-sage/5 p-3 rounded-xl transition-all duration-300 border border-transparent hover:border-sage/10">
                      <input type="checkbox" className="w-5 h-5 text-sage bg-white border-2 border-sage/30 rounded-lg focus:ring-4 focus:ring-sage/20 transition-all duration-300 group-hover:border-sage/50" />
                      <ion-icon name={category.icon} class="text-sage text-xl"></ion-icon>
                      <span className="font-urbanist text-lg font-500 text-charcoal group-hover:text-sage/80 transition-colors duration-300">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-sage/10 hover:border-sage/20 transition-all duration-300">
                <h3 className="font-urbanist text-xl font-600 text-charcoal mb-4 flex items-center">
                  <ion-icon name="star" class="text-sage mr-3 text-xl"></ion-icon>
                  Minimum Rating
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="group flex items-center space-x-4 cursor-pointer hover:bg-sage/5 p-3 rounded-xl transition-all duration-300 border border-transparent hover:border-sage/10">
                      <input type="radio" name="rating" className="w-5 h-5 text-sage bg-white border-2 border-sage/30 focus:ring-4 focus:ring-sage/20 transition-all duration-300 group-hover:border-sage/50" />
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(rating)].map((_, i) => (
                            <ion-icon key={i} name="star" class="text-sage text-lg"></ion-icon>
                          ))}
                        </div>
                        <span className="font-urbanist text-lg font-500 text-charcoal group-hover:text-sage/80 transition-colors duration-300">{rating}+ stars</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-sage/10 hover:border-sage/20 transition-all duration-300">
                <h3 className="font-urbanist text-xl font-600 text-charcoal mb-4 flex items-center">
                  <ion-icon name="location" class="text-sage mr-3 text-xl"></ion-icon>
                  Distance
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { distance: '1 mile', icon: 'walk' },
                    { distance: '5 miles', icon: 'car' },
                    { distance: '10 miles', icon: 'car-sport' },
                    { distance: '25 miles', icon: 'airplane' }
                  ].map((item) => (
                    <label key={item.distance} className="group flex items-center space-x-3 cursor-pointer hover:bg-sage/5 p-3 rounded-xl transition-all duration-300 border border-transparent hover:border-sage/10">
                      <input type="radio" name="distance" className="w-5 h-5 text-sage bg-white border-2 border-sage/30 focus:ring-4 focus:ring-sage/20 transition-all duration-300 group-hover:border-sage/50" />
                      <ion-icon name={item.icon} class="text-sage text-lg"></ion-icon>
                      <span className="font-urbanist text-lg font-500 text-charcoal group-hover:text-sage/80 transition-colors duration-300">{item.distance}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="relative z-10 flex space-x-4 p-8 pt-6 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm border-t border-sage/10 flex-shrink-0">
              <button
                onClick={toggleFilterModal}
                className="flex-1 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-charcoal/20 hover:to-charcoal/10 text-charcoal font-urbanist font-600 py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg border border-charcoal/10 hover:border-charcoal/20"
              >
                Clear All
              </button>
              <button
                onClick={toggleFilterModal}
                className="flex-1 bg-gradient-to-br from-sage to-sage/90 hover:from-sage/90 hover:to-sage text-white font-urbanist font-600 py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-sage/20 hover:border-sage/40 flex items-center justify-center"
              >
                <ion-icon name="checkmark" class="mr-2 text-white"></ion-icon>
                Apply Filters
              </button>
            </div>

            {/* Bottom gradient accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sage/30 to-transparent"></div>
          </div>
        </div>
      )}
    </>
  );
}