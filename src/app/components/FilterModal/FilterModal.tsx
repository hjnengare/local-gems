"use client";

import { useState, useEffect } from "react";

interface FilterModalProps {
  isOpen: boolean;
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
}

export interface FilterState {
  categories: string[];
  minRating: number | null;
  distance: string | null;
}

export default function FilterModal({ isOpen, isVisible, onClose, onApplyFilters }: FilterModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        categories: selectedCategories,
        minRating: selectedRating,
        distance: selectedDistance
      });
    }
    onClose();
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedRating(null);
    setSelectedDistance(null);
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-80 flex items-center justify-center bg-charcoal/30 backdrop-blur-md overflow-hidden transition-all duration-500 ease-out ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-gradient-to-b from-off-white/98 to-white/95 backdrop-blur-lg rounded-none md:rounded-3xl shadow-2xl border border-sage/20 w-full h-full md:w-full md:h-auto md:max-w-lg lg:max-w-[75%] mx-0 md:mx-4 max-h-full md:max-h-[85vh] flex flex-col transition-all duration-700 ease-out ${
        isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-75 -translate-y-10 opacity-0'
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
            onClick={onClose}
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
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                    className="w-5 h-5 text-sage bg-white border-2 border-sage/30 rounded-lg focus:ring-4 focus:ring-sage/20 transition-all duration-300 group-hover:border-sage/50" 
                  />
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
                  <input 
                    type="radio" 
                    name="rating" 
                    checked={selectedRating === rating}
                    onChange={() => setSelectedRating(rating)}
                    className="w-5 h-5 text-sage bg-white border-2 border-sage/30 focus:ring-4 focus:ring-sage/20 transition-all duration-300 group-hover:border-sage/50" 
                  />
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
                  <input 
                    type="radio" 
                    name="distance" 
                    checked={selectedDistance === item.distance}
                    onChange={() => setSelectedDistance(item.distance)}
                    className="w-5 h-5 text-sage bg-white border-2 border-sage/30 focus:ring-4 focus:ring-sage/20 transition-all duration-300 group-hover:border-sage/50" 
                  />
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
            onClick={handleClearAll}
            className="flex-1 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-charcoal/20 hover:to-charcoal/10 text-charcoal font-urbanist font-600 py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg border border-charcoal/10 hover:border-charcoal/20"
          >
            Clear All
          </button>
          <button
            onClick={handleApplyFilters}
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
  );
}