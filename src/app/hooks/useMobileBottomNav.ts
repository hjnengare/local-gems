"use client";

import { useState, useEffect, useCallback } from 'react';

interface MobileBottomNavOptions {
  allowedPages: string[];
  pathname: string;
  scrollThreshold?: number;
  throttleMs?: number;
}

export function useMobileBottomNav({
  allowedPages,
  pathname,
  scrollThreshold = 50,
  throttleMs = 16
}: MobileBottomNavOptions) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if current page should show navigation
  const shouldShowNav = allowedPages.some(page => pathname === page || pathname.startsWith(page));

  // Check if device is mobile
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 768; // md breakpoint
    setIsMobile(mobile);
    if (!mobile) {
      setIsVisible(false); // Hide on desktop
    }
  }, []);

  const updateNavVisibility = useCallback(() => {
    if (!shouldShowNav || !isMobile) {
      setIsVisible(false);
      return;
    }

    const currentScrollY = window.scrollY;

    // Hide bottom nav when at top
    if (currentScrollY <= scrollThreshold) {
      setIsVisible(false);
    }
    // Hide when scrolling up
    else if (currentScrollY < lastScrollY) {
      setIsVisible(false);
    }
    // Show when scrolling down past threshold on mobile only
    else if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [shouldShowNav, isMobile, lastScrollY, scrollThreshold]);

  useEffect(() => {
    // Initial mobile check
    checkMobile();
  }, [checkMobile]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateNavVisibility, throttleMs);
    };

    const handleResize = () => {
      checkMobile();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateNavVisibility, throttleMs);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [updateNavVisibility, checkMobile, throttleMs]);

  return {
    isVisible: shouldShowNav && isVisible,
    isMobile,
    shouldShowNav
  };
}

export default useMobileBottomNav;