"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState } from "react";

// Dynamic imports for premium animations
const FadeInUp = dynamic(() => import("../components/Animations/FadeInUp"), {
  ssr: false,
});

const PremiumHover = dynamic(() => import("../components/Animations/PremiumHover"), {
  ssr: false,
});

export default function ProfilePage() {
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  const user = {
    username: "JessClLeigh",
    profilePicture: "/images/profile-1.jpg",
    title: "Top Reviewer in Cape Town this Month",
    stats: {
      reviews: 124,
      badges: 3,
      memberSince: "Jan 1 '23"
    },
    contributions: [
      { business: "Mama's Kitchen", rating: 4, date: "Feb 2023" },
      { business: "Tiger's Milk", rating: 4, date: "March 2023" }
    ],
    achievements: [
      "Trust Expert",
      "Top Reviewer in Cape Town March 2023"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sage/30 to-sage/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 0.8 }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-coral/20 to-coral/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-charcoal/5 to-transparent rounded-full blur-2xl"
        />
      </div>

      {/* Premium Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 backdrop-blur-xl border-b border-sage/10 px-4 py-6 shadow-sm"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/home" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full">
              <ion-icon name="arrow-back-outline" size="small"></ion-icon>
            </Link>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-urbanist text-2xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal"
          >
            Profile
          </motion.h1>

          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-coral/20 to-coral/10 flex items-center justify-center"
          >
            <Link href="/profile/edit" className="text-coral">
              <ion-icon name="create-outline" size="small"></ion-icon>
            </Link>
          </motion.div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        {/* Premium Profile Header */}
        <FadeInUp delay={0.2}>
          <PremiumHover scale={1.02} shadowIntensity="medium" duration={0.4}>
            <div className="bg-off-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-sage/10 p-8 mb-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                  {/* Premium Profile Picture */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-sage/20 group-hover:ring-sage/40 transition-all duration-500 relative">
                      <Image
                        src={user.profilePicture}
                        alt={`${user.username} profile picture`}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        priority
                      />
                      {/* Shimmer overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>
                    </div>

                    {/* Online status indicator */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.4 }}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-sage rounded-full border-3 border-white flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </motion.div>
                  </motion.div>

                  {/* Premium User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="font-urbanist text-3xl md:text-4xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal mb-2"
                    >
                      @{user.username}
                    </motion.h2>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="flex items-center justify-center md:justify-start space-x-3 mb-4"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg"
                      >
                        <ion-icon name="trophy" style={{ color: 'white', fontSize: '18px' }} />
                      </motion.div>
                      <span className="font-urbanist text-lg font-600 text-sage">
                        {user.title}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </PremiumHover>
        </FadeInUp>

        {/* Premium Stats Overview */}
        <FadeInUp delay={0.4}>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
            className="cursor-pointer bg-off-white/90 backdrop-blur-lg rounded-2xl p-6 border border-sage/20 relative overflow-hidden group"
          >
            {/* Hover effect background */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage/5 to-coral/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-urbanist text-xl font-600 text-charcoal">Stats Overview</h3>
                <motion.div
                  animate={{ rotate: isStatsExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sage"
                >
                  <ion-icon name="chevron-down-outline" size="small"></ion-icon>
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                {[
                  { icon: "star", value: user.stats.reviews, label: "reviews", color: "sage" },
                  { icon: "trophy", value: user.stats.badges, label: "badges", color: "coral" },
                  { icon: "calendar", value: user.stats.memberSince, label: "Member since", color: "sage" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + (index * 0.1), duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group/stat"
                  >
                    <div className="relative">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${
                          stat.color === 'sage' ? 'from-sage/20 to-sage/10' : 'from-coral/20 to-coral/10'
                        } flex items-center justify-center group-hover/stat:shadow-lg transition-shadow duration-300`}
                      >
                        <ion-icon
                          name={`${stat.icon}-outline`}
                          style={{
                            color: stat.color === 'sage' ? 'var(--sage)' : 'var(--coral)',
                            fontSize: '24px'
                          }}
                        />
                      </motion.div>

                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="font-urbanist text-2xl font-700 text-charcoal mb-1"
                      >
                        {stat.value}
                      </motion.div>

                      <span className="font-urbanist text-sm font-400 text-charcoal/60 capitalize">
                        {stat.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isStatsExpanded ? 'auto' : 0,
                  opacity: isStatsExpanded ? 1 : 0
                }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-6 border-t border-sage/10">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gradient-to-br from-sage/10 to-transparent rounded-xl p-4">
                      <div className="text-lg font-700 text-sage">89%</div>
                      <div className="text-xs text-charcoal/60">Helpfulness Score</div>
                    </div>
                    <div className="bg-gradient-to-br from-coral/10 to-transparent rounded-xl p-4">
                      <div className="text-lg font-700 text-coral">12</div>
                      <div className="text-xs text-charcoal/60">This Month</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </FadeInUp>

        {/* Your Contributions */}
        <FadeInUp delay={0.6}>
          <PremiumHover scale={1.01} shadowIntensity="soft" duration={0.3}>
            <div className="bg-off-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-sage/10 p-6 mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-urbanist text-5 font-600 text-black">Your Contributions</h3>
            <button className="font-urbanist text-7 font-500 text-hoockers-green hover:underline">
              See all reviews
            </button>
          </div>
          
          <div className="space-y-4">
            {user.contributions.map((contribution, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-light-gray last:border-b-0">
                <div>
                  <h4 className="font-urbanist text-6 font-600 text-black">
                    - {contribution.business}
                  </h4>
                  <span className="font-urbanist text-8 font-400 text-gray-web">
                    ({contribution.date})
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <ion-icon
                      key={i}
                      name={i < contribution.rating ? "star" : "star-outline"}
                      style={{ color: i < contribution.rating ? "#589f6a" : "#9ca3af" }}
                      size="small"
                    ></ion-icon>
                  ))}
                </div>
              </div>
            ))}
          </div>
            </div>
          </PremiumHover>
        </FadeInUp>

        {/* Your Achievements */}
        <FadeInUp delay={0.8}>
          <PremiumHover scale={1.01} shadowIntensity="soft" duration={0.3}>
            <div className="bg-off-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-sage/10 p-6 mb-6 relative overflow-hidden">
          <h3 className="font-urbanist text-5 font-600 text-black mb-4">Your Achievements</h3>
          <div className="space-y-3">
            {user.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-pale-spring-bud rounded-3">
                <div className="w-8 h-8 bg-hoockers-green rounded-full flex items-center justify-center">
                  <ion-icon name="trophy" style={{ color: 'white' }} size="small"></ion-icon>
                </div>
                <span className="font-urbanist text-6 font-500 text-black">{achievement}</span>
              </div>
            ))}
          </div>
            </div>
          </PremiumHover>
        </FadeInUp>

        {/* Account Settings */}
        <FadeInUp delay={1.0}>
          <PremiumHover scale={1.01} shadowIntensity="soft" duration={0.3}>
            <div className="bg-off-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-sage/10 p-6 mb-6 relative overflow-hidden">
          <div className="space-y-3">
            {[
              { icon: "settings-outline", label: "Account Settings", color: "sage" },
              { icon: "notifications-outline", label: "Notifications", color: "sage" },
              { icon: "shield-outline", label: "Privacy & Data", color: "sage" },
              { icon: "log-out-outline", label: "Log Out", color: "coral", isLogout: true }
            ].map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + (index * 0.1), duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-4 w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                  item.isLogout
                    ? 'hover:bg-coral/10 border border-transparent hover:border-coral/20'
                    : 'hover:bg-sage/10 border border-transparent hover:border-sage/20'
                }`}
              >
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.isLogout
                      ? 'bg-coral/10 group-hover:bg-coral/20'
                      : 'bg-sage/10 group-hover:bg-sage/20'
                  } transition-all duration-300`}
                >
                  <ion-icon
                    name={item.icon}
                    style={{
                      color: item.isLogout ? 'var(--coral)' : 'var(--sage)',
                      fontSize: '20px'
                    }}
                  />
                </motion.div>
                <span className={`font-urbanist text-lg font-500 transition-colors duration-300 ${
                  item.isLogout
                    ? 'text-coral group-hover:text-coral'
                    : 'text-charcoal group-hover:text-sage'
                }`}>
                  {item.label}
                </span>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="ml-auto"
                >
                  <ion-icon
                    name="chevron-forward-outline"
                    style={{
                      color: item.isLogout ? 'var(--coral)' : 'var(--sage)',
                      fontSize: '16px'
                    }}
                  />
                </motion.div>
              </motion.button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-sage/10 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/home"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-sage to-sage/90 text-white font-urbanist text-sm font-600 py-3 px-6 rounded-full hover:shadow-lg transition-all duration-300"
              >
                <ion-icon name="home-outline" size="small"></ion-icon>
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </div>
            </div>
          </PremiumHover>
        </FadeInUp>
      </div>
    </div>
  );
}