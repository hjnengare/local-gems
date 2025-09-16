"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';

// Lazy load animated components
const LazyPageLoading = dynamic(() =>
  import("../Loading/PageLoading").then(mod => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-off-white">
        <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
);

interface PageTransitionContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider");
  }
  return context;
}

interface PageTransitionProviderProps {
  children: ReactNode;
}

export default function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    if (previousPath && previousPath !== pathname) {
      setIsLoading(true);

      // Simulate loading time for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
    setPreviousPath(pathname);
  }, [pathname, previousPath]);

  const contextValue: PageTransitionContextType = {
    isLoading,
    setIsLoading
  };

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {isLoading && <LazyPageLoading />}
      {children}
    </PageTransitionContext.Provider>
  );
}