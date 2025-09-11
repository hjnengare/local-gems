import Link from "next/link";
import BusinessCard, { Business } from "../BusinessCard/BusinessCard";

export default function BusinessRow({
  title,
  businesses,
  cta = "View All",
  href = "#",
}: {
  title: string;
  businesses: Business[];
  cta?: string;
  href?: string;
}) {
  return (
    <section className="py-[60px] bg-gradient-to-b from-off-white to-off-white/95 relative" aria-label="businesses" data-section>
      {/* Subtle section decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-xl" />
      </div>
      
      <div className="container mx-auto max-w-[1300px] px-4 relative z-10">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="font-urbanist text-3 font-800 text-charcoal relative">
            {title}
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-sage to-coral rounded-full" />
          </h2>
          <Link href={href} className="group flex items-center gap-2 font-urbanist font-600 text-charcoal transition-all duration-200 hover:text-sage bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-white/40">
            <span className="transition-transform duration-200 group-hover:translate-x-[-2px]">{cta}</span>
            <ion-icon name="arrow-forward" class="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="flex snap-x gap-6 overflow-x-auto pb-6 -mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
          {businesses.map((business, index) => (
            <div key={business.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <BusinessCard business={business} />
            </div>
          ))}
        </ul>
      </div>
    </section>
  );
}