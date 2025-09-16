"use client";

import { useState, useEffect, useCallback } from 'react';

interface ScrollDirectionOptions {
  threshold?: number;
  throttleMs?: number;
}

interface ScrollState {
  isVisible: boolean;
  scrollY: number;
  isScrollingDown: boolean;
  isScrollingUp: boolean;
}

export function useScrollDirection({
  threshold = 100,
  throttleMs = 16
}: ScrollDirectionOptions = {}): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isVisible: true,
    scrollY: 0,
    isScrollingDown: false,
    isScrollingUp: false
  });
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!isClient) return; // Only run on client side

    // Use both window.scrollY and document.documentElement.scrollTop for mobile compatibility
    const currentScrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Add minimum scroll difference to prevent jittery behavior on mobile
    const scrollDifference = Math.abs(currentScrollY - lastScrollY);
    if (scrollDifference < 1) return; // Ignore tiny scroll changes

    const isScrollingDown = currentScrollY > lastScrollY;
    const isScrollingUp = currentScrollY < lastScrollY;

    // Determine visibility based on scroll behavior
    let isVisible = true;

    if (currentScrollY <= 10) {
      // Always show when at top
      isVisible = true;
    } else if (isScrollingUp && scrollDifference > 3) {
      // Show when scrolling up with meaningful movement
      isVisible = true;
    } else if (isScrollingDown && currentScrollY > threshold && scrollDifference > 3) {
      // Hide when scrolling down past threshold with meaningful movement
      isVisible = false;
    }

    setScrollState({
      isVisible,
      scrollY: currentScrollY,
      isScrollingDown,
      isScrollingUp
    });

    setLastScrollY(currentScrollY);
  }, [isClient, lastScrollY, threshold]);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only run on client side

    let timeoutId: NodeJS.Timeout;
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        // Use requestAnimationFrame for smoother mobile performance
        requestAnimationFrame(() => {
          updateScrollState();
          isScrolling = false;
        });
        isScrolling = true;
      }
    };

    const handleScrollEnd = () => {
      // Handle scroll end for mobile momentum scrolling
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScrollState, 50);
    };

    // Add multiple event listeners for better mobile support
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true } as any);

    // Initial call to set correct state
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('scrollend', handleScrollEnd);
      clearTimeout(timeoutId);
    };
  }, [isClient, updateScrollState, throttleMs]);

  return scrollState;
}

export default useScrollDirection;