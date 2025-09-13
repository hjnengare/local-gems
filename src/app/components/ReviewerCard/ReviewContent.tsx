interface ReviewContentProps {
  businessName: string;
  businessType: string;
  rating: number;
  reviewText: string;
  date: string;
  likes: number;
  images?: string[];
}

export default function ReviewContent({ 
  businessName, 
  businessType, 
  rating, 
  reviewText, 
  date, 
  likes, 
  images 
}: ReviewContentProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ion-icon
        key={i}
        name={i < rating ? "star" : "star-outline"}
        class={`text-sm ${i < rating ? "text-coral" : "text-charcoal/30"}`}
      />
    ));
  };

  return (
    <div className="flex-1">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-urbanist font-700 text-charcoal">{businessName}</h4>
          <span className="text-xs text-charcoal/50 font-urbanist">{date}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(rating)}</div>
          <span className="text-xs text-charcoal/60 font-urbanist">• {businessType}</span>
        </div>
      </div>

      <p className="font-urbanist text-sm text-charcoal/80 leading-relaxed mb-3 line-clamp-3">
        {reviewText}
      </p>

      {images && images.length > 0 && (
        <div className="mb-3">
          <img
            src={images[0]}
            alt="Review image"
            className="w-full h-24 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex items-center gap-1 text-charcoal/60">
        <ion-icon name="heart-outline" class="text-sm" />
        <span className="text-xs font-urbanist">{likes}</span>
      </div>
    </div>
  );
}