import Image from "next/image";
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
          <Image
            src={image}
            alt={alt || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 md:group-hover:scale-105 rounded-t-[6px]"
            priority={false}
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
          {/* Silver shimmer effect on hover */}
          <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 md:group-hover:left-full transition-transform duration-700 ease-out" />
        </>
      ) : (
        <div className="h-full w-full bg-sage/10 flex items-center justify-center text-sage rounded-t-[6px]">
          <ion-icon
            name="image-outline"
            class="text-4xl md:text-5xl text-sage/70"
          />
        </div>
      )}

      <EventBadge startDate={startDate} endDate={endDate} />
      <RatingBadge rating={rating} />
    </div>
  );
}