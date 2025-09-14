"use client";

import { motion } from "framer-motion";

interface PageLoadingProps {
  text?: string;
}

export default function PageLoading({ text = "Loading..." }: PageLoadingProps) {
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
        className="relative z-10 text-center bg-white/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
      >
        {/* Logo or gem icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring", bounce: 0.4 }}
          className="relative mb-6"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-sage via-sage/90 to-sage/80 rounded-2xl flex items-center justify-center shadow-xl">
            <ion-icon
              name="diamond"
              style={{ fontSize: "32px" }}
              class="text-white drop-shadow-sm"
            />
          </div>

          {/* Glowing ring effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-sage/30 to-transparent rounded-2xl blur-md"
          />
        </motion.div>

        {/* Enhanced loading spinner */}
        <div className="relative mb-6">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto relative"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sage via-coral to-sage opacity-20 blur-sm" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-transparent via-sage/40 via-coral/40 to-transparent"
                 style={{
                   background: `conic-gradient(from 0deg, transparent 0deg, #708090 90deg, transparent 360deg)`,
                   maskImage: `radial-gradient(circle, transparent 35%, black 36%, black 64%, transparent 65%)`,
                   WebkitMaskImage: `radial-gradient(circle, transparent 35%, black 36%, black 64%, transparent 65%)`
                 }}
            />
          </motion.div>

          {/* Inner pulsing core */}
          <motion.div
            animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-sage to-coral rounded-full shadow-lg"
          />
        </div>

        {/* Premium loading text with gradient */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-4"
        >
          <h3 className="font-urbanist text-xl md:text-2xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal mb-2">
            Local Gems
          </h3>
          <p className="font-urbanist text-base font-500 text-charcoal/70">
            {text}
          </p>
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

      {/* Floating particles for extra premium feel */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, -60, -20],
            x: [Math.random() * 40 - 20, Math.random() * 60 - 30, Math.random() * 40 - 20],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-sage/30 rounded-full blur-sm"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${30 + Math.random() * 40}%`
          }}
        />
      ))}
    </motion.div>
  );
}