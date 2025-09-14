"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import PageLoading from "../Loading/PageLoading";

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
      <AnimatePresence mode="wait">
        {isLoading && <PageLoading key="loading" />}
      </AnimatePresence>
      {children}
    </PageTransitionContext.Provider>
  );
}