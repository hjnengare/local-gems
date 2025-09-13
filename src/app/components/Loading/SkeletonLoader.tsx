"use client";

interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
  width?: string | number;
  height?: string | number;
  animation?: boolean;
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width = "100%",
  height = "1rem",
  animation = true,
}: SkeletonProps) {
  const baseClasses = `bg-gray-200 ${animation ? "animate-pulse" : ""}`;

  const variantClasses = {
    rectangular: "rounded-md",
    circular: "rounded-full",
    text: "rounded-sm",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Business card skeleton component
export function BusinessCardSkeleton() {
  return (
    <div className="bg-off-white rounded-[6px] overflow-hidden shadow-sm">
      <div className="relative">
        <Skeleton height="320px" className="rounded-t-[6px]" />
      </div>
      <div className="p-5">
        <Skeleton height="1.5rem" width="80%" className="mb-2" />
        <Skeleton height="1rem" width="60%" className="mb-3" />
        <div className="flex items-center gap-2 mb-4">
          <Skeleton height="1rem" width="100px" />
          <Skeleton height="1rem" width="80px" />
        </div>
        <div className="flex gap-2">
          <Skeleton height="1.5rem" width="60px" />
          <Skeleton height="1.5rem" width="60px" />
          <Skeleton height="1.5rem" width="60px" />
        </div>
      </div>
    </div>
  );
}

// Business row skeleton component
export function BusinessRowSkeleton() {
  return (
    <div className="px-4 sm:px-6 md:px-8 mb-8 md:mb-16">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Skeleton height="2rem" width="200px" />
          <Skeleton height="1.5rem" width="120px" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[300px]">
              <BusinessCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}