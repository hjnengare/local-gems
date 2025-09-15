"use client";

import { useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  showFilter?: boolean;
  className?: string;
  variant?: "header" | "page";
}

export default function SearchInput({
  placeholder = "Discover exceptional local experiences, premium dining, and hidden gems...",
  onSearch,
  onFilterClick,
  showFilter = true,
  className = "",
  variant = "header"
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // Different container styles based on variant
  const containerClass = variant === "header" 
    ? "max-w-4xl mx-auto"
    : "relative group w-full sm:w-[90%] md:w-[85%] lg:w-[75%]";

  return (
    <form onSubmit={handleSubmit} className={`${containerClass} ${className}`}>
      <div className="relative group">
        {/* Search icon */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-sage/60 group-focus-within:text-sage group-focus-within:scale-110 transition-all duration-300 z-10">
          <ion-icon name="search" class={variant === "header" ? "text-sm md:text-3xl" : "text-sm md:text-2xl"} />
        </div>
        
        {/* Filter icon - right side */}
        {showFilter && onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-sage/60 hover:text-sage hover:scale-110 transition-all duration-300 z-10 p-2"
          >
            <ion-icon name="options" class={variant === "header" ? "text-sm md:text-2xl" : "text-sm md:text-xl"} />
          </button>
        )}

        {/* Search input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full bg-off-white/95 border-2 border-sage/30 rounded-full ${
            showFilter && onFilterClick ? 'pl-20 pr-20' : 'pl-20 pr-6'
          } ${
            variant === "header"
              ? "py-6 md:py-8 text-sm md:text-xl lg:text-2xl"
              : "py-4 text-sm md:text-lg"
          } font-urbanist font-500 text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-4 focus:ring-sage/20 focus:border-sage/60 focus:bg-white focus:shadow-2xl transition-all duration-300 hover:border-sage/50 hover:shadow-xl backdrop-blur-sm italic`}
          autoFocus={variant === "header"}
        />
      </div>
    </form>
  );
}