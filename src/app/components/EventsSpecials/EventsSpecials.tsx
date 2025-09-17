"use client";

import { useRouter } from "next/navigation";
import EventCard from "../EventCard/EventCard";
import { Event } from "../../data/eventsData";
import StaggerContainer, { staggerItemVariants } from "../Animations/StaggerContainer";
import { motion } from "framer-motion";

export default function EventsSpecials({
  title = "Events & Specials",
  events,
  cta = "See More...",
  href = "/events",
}: {
  title?: string;
  events: Event[];
  cta?: string;
  href?: string;
}) {
  const router = useRouter();

  const handleSeeMore = () => {
    router.push(href);
  };

  return (
    <section className="bg-gradient-to-b from-off-white to-off-white/95 relative" aria-label="events and specials" data-section>
      {/* Subtle section decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-20 w-32 h-32 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-sage/8 to-transparent rounded-full blur-xl" />
      </div>
      
      <div className="container mx-auto max-w-[1300px] px-4 relative z-10 pt-16 pb-8">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="font-urbanist text-xl font-800 text-charcoal relative">
            {title}
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-sage to-coral rounded-full" />
          </h2>
          <button
            onClick={handleSeeMore}
            className="group font-urbanist font-700 text-charcoal/70 transition-all duration-300 hover:text-sage text-base"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-[-1px]">
              {cta}
            </span>
          </button>
        </div>

        <div className="overflow-hidden">
          <StaggerContainer className="horizontal-scroll flex snap-x gap-6 overflow-x-auto pb-6" staggerDelay={0.2}>
            {events.map((event) => (
              <motion.div key={event.id} variants={staggerItemVariants}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}