import Image from 'next/image';
import { useState } from 'react';

interface ProfilePictureProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  badge?: "top" | "verified" | "local";
}

export default function ProfilePicture({
  src,
  alt,
  size = "md",
  badge
}: ProfilePictureProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const getSizeNumber = (size: keyof typeof sizeClasses): number => {
    const sizeMap = { sm: 40, md: 48, lg: 64 };
    return sizeMap[size];
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case "top":
        return "trophy";
      case "verified":
        return "checkmark-circle";
      case "local":
        return "location";
      default:
        return "";
    }
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case "top":
        return "text-amber-500";
      case "verified": 
        return "text-blue-500";
      case "local":
        return "text-sage";
      default:
        return "";
    }
  };

  // If no src provided or error occurred, show placeholder
  if (!src || imgError) {
    return (
      <div className="relative inline-block">
        <div className={`${sizeClasses[size]} rounded-full bg-sage/10 flex items-center justify-center border-2 border-white shadow-md`}>
          <ion-icon
            name="person-outline"
            class={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'} text-sage/70`}
          />
        </div>
        {badge && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
            <ion-icon
              name={getBadgeIcon(badge)}
              class={`text-[14px] ${getBadgeColor(badge)}`}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <Image
        src={src}
        alt={alt}
        width={getSizeNumber(size)}
        height={getSizeNumber(size)}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-md`}
        unoptimized={src.includes('dicebear.com')}
        onError={() => setImgError(true)}
      />
      
      {badge && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
          <ion-icon
            name={getBadgeIcon(badge)}
            class={`text-[14px] ${getBadgeColor(badge)}`}
          />
        </div>
      )}
    </div>
  );
}