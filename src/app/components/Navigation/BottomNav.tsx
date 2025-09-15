"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/home",
    icon: "home"
  },
  {
    name: "Explore",
    href: "/all",
    icon: "search"
  },
  {
    name: "Saved",
    href: "/saved",
    icon: "bookmark"
  },
  {
    name: "Profile",
    href: "/profile",
    icon: "person"
  }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-off-white/95 backdrop-blur-xl border-t border-sage/10 md:hidden">
      <div className="flex items-center justify-around py-3 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className="relative flex flex-col items-center space-y-1 py-2 px-4 rounded-2xl transition-all duration-300 group"
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActive"
                  className="absolute inset-0 bg-sage/10 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon container */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-sage text-white shadow-lg"
                    : "text-charcoal/60 group-hover:text-sage group-hover:bg-sage/10"
                }`}
              >
                <ion-icon
                  name={isActive ? item.icon : `${item.icon}-outline`}
                  style={{ fontSize: "20px" }}
                />
              </motion.div>

              {/* Label */}
              <span
                className={`relative z-10 font-urbanist text-xs font-600 transition-all duration-300 ${
                  isActive
                    ? "text-sage"
                    : "text-charcoal/60 group-hover:text-sage"
                }`}
              >
                {item.name}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 w-1 h-1 bg-sage rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* iPhone-style home indicator */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-charcoal/20 rounded-full" />
      </div>
    </nav>
  );
}