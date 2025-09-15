"use client";

import { ReactNode, useState, useEffect, ComponentType } from "react";
import { useInView } from "../hooks/useInView";

interface OptimizedFadeInUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  useFramerMotion?: boolean;
}

export default function OptimizedFadeInUp({
  children,
  delay = 0,
  duration = 0.6,
  distance = 30,
  className = "",
  useFramerMotion = false,
}: OptimizedFadeInUpProps) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [isVisible, setIsVisible] = useState(false);
  const [FramerMotionComponent, setFramerMotionComponent] = useState<ComponentType<{
    ref: React.RefObject<HTMLDivElement>;
    initial: object;
    animate: object;
    transition: object;
    className: string;
    children: ReactNode;
  }> | null>(null);

  useEffect(() => {
    if (inView && !isVisible) {
      const timer = setTimeout(() => setIsVisible(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [inView, delay, isVisible]);

  useEffect(() => {
    if (useFramerMotion && inView && !FramerMotionComponent) {
      import("framer-motion").then((module) => {
        setFramerMotionComponent(() => module.motion.div);
      });
    }
  }, [useFramerMotion, inView, FramerMotionComponent]);

  // Use CSS-based animation for better performance
  if (!useFramerMotion) {
    return (
      <div
        ref={ref}
        className={`transition-all duration-${Math.round(duration * 1000)} ease-out ${
          isVisible
            ? "opacity-100 translate-y-0"
            : `opacity-0 translate-y-${distance >= 30 ? "8" : "4"}`
        } ${className}`}
      >
        {children}
      </div>
    );
  }

  // Fallback to Framer Motion when needed
  if (FramerMotionComponent) {
    return (
      <FramerMotionComponent
        ref={ref}
        initial={{ opacity: 0, y: distance }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        }}
        className={className}
      >
        {children}
      </FramerMotionComponent>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}