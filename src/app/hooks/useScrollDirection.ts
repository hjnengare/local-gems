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

  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;
    const isScrollingUp = currentScrollY < lastScrollY;

    // Determine visibility based on scroll behavior
    let isVisible = true;

    if (currentScrollY <= 10) {
      // Always show when at top
      isVisible = true;
    } else if (isScrollingUp) {
      // Show when scrolling up
      isVisible = true;
    } else if (isScrollingDown && currentScrollY > threshold) {
      // Hide when scrolling down past threshold
      isVisible = false;
    }

    setScrollState({
      isVisible,
      scrollY: currentScrollY,
      isScrollingDown,
      isScrollingUp
    });

    setLastScrollY(currentScrollY);
  }, [lastScrollY, threshold]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Throttle scroll events for better performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScrollState, throttleMs);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [updateScrollState, throttleMs]);

  return scrollState;
}

export default useScrollDirection;