"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import FadeInUp from "../components/Animations/FadeInUp";
import PremiumHover from "../components/Animations/PremiumHover";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, isLoading } = useAuth();

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Advanced parallax transforms with GPU acceleration
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const orbSlowY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const orbFastY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  // Spring physics for smooth motion
  const springConfig = { damping: 15, stiffness: 100, mass: 0.8 };
  const smoothBackgroundY = useSpring(backgroundY, springConfig);
  const smoothOrbY = useSpring(orbSlowY, springConfig);
  const smoothContentY = useSpring(contentY, springConfig);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Back button with entrance animation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-6 left-6 z-20"
      >
        <PremiumHover scale={1.1} duration={0.2}>
          <Link href="/onboarding" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-3 hover:bg-charcoal/5 rounded-full block">
            <ion-icon name="arrow-back-outline" size="small"></ion-icon>
          </Link>
        </PremiumHover>
      </motion.div>

      {/* Enhanced background decorative elements with advanced parallax */}
      <motion.div
        style={{ y: smoothOrbY }}
        className="absolute inset-0 opacity-4 will-change-transform"
      >
        {/* Layered orbs with independent motion */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.2, type: "spring", stiffness: 180 }}
          style={{ y: orbFastY }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sage/22 to-sage/6 rounded-full blur-3xl will-change-transform"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.4, type: "spring", stiffness: 160 }}
          className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-coral/18 to-coral/6 rounded-full blur-3xl will-change-transform"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.6, type: "spring", stiffness: 220 }}
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]) }}
          className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-charcoal/12 to-charcoal/4 rounded-full blur-2xl will-change-transform"
        />

        {/* Animated geometric accents with different patterns */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1.4, 1],
            opacity: [0, 0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 2.5,
            delay: 1.0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-16 right-20 w-2 h-2 bg-sage/35 rounded-full"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1.2, 1],
            opacity: [0, 0.3, 0.65, 0.3],
          }}
          transition={{
            duration: 3.5,
            delay: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-2 h-2 bg-coral/35 rounded-full"
        />
      </motion.div>

      {/* Multi-layer gradient overlays with parallax */}
      <motion.div
        style={{ y: smoothBackgroundY }}
        className="absolute inset-0 bg-gradient-to-t from-off-white/35 via-transparent to-off-white/25 pointer-events-none will-change-transform"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]) }}
        className="absolute inset-0 bg-gradient-to-r from-sage/3 via-transparent to-coral/3 pointer-events-none will-change-transform"
      />

      <motion.div
        style={{ y: smoothContentY }}
        className="w-[90%] max-w-[700px] mx-auto relative z-10 will-change-transform"
      >
        {/* Header with premium styling and animations */}
        <div className="text-center mb-12 md:mb-16">
          <FadeInUp delay={0.4} duration={1} distance={60}>
            <div className="inline-block relative mb-6">
              <h1 className="font-urbanist text-2 md:text-6xl lg:text-5xl font-700 text-charcoal mb-4 relative">
                Welcome back
              </h1>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "100%", "50%"] }}
                transition={{
                  duration: 2.4,
                  delay: 1.4,
                  ease: [0.25, 0.25, 0.25, 0.75],
                  times: [0, 0.5, 1]
                }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-sage via-coral to-sage rounded-full"
              />
            </div>
          </FadeInUp>
          <FadeInUp delay={0.7} duration={0.8} distance={30}>
            <p className="font-urbanist text-6 md:text-5 font-400 text-charcoal/70 max-w-md mx-auto leading-relaxed">
              Sign in to continue discovering local gems
            </p>
          </FadeInUp>
        </div>

        {/* Demo Credentials Info with animation */}
        <FadeInUp delay={1.0} duration={0.6} distance={20}>
          <motion.div
            className="bg-sage/5 border border-sage/20 rounded-xl p-4 mb-8 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-urbanist text-sm font-600 text-sage mb-2">Demo Login Credentials</p>
            <p className="font-urbanist text-xs text-charcoal/70">
              Email: <span className="font-mono bg-white px-2 py-1 rounded">test@example.com</span> |
              Password: <span className="font-mono bg-white px-2 py-1 rounded">password123</span>
            </p>
          </motion.div>
        </FadeInUp>

        {/* Premium Form Card with parallax */}
        <motion.div
          style={{ y: cardY }}
          className="bg-off-white/95 backdrop-blur-lg rounded-3 shadow-xl p-6 md:p-16 mb-8 relative overflow-hidden will-change-transform"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, type: "spring", stiffness: 200 }}
        >
          {/* Card decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-2xl"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="font-urbanist text-sm font-600 text-red-600">{error}</p>
              </div>
            )}

            {/* Email with icon */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 group-focus-within:text-sage transition-colors duration-300 z-10">
                <ion-icon name="mail-outline" size="small"></ion-icon>
              </div>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cultured-1/50 border border-light-gray/50 rounded-3 pl-14 pr-4 py-4 md:py-5 font-urbanist text-6 font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage focus:bg-white transition-all duration-300 hover:border-sage/50"
              />
            </div>

            {/* Password with enhanced styling */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 group-focus-within:text-sage transition-colors duration-300 z-10">
                <ion-icon name="lock-closed-outline" size="small"></ion-icon>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cultured-1/50 border border-light-gray/50 rounded-3 pl-14 pr-16 py-4 md:py-5 font-urbanist text-6 font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage focus:bg-white transition-all duration-300 hover:border-sage/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors duration-300 p-1 z-10"
              >
                <ion-icon 
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size="small"
                ></ion-icon>
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="#"
                className="font-urbanist text-base font-500 text-coral hover:text-coral/80 transition-colors duration-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button with premium effects */}
            <div className="pt-4 flex justify-center">
              <div className="w-1/2">
                <PremiumHover scale={1.02} shadowIntensity="strong">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="group block w-full bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 text-white font-urbanist text-6 md:text-5 font-600 py-5 md:py-6 px-8 md:px-10 rounded-3 md:rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sage/30 hover:focus:ring-coral/30 focus:ring-offset-2 relative overflow-hidden text-center disabled:opacity-50 disabled:cursor-not-allowed will-change-transform"
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="relative z-10">
                      {isLoading ? "Signing in..." : "Sign In"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </PremiumHover>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6 md:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-light-gray/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-off-white/90 text-charcoal/60 font-urbanist text-7 font-400">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <button
                type="button"
                className="flex items-center justify-center bg-white border border-light-gray/50 rounded-3 px-4 md:px-6 py-4 md:py-5 font-urbanist text-7 md:text-6 font-500 text-charcoal hover:border-sage/50 hover:bg-sage/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 group"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="group-hover:text-sage transition-colors duration-300">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center bg-white border border-light-gray/50 rounded-3 px-4 md:px-6 py-4 md:py-5 font-urbanist text-7 md:text-6 font-500 text-charcoal hover:border-sage/50 hover:bg-sage/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 group"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="group-hover:text-sage transition-colors duration-300">Apple</span>
              </button>
            </div>
          </form>

          {/* Enhanced footer */}
          <div className="text-center mt-8 pt-6 border-t border-light-gray/30">
            <p className="font-urbanist text-7 font-400 text-charcoal/70">
              {"Don&apos;t have an account? "}
              <Link
                href="/register"
                className="text-coral font-600 hover:text-coral/80 transition-colors duration-300 relative group"
              >
                <span>Sign up</span>
                <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-coral/30 group-hover:bg-coral/60 transition-colors duration-300 rounded-full"></div>
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Premium Trust Indicators with spring animations */}
        <div className="flex justify-center items-center space-x-8 md:space-x-12 text-charcoal/60 text-center">
          <FadeInUp delay={1.5} duration={0.6} distance={20}>
            <PremiumHover scale={1.1} duration={0.3}>
              <div className="flex flex-col items-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.7, type: "spring", stiffness: 300 }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-sage/10 rounded-full flex items-center justify-center"
                >
                  <ion-icon name="shield-checkmark-outline" style={{ color: "#749176" }} size="small"></ion-icon>
                </motion.div>
                <span className="font-urbanist text-8 md:text-7 font-500">Secure</span>
              </div>
            </PremiumHover>
          </FadeInUp>

          <FadeInUp delay={1.7} duration={0.6} distance={20}>
            <PremiumHover scale={1.1} duration={0.3}>
              <div className="flex flex-col items-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.9, type: "spring", stiffness: 300 }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-coral/10 rounded-full flex items-center justify-center"
                >
                  <ion-icon name="people-outline" style={{ color: "#d67469" }} size="small"></ion-icon>
                </motion.div>
                <span className="font-urbanist text-8 md:text-7 font-500">Community</span>
              </div>
            </PremiumHover>
          </FadeInUp>

          <FadeInUp delay={1.9} duration={0.6} distance={20}>
            <PremiumHover scale={1.1} duration={0.3}>
              <div className="flex flex-col items-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 2.1, type: "spring", stiffness: 300 }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-charcoal/10 rounded-full flex items-center justify-center"
                >
                  <ion-icon name="star-outline" style={{ color: "#211e1d" }} size="small"></ion-icon>
                </motion.div>
                <span className="font-urbanist text-8 md:text-7 font-500">Quality</span>
              </div>
            </PremiumHover>
          </FadeInUp>
        </div>
      </motion.div>
    </div>
  );
}