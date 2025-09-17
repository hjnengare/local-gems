"use client";

import { useState } from "react";
import Image from "next/image";

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  fallbackType?: "profile" | "business";
  priority?: boolean;
}

export default function FallbackImage({
  src,
  alt,
  className = "",
  fill = false,
  width,
  height,
  sizes,
  fallbackType = "business",
  priority = false,
  ...props
}: FallbackImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div className={`bg-gradient-to-br from-sage/10 to-coral/10 flex items-center justify-center ${className}`}>
        {fallbackType === "profile" ? (
          <ion-icon
            name="person-outline"
            class="text-charcoal/40"
            style={{ fontSize: fill ? "2rem" : "1.5rem" }}
          />
        ) : (
          <ion-icon
            name="image-outline"
            class="text-charcoal/40"
            style={{ fontSize: fill ? "2.5rem" : "2rem" }}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-br from-sage/5 to-coral/5 animate-pulse ${className}`} />
      )}
      <Image
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}