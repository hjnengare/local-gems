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
  const [isClient, setIsClient] = useState(false);

  // Check if current page should show navigation
  const shouldShowNav = allowedPages.some(page => pathname === page || pathname.startsWith(page));

  // Check if device is mobile with multiple detection methods
  const checkMobile = useCallback(() => {
    if (!isClient) return; // Only run on client side

    // Multiple mobile detection methods for better reliability
    const screenWidth = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isMobileWidth = screenWidth < 768; // md breakpoint

    const mobile = (isMobileWidth && isTouchDevice) || isMobileUA;

    setIsMobile(mobile);
    if (!mobile) {
      setIsVisible(false); // Hide on desktop
    }
  }, [isClient]);

  const updateNavVisibility = useCallback(() => {
    if (!isClient || !shouldShowNav || !isMobile) {
      setIsVisible(false);
      return;
    }

    // Use multiple scroll position methods for mobile compatibility
    const currentScrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Add minimum scroll difference to prevent jittery behavior
    const scrollDifference = Math.abs(currentScrollY - lastScrollY);
    if (scrollDifference < 2) return; // Ignore tiny scroll changes

    const isScrollingDown = currentScrollY > lastScrollY;
    const isScrollingUp = currentScrollY < lastScrollY;

    // Hide bottom nav when at top
    if (currentScrollY <= scrollThreshold) {
      setIsVisible(false);
    }
    // Hide when scrolling up with meaningful movement
    else if (isScrollingUp && scrollDifference > 5) {
      setIsVisible(false);
    }
    // Show when scrolling down past threshold with meaningful movement
    else if (isScrollingDown && currentScrollY > scrollThreshold && scrollDifference > 5) {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [isClient, shouldShowNav, isMobile, lastScrollY, scrollThreshold]);

  // Set client-side flag and initialize mobile detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Initial mobile check after client is ready
      checkMobile();
    }
  }, [isClient, checkMobile]);

  useEffect(() => {
    if (!isClient) return; // Only run on client side

    let timeoutId: NodeJS.Timeout;
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        // Use requestAnimationFrame for smoother mobile performance
        requestAnimationFrame(() => {
          updateNavVisibility();
          isScrolling = false;
        });
        isScrolling = true;
      }
    };

    const handleScrollEnd = () => {
      // Handle scroll end for mobile momentum scrolling
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateNavVisibility, 50);
    };

    const handleResize = () => {
      checkMobile();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateNavVisibility, 100);
    };

    // Add multiple event listeners for better mobile support
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true } as any);
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Initial call to set correct state
    updateNavVisibility();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('scrollend', handleScrollEnd);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isClient, updateNavVisibility, checkMobile, throttleMs]);

  return {
    isVisible: shouldShowNav && isVisible,
    isMobile,
    shouldShowNav
  };
}

export default useMobileBottomNav;