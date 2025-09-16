"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

interface SubcategoryItem {
  id: string;
  label: string;
}

/** Define only the sections you actually have pills for. */
const subcategories: Record<string, SubcategoryItem[]> = {
  "food-drink": [
    { id: "casual-eats", label: "casual eats" },
    { id: "sushi", label: "sushi" },
    { id: "cafes", label: "cafés" },
    { id: "fine-dining", label: "fine dining" },
    { id: "street-food", label: "street food" },
    { id: "vegan", label: "vegan" },
  ],
  "arts-culture": [
    { id: "galleries", label: "galleries" },
    { id: "theatre", label: "theatre" },
    { id: "live-music", label: "live music" },
    { id: "book-fair", label: "book fair" },
    { id: "film-nights", label: "film nights" },
    { id: "festivals", label: "festivals" },
  ],
};

const TITLES: Record<string, string> = {
  "food-drink": "Food & Drink",
  "arts-culture": "Arts & Culture",
  "beauty-wellness": "Beauty & Wellness",
  "home-services": "Home & Services",
  "outdoors-adventure": "Outdoors & Adventure",
  "nightlife-entertainment": "Nightlife & Entertainment",
  "family-pets": "Family & Pets",
  "shopping-lifestyle": "Shopping & Lifestyle",
};

export default function SubcategoriesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Tell us more...";

  const { user, updateUser } = useAuth();
  // Remove unused variable

  // typing headline
  useEffect(() => {
    let i = 0;

    const cursorId = setInterval(() => setShowCursor((p) => !p), 500);
    const typeId = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typeId);
        clearInterval(cursorId);
        setShowCursor(false);
      }
    }, 80);

    return () => {
      clearInterval(typeId);
      clearInterval(cursorId);
    };
  }, [fullText]);

  // determine which sections to show
  const interests = (searchParams?.get("interests")?.split(",") || [])
    .map((s) => s.trim())
    .filter(Boolean);

  // Only use interests that actually exist in subcategories; otherwise default to sketch sections
  const availableKeys = Object.keys(subcategories);
  const fromUrl = interests.filter((k) => availableKeys.includes(k));
  const sectionsToShow = fromUrl.length > 0 ? fromUrl : ["food-drink", "arts-culture"];

  const toggle = useCallback((id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    []
  );

  const handleNext = useCallback(() => {
    if (!user) return;

    // Optimistic navigation - navigate immediately
    router.push("/deal-breakers");

    // Update user data asynchronously
    updateUser({ subcategories: selected });
  }, [user, router, selected, updateUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Back */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/interests" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full">
          <ion-icon name="arrow-back-outline" size="small"></ion-icon>
        </Link>
      </div>

      {/* Ambient blobs */}
      <div className="absolute inset-0 opacity-4">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sage/20 to-sage/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-coral/15 to-coral/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-charcoal/10 to-charcoal/3 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-16 right-20 w-1 h-1 bg-sage/30 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-1 h-1 bg-coral/30 rounded-full animate-ping delay-1500"></div>
      </div>

      {/* Mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-off-white/30 via-transparent to-off-white/20 pointer-events-none"></div>

      <div className="w-[90%] max-w-[700px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block relative mb-6">
            <h2 className="font-urbanist text-2xl md:text-4xl lg:text-5xl font-700 text-charcoal mb-5 md:mb-6 text-center leading-snug px-2 tracking-[0.01em]">
              <span className="relative">
                {displayedText}
                <span
                  className={`inline-block w-1 md:w-2 h-6 md:h-12 bg-sage ml-1 transition-opacity duration-100 ${showCursor ? "opacity-100" : "opacity-0"}`}
                  style={{ animation: showCursor ? "blink 1s infinite" : "none" }}
                />
              </span>
            </h2>
            
          </div>
          <p className="font-urbanist text-sm md:text-base font-400 text-charcoal/70 mb-10 md:mb-12 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto">
            Pick a few in each area to help us personalize your experience
          </p>
        </div>

        {/* Sections: subheading + 3-per-row animated pills */}
        <div className="space-y-10">
          {sectionsToShow.map((key) => (
            <section key={key}>
              <h3 className="font-urbanist text-4 md:text-3 font-700 text-charcoal mb-4 md:mb-3 px-1 md:px-0 font-semibold">
                {TITLES[key] || key}
              </h3>

              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {(subcategories[key] || []).map((sc, idx) => {
                  const active = selected.includes(sc.id);

                  const base =
                    "w-full py-4 md:py-5 px-3 md:px-4 rounded-full font-urbanist text-6 md:text-5 font-600 text-center transition-all duration-300 ease-out " +
                    "focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2";

                  const state = active
                    ? "bg-coral text-white animate-bounce"
                    : "bg-off-white border-2 border-coral text-charcoal hover:bg-coral/5";

                  const style: React.CSSProperties = !active
                    ? { transitionDelay: `${(idx % 3) * 40}ms` }
                    : {};

                  return (
                    <button
                      key={sc.id}
                      onClick={() => toggle(sc.id)}
                      className={`${base} ${state}`}
                      style={style}
                    >
                      <span className="truncate">{sc.label}</span>
                    </button>
                  );
                })}
              </div>

            </section>
          ))}
        </div>

        {/* Continue (same style as Interests) */}
        <div className="pt-8">
          <button
            className="group block w-full bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 text-white font-urbanist text-sm md:text-base font-600 py-3.5 md:py-4 px-6 md:px-8 rounded-2xl md:rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sage/20 hover:focus:ring-coral/20 focus:ring-offset-1 relative overflow-hidden text-center hover:scale-[1.02]"
            onClick={handleNext}
          >
            <span className="relative z-10">Continue</span>
            <div className="absolute inset-0 bg-gradient-to-r from-sage/80 to-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Stepper */}
        <div className="flex justify-center items-center space-x-2 mt-6 mb-4">
          <div className="w-3 h-3 bg-sage/40 rounded-full"></div>
          <div className="w-3 h-3 bg-sage rounded-full"></div>
          <div className="w-3 h-3 bg-charcoal/20 rounded-full"></div>
          <div className="w-3 h-3 bg-charcoal/20 rounded-full"></div>
        </div>

        <div className="text-center">
          <p className="font-urbanist text-8 font-400 text-charcoal/50">Step 2 of 4</p>
        </div>
      </div>
    </div>
  );
}
