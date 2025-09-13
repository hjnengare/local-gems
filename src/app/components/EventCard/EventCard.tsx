"use client";

import { Event } from "../../data/eventsData";
import EventBanner from "./EventBanner";
import EventContent from "./EventContent";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <li className="snap-start w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[280px]">
      <div className="bg-off-white rounded-[6px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group cursor-pointer h-[320px] flex flex-col">
        <EventBanner
          image={event.image}
          alt={event.alt}
          icon={event.icon}
          title={event.title}
          rating={event.rating}
          startDate={event.startDate}
          endDate={event.endDate}
        />
        
        <EventContent
          title={event.title}
          location={event.location}
          description={event.description}
          href={event.href}
        />
      </div>
    </li>
  );
}