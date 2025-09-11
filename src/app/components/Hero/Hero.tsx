import { ReactNode } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  backgroundImage?: string;
  variant?: 'default' | 'onboarding' | 'simple';
  textAlign?: 'left' | 'center';
}

export default function Hero({
  title,
  subtitle,
  children,
  backgroundImage,
  variant = 'default',
  textAlign = 'center'
}: HeroProps) {
  const heroStyle = backgroundImage 
    ? { 
        backgroundImage: `linear-gradient(hsla(0, 0%, 0%, 0.5), hsla(0, 0%, 0%, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : {};

  const variantClasses = {
    default: 'min-h-screen',
    onboarding: 'min-h-[80vh]',
    simple: 'py-section'
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center'
  };

  return (
    <section 
      className={`
        flex items-center justify-center bg-cultured-2 relative
        ${variantClasses[variant]}
        ${alignmentClasses[textAlign]}
      `}
      style={heroStyle}
    >
      <div className="max-w-4xl mx-auto px-4 z-10 relative">
        <div className="space-y-6">
          <h1 className={`
            font-urbanist font-700 
            ${variant === 'onboarding' ? 'text-3 text-black' : 'text-2 text-white'}
          `}>
            {title}
          </h1>
          {subtitle && (
            <p className={`
              font-urbanist text-6 font-400
              ${variant === 'onboarding' ? 'text-gray-web' : 'text-white opacity-90'}
            `}>
              {subtitle}
            </p>
          )}
          {children && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {children}
            </div>
          )}
        </div>
      </div>
      {backgroundImage && (
        <div className="absolute inset-0 bg-black-50"></div>
      )}
    </section>
  );
}