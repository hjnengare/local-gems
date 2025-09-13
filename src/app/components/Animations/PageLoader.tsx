"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PageLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

export default function PageLoader({ onComplete, duration = 1.5 }: PageLoaderProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      onComplete?.();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-off-white via-off-white to-sage/5 flex items-center justify-center"
    >
      {/* Central loading animation */}
      <div className="relative">
        {/* Main logo animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.25, 0.25, 0.75] }}
          className="text-center"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-urbanist text-5xl md:text-6xl font-800 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage to-charcoal mb-4"
          >
            Local Gems
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-urbanist text-lg font-500 text-charcoal/70 mb-8"
          >
            Discovering premium experiences
          </motion.p>

          {/* Animated loading bar */}
          <div className="relative w-48 h-1 bg-charcoal/10 rounded-full overflow-hidden mx-auto">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: duration - 0.5, ease: "easeOut" }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-sage to-coral rounded-full"
            />
          </div>
        </motion.div>

        {/* Floating particles around the logo */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-sage/30 rounded-full"
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
            }}
            animate={{
              x: [0, Math.cos((i * Math.PI) / 4) * 100, 0],
              y: [0, Math.sin((i * Math.PI) / 4) * 100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-2xl"
        />
      </div>
    </motion.div>
  );
}