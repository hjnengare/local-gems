"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import FilterModal, { FilterState } from "../FilterModal/FilterModal";
import SearchInput from "../SearchInput/SearchInput";

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

  const handleApplyFilters = (filters: FilterState) => {
    console.log('Applied filters:', filters);
    // Handle filter application logic here
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Handle search logic here
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

  const headerClassName = `fixed md:top-12 top-14 left-0 right-0 z-50 bg-off-white/80 backdrop-blur-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-sm ${isVisible ? 'translate-y-0' : '-translate-y-full'}`;
  
  const searchOverlayClassName = `fixed left-0 right-0 z-70 bg-gradient-to-b from-white/98 to-off-white/98 backdrop-blur-lg border-b border-sage/20 shadow-2xl transition-all duration-500 ease-out ${isSearchOpen ? 'top-0 translate-y-0 opacity-100' : '-top-32 -translate-y-full opacity-0'}`;

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

      <header className={headerClassName}>
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
        <div className={searchOverlayClassName}>
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
            <SearchInput
              variant="header"
              onSearch={handleSearch}
              onFilterClick={toggleFilterModal}
            />
            
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
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        isVisible={isFilterModalVisible}
        onClose={toggleFilterModal}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
}