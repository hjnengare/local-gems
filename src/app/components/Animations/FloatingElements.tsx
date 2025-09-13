"use client";

import { motion } from "framer-motion";

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating orbs */}
      <motion.div
        className="absolute w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"
        initial={{ x: -100, y: 100 }}
        animate={{
          x: ["-100px", "100px", "-100px"],
          y: ["100px", "50px", "100px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ top: "20%", left: "10%" }}
      />

      <motion.div
        className="absolute w-24 h-24 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-xl"
        initial={{ x: 100, y: -50 }}
        animate={{
          x: ["100px", "-50px", "100px"],
          y: ["-50px", "100px", "-50px"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ top: "60%", right: "15%" }}
      />

      <motion.div
        className="absolute w-20 h-20 bg-gradient-to-br from-sage/6 to-transparent rounded-full blur-lg"
        initial={{ x: 0, y: 0 }}
        animate={{
          x: ["0px", "80px", "-40px", "0px"],
          y: ["0px", "-60px", "40px", "0px"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ bottom: "20%", left: "20%" }}
      />

      {/* Subtle sparkles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-sage/20 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            opacity: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}