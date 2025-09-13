"use client";

import { useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  once?: boolean;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    once = true,
    delay = 0,
    duration = 0.7,
    distance = 50,
    direction = "up",
  } = options;

  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { threshold, once });

  const directionOffset = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        },
      });
    } else if (!once) {
      controls.start({
        opacity: 0,
        ...directionOffset[direction],
      });
    }
  }, [inView, controls, delay, duration, direction, distance, once]);

  const initialState = {
    opacity: 0,
    ...directionOffset[direction],
  };

  return { ref, controls, inView, initialState };
}