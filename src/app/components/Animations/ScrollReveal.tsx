"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { ReactNode, useRef, useEffect, useCallback } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.7,
  distance = 50,
  direction = "up",
  className,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { threshold, once });

  // Memoize direction offset to prevent recalculation
  const directionOffset = useCallback(() => ({
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }), [distance]);

  // Memoize transition object
  const transition = useCallback(() => ({
    duration,
    delay,
    ease: [0.25, 0.25, 0.25, 0.75] as const,
  }), [duration, delay]);

  useEffect(() => {
    const offset = directionOffset();

    if (inView) {
      controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        transition: transition(),
      });
    } else if (!once) {
      controls.start({
        opacity: 0,
        ...offset[direction],
      });
    }
  }, [inView, controls, direction, once, directionOffset, transition]);

  const initialValues = {
    opacity: 0,
    ...directionOffset()[direction],
  };

  return (
    <motion.div
      ref={ref}
      initial={initialValues}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
}