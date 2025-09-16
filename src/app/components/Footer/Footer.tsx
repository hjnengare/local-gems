"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface FooterProps {
  variant?: 'default' | 'bottom-nav';
}

export default function Footer({ variant = 'default' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === 'bottom-nav') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-light-gray px-4 py-2 z-40">
        <div className="flex items-center justify-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex flex-col items-center space-y-1 p-2 text-hoockers-green">
              <ion-icon name="home" size="small"></ion-icon>
              <span className="font-urbanist text-9 font-500">Home</span>
            </Link>
            <Link href="/leaderboard" className="flex flex-col items-center space-y-1 p-2 text-gray-web hover:text-hoockers-green transition-colors duration-1">
              <ion-icon name="trophy-outline" size="small"></ion-icon>
              <span className="font-urbanist text-9 font-500">Leaderboard</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const footerLinks = {
    company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Safety", href: "/safety" },
      { name: "Community", href: "/community" },
      { name: "Contact", href: "/contact" }
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Cookies", href: "/cookies" },
      { name: "Accessibility", href: "/accessibility" }
    ]
  };

  const socialLinks = [
    { name: "Twitter", icon: "logo-twitter", href: "#" },
    { name: "Instagram", icon: "logo-instagram", href: "#" },
    { name: "Facebook", icon: "logo-facebook", href: "#" },
    { name: "LinkedIn", icon: "logo-linkedin", href: "#" }
  ];

  return (
    <footer className="hidden md:block bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 border-t border-sage/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="inline-block">
                <h2 className="font-urbanist text-3xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal mb-4">
                  KLIO
                </h2>
              </Link>
              <p className="font-urbanist text-6 text-charcoal/70 leading-relaxed mb-6 max-w-sm">
                Discover trusted local businesses and authentic experiences in your community.
              </p>

              {/* Social links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-sage/10 hover:bg-sage/20 rounded-full flex items-center justify-center text-sage hover:text-sage/80 transition-all duration-300"
                    aria-label={social.name}
                  >
                    <ion-icon name={social.icon} style={{ fontSize: "20px" }} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links sections */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Company */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-urbanist text-5 font-600 text-charcoal mb-4">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="font-urbanist text-6 text-charcoal/70 hover:text-sage transition-colors duration-300 group"
                      >
                        <span className="relative">
                          {link.name}
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-sage/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="font-urbanist text-5 font-600 text-charcoal mb-4">Support</h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="font-urbanist text-6 text-charcoal/70 hover:text-sage transition-colors duration-300 group"
                      >
                        <span className="relative">
                          {link.name}
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-sage/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Legal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="font-urbanist text-5 font-600 text-charcoal mb-4">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="font-urbanist text-6 text-charcoal/70 hover:text-sage transition-colors duration-300 group"
                      >
                        <span className="relative">
                          {link.name}
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-sage/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-sage/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">

            {/* Copyright */}
            <div className="flex items-center space-x-6">
              <p className="font-urbanist text-7 text-charcoal/60">
                © {currentYear} KLIO. All rights reserved.
              </p>

              {/* Trust indicators */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-sage/10 rounded-full">
                  <ion-icon name="shield-checkmark" style={{ color: "#749176", fontSize: "14px" }} />
                  <span className="font-urbanist text-8 font-500 text-sage">Secure</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-coral/10 rounded-full">
                  <ion-icon name="heart" style={{ color: "#d67469", fontSize: "14px" }} />
                  <span className="font-urbanist text-8 font-500 text-coral">Trusted</span>
                </div>
              </div>
            </div>

            {/* App download links */}
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center space-x-3 bg-gradient-to-r from-white/90 to-white/95 hover:from-white hover:to-white border border-charcoal/10 hover:border-charcoal/20 rounded-2xl px-5 py-3 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer overflow-hidden"
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-sage/5 to-coral/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-black rounded-xl flex items-center justify-center shadow-sm">
                    <ion-icon name="logo-apple" style={{ fontSize: "22px", color: "white" }} />
                  </div>
                  <div className="text-left">
                    <div className="font-urbanist text-xs text-charcoal/60 mb-0.5">Download on the</div>
                    <div className="font-urbanist text-sm font-700 text-charcoal">App Store</div>
                    <div className="font-urbanist text-xs text-coral font-600 mt-0.5">Coming Soon</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center space-x-3 bg-gradient-to-r from-white/90 to-white/95 hover:from-white hover:to-white border border-charcoal/10 hover:border-charcoal/20 rounded-2xl px-5 py-3 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer overflow-hidden"
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-sage/5 to-coral/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                    <ion-icon name="logo-google-playstore" style={{ fontSize: "22px", color: "white" }} />
                  </div>
                  <div className="text-left">
                    <div className="font-urbanist text-xs text-charcoal/60 mb-0.5">Get it on</div>
                    <div className="font-urbanist text-sm font-700 text-charcoal">Google Play</div>
                    <div className="font-urbanist text-xs text-coral font-600 mt-0.5">Coming Soon</div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>

      </div>
    </footer>
  );
}