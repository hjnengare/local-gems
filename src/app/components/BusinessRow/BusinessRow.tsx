"use client";

import { useState } from "react";
import BusinessCard, { Business } from "../BusinessCard/BusinessCard";

export default function BusinessRow({
  title,
  businesses,
  cta = "View All",
  href = "#",
}: {
  title: string;
  businesses: Business[];
  cta?: string;
  href?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <section className="py-[60px] bg-gradient-to-b from-off-white to-off-white/95 relative" aria-label="businesses" data-section>
      {/* Subtle section decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-xl" />
      </div>
      
      <div className="container mx-auto max-w-[1300px] px-4 relative z-10">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="font-urbanist text-3 font-800 text-charcoal relative">
            {title}
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-sage to-coral rounded-full" />
          </h2>
          <button 
            onClick={handleToggleExpanded}
            className="group flex items-center gap-2 font-urbanist font-700 text-charcoal/70 transition-all duration-300 hover:text-sage hover:scale-105 text-2xl"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-[-1px]">
              {isExpanded ? "Show Less" : "See More..."}
            </span>
            <ion-icon 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              class={`transition-all duration-300 text-xl ${isExpanded ? 'group-hover:-translate-y-0.5' : 'group-hover:translate-y-0.5'} group-hover:text-sage`} 
            />
          </button>
        </div>

        <div className="overflow-hidden">
          <ul className={`transition-all duration-1000 ease-out ${
            isExpanded 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-100 translate-y-0' 
              : 'flex snap-x gap-6 overflow-x-auto pb-6 -mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth opacity-100 translate-y-0'
          }`}>
            {businesses.map((business, index) => (
              <div 
                key={business.id} 
                className={`transition-all duration-700 ease-out ${
                  isExpanded 
                    ? 'animate-fade-in-up opacity-100 scale-100' 
                    : 'opacity-100 scale-100'
                }`} 
                style={{ 
                  animationDelay: isExpanded ? `${index * 50}ms` : '0ms',
                  transitionDelay: isExpanded ? `${index * 30}ms` : '0ms'
                }}
              >
                <BusinessCard business={business} />
              </div>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}