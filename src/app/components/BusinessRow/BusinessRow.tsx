"use client";

import { useRouter } from "next/navigation";
import BusinessCard, { Business } from "../BusinessCard/BusinessCard";
import StaggerContainer, { staggerItemVariants } from "../Animations/StaggerContainer";
import MagneticButton from "../Animations/MagneticButton";
import { motion } from "framer-motion";

export default function BusinessRow({
  title,
  businesses,
  cta = "View All",
  href = "/all",
}: {
  title: string;
  businesses: Business[];
  cta?: string;
  href?: string;
}) {
  const router = useRouter();

  const handleSeeMore = () => {
    router.push(href);
  };
  return (
    <section className="pb-8 sm:pt-2 bg-gradient-to-b from-off-white to-off-white/95 relative" aria-label="businesses" data-section>
      {/* Subtle section decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-xl" />
      </div>
      
      <div className="container mx-auto max-w-[1300px] px-4 relative z-10">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="font-urbanist text-3 font-800 text-charcoal relative">
            {title}
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-sage to-coral rounded-full" />
          </h2>
          <MagneticButton
            onClick={handleSeeMore}
            className="group font-urbanist font-700 text-charcoal/70 transition-all duration-300 hover:text-sage text-base"
            strength={0.4}
          >
            <span className="transition-transform duration-300 group-hover:translate-x-[-1px]">
              See More...
            </span>
          </MagneticButton>
        </div>

        <div className="overflow-hidden">
          <StaggerContainer className="flex snap-x gap-6 overflow-x-auto pb-6 -mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth" staggerDelay={0.15}>
            {businesses.map((business) => (
              <motion.div key={business.id} variants={staggerItemVariants}>
                <BusinessCard business={business} />
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}