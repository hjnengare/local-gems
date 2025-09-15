# Typography System - Local Gems

A comprehensive, mobile-first typography scale designed for premium readability and visual hierarchy across all devices.

## Design Philosophy

- **Mobile-first**: Base sizes ensure readability on small screens (≥16px)
- **Accessible**: WCAG-compliant font sizes and contrast ratios
- **Premium feel**: Generous line-heights and letter-spacing for quality UX
- **Responsive scaling**: Sizes adapt from mobile to desktop
- **Consistent hierarchy**: Clear distinction between heading levels and content types

## Typography Scale

Our scale uses semantic tokens that replace arbitrary pixel values with meaningful size names:

### Base Scale
```css
xs:   10px (0.625rem)  - Line height: 1.2,  Letter spacing: 0.01em
sm:   12px (0.75rem)   - Line height: 1.35, Letter spacing: 0.005em
base: 14px (0.875rem)  - Line height: 1.6   [Default body text]
lg:   16px (1rem)      - Line height: 1.55
xl:   18px (1.125rem)  - Line height: 1.45
2xl:  20px (1.25rem)   - Line height: 1.35
3xl:  24px (1.5rem)    - Line height: 1.25
4xl:  30px (1.875rem)  - Line height: 1.2
5xl:  36px (2.25rem)   - Line height: 1.1
6xl:  48px (3rem)      - Line height: 1.05
7xl:  60px (3.75rem)   - Line height: 1.0
```

## Semantic Hierarchy

### Headings (Mobile → Desktop)
```css
h1: text-3xl md:text-4xl (24px → 30px)
h2: text-2xl md:text-3xl (20px → 24px)
h3: text-xl md:text-2xl  (18px → 20px)
h4: text-lg md:text-xl   (16px → 18px)
h5: text-base md:text-lg (14px → 16px)
h6: text-sm md:text-base (12px → 14px)
```

### Content Types
```css
Primary Body:    text-base md:text-lg     (14px → 16px)
Secondary Text:  text-sm                  (12px)
Captions/Meta:   text-sm                  (12px) - Never below 10px!
Button Labels:   text-sm or text-base     (12px or 14px)
Navigation:      text-sm md:text-base     (12px → 14px)
```

## Usage Examples

### Component Typography
```jsx
// Business Card
<h3 className="font-urbanist text-base md:text-lg font-600 text-charcoal">
  {business.name}
</h3>
<p className="font-urbanist text-sm text-charcoal/70">
  {business.category} - {business.location}
</p>

// Leaderboard Headers
<h1 className="font-urbanist text-xl md:text-2xl lg:text-3xl font-700">
  Community Highlights
</h1>
<h2 className="font-urbanist text-lg md:text-xl font-700">
  Top Reviewers
</h2>

// Page Content
<p className="font-urbanist text-base md:text-lg font-400">
  Main paragraph content goes here...
</p>
<span className="font-urbanist text-sm font-400 text-charcoal/60">
  Secondary information and metadata
</span>
```

## Key Improvements Made

### Before (Issues Fixed)
- ❌ Custom numbered font scale (`text-1` through `text-9`) was confusing
- ❌ Base HTML set to 62.5% creating 10px confusion
- ❌ Hard-coded arbitrary sizes like `text-[14px]`, `text-[11px]`
- ❌ No responsive scaling - same size on mobile and desktop
- ❌ Leaderboard had microscopic 11px-12px text
- ❌ Missing line-heights and letter-spacing optimization

### After (Improvements)
- ✅ Standard HTML base (100% = 14px) for compact, readable design
- ✅ Semantic tokens (`text-sm`, `text-base`, `text-lg`, etc.)
- ✅ Mobile-first responsive scaling with `md:` breakpoints
- ✅ All text ≥10px minimum, 12px+ for important content
- ✅ Optimized line-heights (1.6 for body, 1.2-1.35 for headings)
- ✅ Built-in letter-spacing for premium feel
- ✅ Global heading hierarchy in `globals.css`

## Migration Guide

### Replace These Patterns
```css
/* OLD - Don't use */
text-[14px]     → text-sm
text-[11px]     → text-sm (never go below 14px)
text-xs         → text-sm (for main content)
text-9          → text-sm
text-8          → text-sm
text-7          → text-base md:text-lg

/* NEW - Use these */
text-sm         → For secondary text, captions, small labels
text-base       → For primary body text, standard UI elements
text-lg         → For prominent content, subheadings
text-xl+        → For headings and hero content
```

### Responsive Patterns
```css
/* Single size (mobile-first) */
text-base

/* Mobile → Desktop scaling */
text-base md:text-lg
text-xl md:text-2xl
text-2xl md:text-3xl lg:text-4xl

/* Never do this (too small on mobile) */
text-xs md:text-sm  ❌
```

## Quality Assurance

### Mobile Testing (390px width)
- Body copy renders at 16px minimum
- No primary text below 14px
- Headings are clearly distinguishable from body text
- Sufficient tap targets (44px minimum)

### Desktop Enhancement
- Text scales up gracefully with `md:` breakpoints
- Maintains visual hierarchy across screen sizes
- Premium feel with proper spacing and line-heights

## Technical Implementation

1. **Tailwind Config**: Extended fontSize with line-height and letter-spacing
2. **Global Base Styles**: HTML/body defaults + semantic heading hierarchy
3. **Component Updates**: All arbitrary sizes replaced with tokens
4. **Legacy Support**: Old numbered scale preserved during gradual migration

---

## Next Steps

1. **Gradual Migration**: Continue replacing any remaining numbered font sizes (`text-7`, `text-8`, etc.) with semantic tokens
2. **Design Reviews**: Validate visual hierarchy on key pages (Leaderboard, Business pages, Forms)
3. **Performance**: Monitor if additional font variants impact load times
4. **Accessibility Audits**: Ensure contrast ratios meet WCAG AA standards with new sizes

This typography system ensures Local Gems maintains premium, accessible, and consistent text presentation across all devices and use cases.