interface EventBadgeProps {
  startDate: string;
  endDate?: string;
}

export default function EventBadge({ startDate, endDate }: EventBadgeProps) {
  return (
    <div className="absolute left-2 top-2 z-20">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-charcoal shadow-lg ring-1 ring-charcoal/10">
        <div className="w-2 h-2 bg-coral rounded-full"></div>
        <span className="font-urbanist text-sm font-600">
          {endDate ? `${startDate} - ${endDate}` : startDate}
        </span>
      </span>
    </div>
  );
}