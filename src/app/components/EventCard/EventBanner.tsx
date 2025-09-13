import EventIcon from "./EventIcon";
import EventBadge from "./EventBadge";
import RatingBadge from "./RatingBadge";

interface EventBannerProps {
  image?: string;
  alt?: string;
  icon?: string;
  title: string;
  rating: number;
  startDate: string;
  endDate?: string;
}

export default function EventBanner({ 
  image, 
  alt, 
  icon, 
  title, 
  rating, 
  startDate, 
  endDate 
}: EventBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-t-[6px] h-[180px] flex-shrink-0">
      {/* Image or Icon placeholder */}
      {image ? (
        <>
          <img 
            src={image} 
            alt={alt || title} 
            loading="lazy" 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-[6px]" 
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Silver shimmer effect on hover */}
          <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 group-hover:left-full transition-transform duration-700 ease-out" />
        </>
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-sage/20 to-coral/10 flex items-center justify-center group-hover:from-sage/30 group-hover:to-coral/20 transition-all duration-300">
          <EventIcon iconName={icon} />
        </div>
      )}

      <EventBadge startDate={startDate} endDate={endDate} />
      <RatingBadge rating={rating} />
    </div>
  );
}