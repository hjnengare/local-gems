"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import BusinessCard, { Business } from "../components/BusinessCard/BusinessCard";
import SearchInput from "../components/SearchInput/SearchInput";
import { TRENDING_BUSINESSES, NEARBY_FAVORITES } from "../data/businessData";

// Dynamic import for FilterModal to reduce initial bundle size
const FilterModal = dynamic(() => import("../components/FilterModal/FilterModal"), {
  loading: () => null,
});

const BottomNav = dynamic(() => import("../components/Navigation/BottomNav"));

type FilterState = {
  categories: string[];
  minRating: number | null;
  distance: string | null;
};

// Combine all business data
const allBusinesses: Business[] = [...TRENDING_BUSINESSES, ...NEARBY_FAVORITES];

export default function ExploreGemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [selectedDistance, setSelectedDistance] = useState("All Distances");

  const searchOverlayClassName = `fixed left-0 right-0 z-70 bg-gradient-to-b from-white/98 to-off-white/98 backdrop-blur-lg border-b border-sage/20 shadow-2xl transition-all duration-500 ease-out ${isSearchOpen ? 'top-0 translate-y-0 opacity-100' : '-top-32 -translate-y-full opacity-0'}`;

  const toggleFilterModal = () => {
    if (isFilterModalOpen) {
      setIsFilterModalOpen(false);
      setTimeout(() => {
        setIsFilterModalVisible(false);
      }, 700);
    } else {
      setIsFilterModalVisible(true);
      setTimeout(() => {
        setIsFilterModalOpen(true);
      }, 50);
    }
  };

  const handleApplyFilters = (filters: FilterState) => {
    if (filters.categories.length > 0) {
      setSelectedCategory(filters.categories[0]);
    } else {
      setSelectedCategory("All Categories");
    }
    
    if (filters.minRating) {
      setSelectedRating(`${filters.minRating}+ Stars`);
    } else {
      setSelectedRating("All Ratings");
    }
    
    if (filters.distance) {
      setSelectedDistance(`Within ${filters.distance}`);
    } else {
      setSelectedDistance("All Distances");
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Handle search logic here
  };

  const filteredBusinesses = allBusinesses.filter(business => {
    const categoryMatch = selectedCategory === "All Categories" || business.category === selectedCategory;
    
    let ratingMatch = true;
    if (selectedRating === "4.5+ Stars") ratingMatch = business.totalRating >= 4.5;
    else if (selectedRating === "4.0+ Stars") ratingMatch = business.totalRating >= 4.0;
    else if (selectedRating === "3.5+ Stars") ratingMatch = business.totalRating >= 3.5;
    
    return categoryMatch && ratingMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-off-white to-off-white/95 pb-24 md:pb-6">
      <div className="fixed top-0 left-0 right-0 z-50 bg-off-white/80 backdrop-blur-sm overflow-hidden hover:shadow-sm">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-2 right-10 w-8 h-8 bg-gradient-to-br from-sage/20 to-sage/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1 left-16 w-6 h-6 bg-gradient-to-br from-coral/15 to-coral/3 rounded-full blur-lg animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-[1300px] mx-auto relative z-10">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center group"
            >
              <span className="font-urbanist text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal transition-all duration-300 group-hover:from-sage/90 group-hover:to-sage relative">
                Explore Gems
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sage to-sage/60 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSearch}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2 border border-charcoal/5 hover:border-sage/20"
              >
                <ion-icon
                  name={isSearchOpen ? "close" : "search"}
                  class="text-xl sm:text-2xl text-charcoal/70 hover:text-sage transition-colors duration-300"
                />
              </button>
              
              <button 
                onClick={() => window.history.back()}
                className="group w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2 border border-charcoal/5 hover:border-sage/20"
              >
                <ion-icon
                  name="arrow-back"
                  class="text-xl sm:text-2xl text-charcoal/70 group-hover:text-sage transition-colors duration-300"
                />
              </button>
            </div>
          </div>


          <div className="px-4 sm:px-6 md:px-8 pb-6 flex justify-center">
            <div className="flex gap-2 flex-wrap w-full sm:w-[90%] md:w-[85%] lg:w-[75%]">
              {selectedCategory !== "All Categories" && (
                <span className="px-3 py-1 bg-sage/10 text-sage font-urbanist font-600 rounded-full text-sm flex items-center gap-2">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("All Categories")}>
                    <ion-icon name="close" class="text-sm" />
                  </button>
                </span>
              )}
              {selectedRating !== "All Ratings" && (
                <span className="px-3 py-1 bg-coral/10 text-coral font-urbanist font-600 rounded-full text-sm flex items-center gap-2">
                  {selectedRating}
                  <button onClick={() => setSelectedRating("All Ratings")}>
                    <ion-icon name="close" class="text-sm" />
                  </button>
                </span>
              )}
              {selectedDistance !== "All Distances" && (
                <span className="px-3 py-1 bg-sage/10 text-sage font-urbanist font-600 rounded-full text-sm flex items-center gap-2">
                  {selectedDistance}
                  <button onClick={() => setSelectedDistance("All Distances")}>
                    <ion-icon name="close" class="text-sm" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sage/30 to-transparent"></div>
      </div>

      {/* Search Overlay - slides from top */}
      {isSearchOpen && (
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

      <FilterModal
        isOpen={isFilterModalOpen}
        isVisible={isFilterModalVisible}
        onClose={toggleFilterModal}
        onApplyFilters={handleApplyFilters}
      />

      <div className="container mx-auto max-w-[1300px] px-4 py-8 pt-48">
        <div className="mb-6">
          <p className="font-urbanist text-charcoal/70 font-600">
            Showing {filteredBusinesses.length} results
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBusinesses.map((business) => (
            <div key={business.id} className="animate-fade-in-up">
              <BusinessCard business={business} />
            </div>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-16">
            <ion-icon name="search" class="text-6xl text-charcoal/20 mb-4" />
            <h3 className="font-urbanist font-700 text-xl text-charcoal/60 mb-2">No results found</h3>
            <p className="font-urbanist text-charcoal/40">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}