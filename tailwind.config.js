/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors
        'sage': 'hsl(148, 20%, 38%)',
        'coral': 'hsl(16, 100%, 66%)',
        'charcoal': 'hsl(0, 0%, 25%)',
        'off-white': 'hsl(0, 0%, 98%)',
        
        // Instagram blue for verified badge
        'blue-500': '#3b82f6',
        
        // Legacy colors (for compatibility)
        'hoockers-green': 'hsl(148, 20%, 38%)',
        'hoockers-green-20': 'hsl(148, 20%, 38%, 0.2)',
        'pale-spring-bud': 'hsl(60, 68%, 85%)',
        'spanish-gray': 'hsl(0, 0%, 61%)',
        'light-gray': 'hsl(0, 0%, 80%)',
        'cultured-1': 'hsl(0, 0%, 97%)',
        'cultured-2': 'hsl(60, 6%, 93%)',
        'gray-web': 'hsl(0, 0%, 49%)',
        'white-30': 'hsl(0, 0%, 100%, 0.3)',
        'black-70': 'hsla(0, 0%, 0%, 0.7)',
        'black-50': 'hsla(0, 0%, 0%, 0.5)',
        'black-15': 'hsla(0, 0%, 0%, 0.15)',
        'black-10': 'hsla(0, 0%, 0%, 0.1)',
        'black-5': 'hsla(0, 0%, 0%, 0.05)',
        black: 'hsl(0, 0%, 0%)',
        white: 'hsl(0, 0%, 100%)',
      },
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
      },
      fontSize: {
        // Legacy numbered scale (for gradual migration)
        1: '4.8rem',
        2: '4rem',
        3: '3.4rem',
        4: '2.4rem',
        5: '2rem',
        6: '1.8rem',
        7: '1.5rem',
        8: '1.4rem',
        9: '1.3rem',

        // Mobile-first responsive typography scale
        // [fontSize, { lineHeight, letterSpacing }]
        xs: ['0.625rem', { lineHeight: '1.2', letterSpacing: '0.01em' }],   // 10px
        sm: ['0.75rem', { lineHeight: '1.35', letterSpacing: '0.005em' }],  // 12px
        base: ['0.875rem', { lineHeight: '1.6' }],                          // 14px
        lg: ['1rem', { lineHeight: '1.55' }],                               // 16px
        xl: ['1.125rem', { lineHeight: '1.45' }],                           // 18px
        '2xl': ['1.25rem', { lineHeight: '1.35' }],                         // 20px
        '3xl': ['1.5rem', { lineHeight: '1.25' }],                          // 24px
        '4xl': ['1.875rem', { lineHeight: '1.2' }],                         // 30px
        '5xl': ['2.25rem', { lineHeight: '1.1' }],                          // 36px
        '6xl': ['3rem', { lineHeight: '1.05' }],                            // 48px
        '7xl': ['3.75rem', { lineHeight: '1' }],                            // 60px
      },
      fontWeight: {
        400: '400',
        500: '500',
        600: '600',
        700: '700',
        800: '800',
      },
      spacing: {
        section: '35px',
      },
      boxShadow: {
        1: '0 8px 16px hsla(0, 0%, 0%, 0.15)',
        2: '0 4px 10px hsla(0, 0%, 0%, 0.05)',
      },
      borderRadius: {
        3: '3px',
        6: '6px',
      },
      transitionTimingFunction: {
        'cubic-in': 'cubic-bezier(0.51, 0.03, 0.64, 0.28)',
        'cubic-out': 'cubic-bezier(0.33, 0.85, 0.4, 0.96)',
      },
      transitionDuration: {
        1: '250ms',
        2: '500ms',
      },
      backgroundImage: {
        gradient: 'linear-gradient(to right, transparent 50%, hsla(0, 0%, 100%, 0.3) 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}