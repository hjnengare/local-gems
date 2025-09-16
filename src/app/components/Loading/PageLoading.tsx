"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PageLoadingProps {
  text?: string;
}

type Particle = {
  x: number;
  y: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
};

export default function PageLoading({ text = "Loading..." }: PageLoadingProps) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate deterministic particles after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const particleCount = 6;
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      x: (i * 13) % 40 - 20, // Deterministic but varied values
      y: (i * 17) % 60 - 30,
      left: `${20 + (i * 11) % 60}%`, // Spread across 20-80%
      top: `${30 + (i * 7) % 40}%`,   // Spread across 30-70%
      delay: (i * 0.5) % 3,           // 0-2.5s delays
      duration: 3 + (i % 3),          // 3-5s durations
    }));
    setParticles(newParticles);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-off-white via-off-white/95 to-off-white/90 backdrop-blur-xl flex items-center justify-center"
    >
      {/* Premium background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-sage/8 via-sage/4 to-transparent rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-coral/6 via-coral/3 to-transparent rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-charcoal/3 via-charcoal/1 to-transparent rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main loading content */}
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 text-center p-16 md:p-18"
      >
        {/* Premium loading text with gradient */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-4"
        >
          <h3 className="font-urbanist text-xl md:text-2xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal mb-2">
            KLIO
          </h3>
        </motion.div>

        {/* Sophisticated animated dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center space-x-2"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [-4, 0, -4],
                opacity: [0.4, 1, 0.4],
                backgroundColor: ["#708090", "#F4A261", "#708090"]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="w-2.5 h-2.5 rounded-full shadow-sm"
            />
          ))}
        </motion.div>

        {/* Subtle loading progress indication */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
          className="mt-6 h-0.5 bg-gradient-to-r from-transparent via-sage/40 to-transparent rounded-full origin-center"
        />
      </motion.div>

      {/* Floating particles for extra premium feel - hydration-safe */}
      {mounted && particles.map((particle, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, -60, -20],
            x: [particle.x, particle.y, particle.x],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-sage/30 rounded-full blur-sm"
          style={{
            left: particle.left,
            top: particle.top
          }}
        />
      ))}
    </motion.div>
  );
}