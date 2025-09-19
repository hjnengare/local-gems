"use client";

interface KlioLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function KlioLoader({
  size = 'md',
  className = '',
  text = 'Loading...'
}: KlioLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* KLIO animated logo loader */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} absolute rounded-full border-2 border-sage/20 animate-spin`}
             style={{ animationDuration: '2s' }} />

        {/* Inner ring */}
        <div className={`${sizeClasses[size]} absolute rounded-full border-2 border-transparent border-t-sage animate-spin`}
             style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />

        {/* KLIO K letter in center */}
        <div className={`font-urbanist font-800 text-sage ${
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        } animate-pulse`}>
          K
        </div>
      </div>

      {/* Loading text */}
      <p className={`font-urbanist font-500 text-charcoal/70 ${textSizeClasses[size]} animate-pulse`}>
        {text}
      </p>
    </div>
  );
}