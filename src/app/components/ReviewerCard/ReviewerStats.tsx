interface ReviewerStatsProps {
  reviewCount: number;
  rating: number;
  location: string;
}

export default function ReviewerStats({ reviewCount, rating, location }: ReviewerStatsProps) {
  return (
    <div className="text-sm text-charcoal/70 space-y-1">
      <div className="flex items-center gap-2">
        <ion-icon name="star" class="text-coral text-sm" />
        <span className="font-urbanist font-600">{rating.toFixed(1)}</span>
        <span className="font-urbanist">• {reviewCount} reviews</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <ion-icon name="location-outline" class="text-sage text-sm" />
        <span className="font-urbanist">{location}</span>
      </div>
    </div>
  );
}