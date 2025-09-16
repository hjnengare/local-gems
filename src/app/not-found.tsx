"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Animated 404 Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-sage via-sage/90 to-sage/80 rounded-2xl flex items-center justify-center shadow-xl"
        >
          <ion-icon
            name="diamond-outline"
            style={{ fontSize: "48px" }}
            class="text-white drop-shadow-sm"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-urbanist text-6xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-urbanist text-2xl font-600 text-charcoal mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-urbanist text-lg font-400 text-charcoal/70 mb-8"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-4"
        >
          <Link
            href="/home"
            className="inline-block w-full py-4 px-8 bg-gradient-to-r from-sage to-sage/90 text-white font-urbanist font-600 text-lg rounded-2xl  transition-all duration-300 hover:scale-[1.02]"
          >
            Go to Home
          </Link>

          <Link
            href="/onboarding"
            className="inline-block w-full py-4 px-8 bg-white/80 backdrop-blur-sm border border-sage/20 text-charcoal font-urbanist font-600 text-lg rounded-2xl hover:bg-sage/10 hover:border-sage transition-all duration-300 hover:scale-[1.02]"
          >
            Start Over
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}