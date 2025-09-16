"use client";

import { motion } from "framer-motion";

interface KlioLogoProps {
  size?: "small" | "medium" | "large" | "xl";
  className?: string;
  animated?: boolean;
  variant?: "default" | "gradient" | "outline";
}

export default function KlioLogo({
  size = "medium",
  className = "",
  animated = true,
  variant = "default"
}: KlioLogoProps) {

  // Size mappings
  const sizeClasses = {
    small: "text-xl sm:text-2xl",
    medium: "text-2xl sm:text-3xl md:text-4xl",
    large: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
    xl: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
  };

  // Color mappings for each letter
  const letterColors = {
    K: "#749176", // Sage
    L: "#d67469", // Coral
    I: "#f2e3da", // Off-white
    O: "#211e1d"  // Charcoal (optional accent)
  };

  // Variant styles
  const getLetterStyle = (letter: keyof typeof letterColors) => {
    const baseColor = letterColors[letter];

    switch (variant) {
      case "gradient":
        return {
          color: "transparent",
          backgroundImage: `linear-gradient(135deg, ${baseColor}, ${baseColor}dd)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text"
        };
      case "outline":
        return {
          color: "transparent",
          WebkitTextStroke: `2px ${baseColor}`,
          textShadow: `0 0 8px ${baseColor}20`
        };
      default:
        return {
          color: baseColor,
          textShadow: letter === "I" ? "0 1px 2px rgba(0,0,0,0.1)" : "none" // Add shadow for off-white letter
        };
    }
  };

  const logoContent = (
    <span className={`font-urbanist font-700 tracking-tight ${sizeClasses[size]} ${className}`}>
      <span style={getLetterStyle("K")}>K</span>
      <span style={getLetterStyle("L")}>L</span>
      <span style={getLetterStyle("I")}>I</span>
      <span style={getLetterStyle("O")}>O</span>
    </span>
  );

  if (!animated) {
    return logoContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }}
      className="inline-block"
    >
      <span className={`font-urbanist font-700 tracking-tight ${sizeClasses[size]} ${className}`}>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, type: "spring", bounce: 0.3 }}
          style={getLetterStyle("K")}
          className="inline-block"
        >
          K
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, type: "spring", bounce: 0.3 }}
          style={getLetterStyle("L")}
          className="inline-block"
        >
          L
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, type: "spring", bounce: 0.3 }}
          style={getLetterStyle("I")}
          className="inline-block"
        >
          I
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, type: "spring", bounce: 0.3 }}
          style={getLetterStyle("O")}
          className="inline-block"
        >
          O
        </motion.span>
      </span>
    </motion.div>
  );
}