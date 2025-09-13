"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FadeInUp from "../components/Animations/FadeInUp";
import ScrollReveal from "../components/Animations/ScrollReveal";

export default function OnboardingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms for different elements
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Enhanced background decorative elements with parallax */}
      <motion.div
        style={{ y: orbY }}
        className="absolute inset-0 opacity-8"
      >
        {/* Main floating orbs with individual motion */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.25, 0.25, 0.75] }}
          className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-sage/30 to-sage/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.25, 0.25, 0.25, 0.75] }}
          className="absolute bottom-32 right-16 w-56 h-56 bg-gradient-to-br from-coral/25 to-coral/8 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.25, 0.25, 0.75] }}
          className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-charcoal/20 to-charcoal/5 rounded-full blur-2xl"
        />

        {/* Additional subtle orbs */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.25, 0.25, 0.75] }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-sage/15 to-sage/5 rounded-full blur-2xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 1, ease: [0.25, 0.25, 0.25, 0.75] }}
          className="absolute bottom-20 left-20 w-36 h-36 bg-gradient-to-br from-coral/20 to-coral/5 rounded-full blur-3xl"
        />

        {/* Geometric patterns with staggered entrance */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2, ease: [0.25, 0.25, 0.25, 0.75] }}
          className="absolute top-10 right-10 w-2 h-2 bg-sage/20 rounded-full animate-ping"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4, ease: [0.25, 0.25, 0.25, 0.75] }}
          className="absolute bottom-10 left-10 w-2 h-2 bg-coral/20 rounded-full animate-ping"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6, ease: [0.25, 0.25, 0.25, 0.75] }}
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-charcoal/25 rounded-full animate-ping"
        />
      </motion.div>
      
      {/* Subtle mesh gradient overlay with parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-gradient-to-t from-off-white/50 via-transparent to-off-white/30 pointer-events-none"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]) }}
        className="absolute inset-0 bg-gradient-to-r from-sage/3 via-transparent to-coral/3 pointer-events-none"
      />

      <motion.div
        style={{ y: contentY }}
        className="w-full max-w-full px-6 md:max-w-4xl md:px-4 mx-auto relative z-10"
      >
        {/* App Name */}
        <FadeInUp delay={0.3} duration={0.8} distance={40}>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block relative">
              <h1 className="font-urbanist text-4 md:text-4xl font-700 text-charcoal mb-2 relative">
                Local Gems
              </h1>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 1.1, ease: [0.25, 0.25, 0.25, 0.75] }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-sage via-coral to-sage rounded-full"
              />
            </div>
          </div>
        </FadeInUp>

        {/* Main Content */}
        <div className="text-center mb-12 md:mb-16">
          <FadeInUp delay={0.6} duration={1} distance={50}>
            <h2 className="font-urbanist text-2 md:text-6xl lg:text-7xl font-700 text-charcoal mb-8 md:mb-8 text-center leading-tight px-2">
              Discover trusted local gems near you!
            </h2>
          </FadeInUp>

          <FadeInUp delay={0.9} duration={0.8} distance={30}>
            <p className="font-urbanist text-6 md:text-5 font-400 text-charcoal/70 mb-12 md:mb-16 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto">
              Let&apos;s find your new favourite spot and connect with authentic experiences in your community
            </p>
          </FadeInUp>

          <div className="space-y-6 md:space-y-6 max-w-xs md:max-w-md mx-auto">
            <FadeInUp delay={1.2} duration={0.7} distance={40}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.25, 0.25, 0.25, 0.75] }}
              >
                <Link
                  href="/register"
                  className="group block w-full bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 text-white font-urbanist text-6 md:text-5 font-600 py-5 md:py-6 px-8 md:px-10 rounded-3 md:rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sage/30 hover:focus:ring-coral/30 focus:ring-offset-2 relative overflow-hidden text-center"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </motion.div>
            </FadeInUp>

            <FadeInUp delay={1.4} duration={0.7} distance={30}>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  y: -2
                }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/login"
                  className="group block w-full text-coral font-urbanist text-6 md:text-5 font-600 py-5 md:py-6 px-8 md:px-10 transition-all duration-300 focus:outline-none relative text-center"
                >
                  <span className="relative z-10 group-hover:text-coral/80">Log in</span>
                  <div className="absolute inset-x-0 bottom-2 h-0.5 bg-coral/30 group-hover:bg-coral/60 transition-colors duration-300 rounded-full"></div>
                </Link>
              </motion.div>
            </FadeInUp>
          </div>
        </div>

        {/* Trust indicators with staggered animations */}
        <div className="flex justify-center items-center space-x-8 md:space-x-12 text-charcoal/60 text-center px-4">
          <FadeInUp delay={1.6} duration={0.6} distance={20}>
            <motion.div
              whileHover={{
                scale: 1.1,
                y: -5
              }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-2 md:space-y-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.8, type: "spring", stiffness: 300 }}
                className="w-12 h-12 md:w-16 md:h-16 bg-sage/10 rounded-full flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 2.0, type: "spring", stiffness: 400 }}
                  className="w-5 h-5 md:w-8 md:h-8 bg-sage rounded-full"
                />
              </motion.div>
              <span className="font-urbanist text-8 md:text-7 font-500">Trusted</span>
            </motion.div>
          </FadeInUp>

          <FadeInUp delay={1.8} duration={0.6} distance={20}>
            <motion.div
              whileHover={{
                scale: 1.1,
                y: -5
              }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-2 md:space-y-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 2.0, type: "spring", stiffness: 300 }}
                className="w-12 h-12 md:w-16 md:h-16 bg-coral/10 rounded-full flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 2.2, type: "spring", stiffness: 400 }}
                  className="w-5 h-5 md:w-8 md:h-8 bg-coral rounded-full"
                />
              </motion.div>
              <span className="font-urbanist text-8 md:text-7 font-500">Local</span>
            </motion.div>
          </FadeInUp>

          <FadeInUp delay={2.0} duration={0.6} distance={20}>
            <motion.div
              whileHover={{
                scale: 1.1,
                y: -5
              }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-2 md:space-y-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 2.2, type: "spring", stiffness: 300 }}
                className="w-12 h-12 md:w-16 md:h-16 bg-charcoal/10 rounded-full flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 2.4, type: "spring", stiffness: 400 }}
                  className="w-5 h-5 md:w-8 md:h-8 bg-charcoal rounded-full"
                />
              </motion.div>
              <span className="font-urbanist text-8 md:text-7 font-500">Authentic</span>
            </motion.div>
          </FadeInUp>
        </div>
      </motion.div>
    </div>
  );
}