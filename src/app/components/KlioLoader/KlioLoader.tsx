"use client";

interface KlioLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* KLIO animated logo loader */}
      <div className={`relative flex items-center justify-center`} style={{
        width: size === 'sm' ? '48px' : size === 'md' ? '64px' : size === 'lg' ? '96px' : '128px',
        height: size === 'sm' ? '24px' : size === 'md' ? '32px' : size === 'lg' ? '48px' : '64px'
      }}>
        {/* Outer ring */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size]} rounded-full border-2 border-sage/20 animate-spin`}
             style={{ animationDuration: '2s' }} />

        {/* Inner ring */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-sage animate-spin`}
             style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />

        {/* KLIO animated text in center */}
        <div className={`font-urbanist font-800 text-sage ${
          size === 'sm' ? 'text-xs' :
          size === 'md' ? 'text-sm' :
          size === 'lg' ? 'text-base' : 'text-lg'
        } tracking-wide`}>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>K</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '100ms' }}>L</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '200ms' }}>I</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>O</span>
        </div>
      </div>

      {/* Loading text */}
      <p className={`font-urbanist font-500 text-charcoal/70 ${textSizeClasses[size]} animate-pulse`}>
        {text}
      </p>
    </div>
  );
}