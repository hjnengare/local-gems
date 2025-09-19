import Link from "next/link";

interface EventContentProps {
  title: string;
  location: string;
  description?: string;
  href?: string;
}

export default function EventContent({ title, location, description, href }: EventContentProps) {
  return (
    <div className="p-4 relative flex-1 flex flex-col justify-between">
      {/* Top content */}
      <div className="space-y-2">
        {/* Event title */}
        <h3 className="font-urbanist text-base font-600 text-charcoal transition-colors duration-200 md:group-hover:text-sage line-clamp-2">
          <Link href={href || "#"} className="md:hover:underline decoration-2 underline-offset-2">
            {title}
          </Link>
        </h3>

        {/* Location */}
        <p className="font-urbanist text-sm font-400 text-charcoal/70 transition-colors duration-200 md:group-hover:text-charcoal/80 line-clamp-1 flex items-center">
          <svg className="w-4 h-4 text-sage mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </p>
      </div>

      {/* Description - bottom aligned */}
      {description && (
        <p className="font-urbanist text-sm font-400 text-charcoal/60 line-clamp-3 mt-3">
          {description}
        </p>
      )}
    </div>
  );
}