// src/components/SearchInput/SearchInput.tsx
"use client";

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";

interface SearchInputProps {
  placeholder?: string;           // long placeholder (desktop)
  mobilePlaceholder?: string;     // short placeholder (mobile)
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  onFocusOpenFilters?: () => void;
  showFilter?: boolean;
  className?: string;
  variant?: "header" | "page";
}

const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  (
    {
      placeholder = "Discover exceptional local experiences, premium dining, and hidden gems...",
      mobilePlaceholder = "Search places, coffee, yoga…",
      onSearch,
      onFilterClick,
      onFocusOpenFilters,
      showFilter = true,
      className = "",
      variant = "header",
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [ph, setPh] = useState(placeholder);        // responsive placeholder
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    useEffect(() => {
      const setByViewport = () => {
        // lg breakpoint (Tailwind default: 1024px)
        setPh(window.innerWidth >= 1024 ? placeholder : mobilePlaceholder);
      };
      setByViewport();
      window.addEventListener("resize", setByViewport);
      return () => window.removeEventListener("resize", setByViewport);
    }, [placeholder, mobilePlaceholder]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      onSearch?.(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(searchQuery);
    };

    const containerClass =
      variant === "header" ? "w-full" : "relative group w-full sm:w-[90%] md:w-[85%] lg:w-[75%]";

    return (
      <form onSubmit={handleSubmit} className={`${containerClass} ${className}`} ref={containerRef}>
        <div className="relative group">
          {/* left icon */}
          <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-sage/60 group-focus-within:text-sage transition-all duration-300 z-10">
            <ion-icon name="search" class={variant === "header" ? "text-base" : "text-base"} />
          </div>

          {/* right icon (filters) */}
          {showFilter && onFilterClick && (
            <button
              type="button"
              onClick={onFilterClick}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-sage/60 hover:text-sage transition-all duration-300 z-10 p-2"
              aria-label="Open filters"
            >
              <ion-icon name="options" class={variant === "header" ? "text-base" : "text-base"} />
            </button>
          )}

          {/* input */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={onFocusOpenFilters}
            placeholder={ph}
            className={`w-full bg-off-white/75 border border-sage/30 rounded-full
              ${showFilter && onFilterClick ? "pl-12 pr-12 sm:pl-14 sm:pr-12" : "pl-12 pr-4"}
              ${variant === "header" ? "py-3 text-base lg:text-lg" : "py-2 text-sm md:text-base"}
              font-urbanist font-500 text-charcoal placeholder-charcoal/40
              focus:outline-none focus:ring-4 focus:ring-sage/20 focus:border-sage/60
              transition-all duration-300 hover:border-sage/50
              truncate lg:whitespace-normal lg:overflow-visible lg:text-clip`}  // ellipsis on small, full on lg
            autoFocus={variant === "header"}
            aria-label="Search"
          />
        </div>
      </form>
    );
  }
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
