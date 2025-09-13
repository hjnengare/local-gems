interface EventBadgeProps {
  startDate: string;
  endDate?: string;
}

export default function EventBadge({ startDate, endDate }: EventBadgeProps) {
  return (
    <div className="absolute left-2 top-2 z-20">
      <div className="relative">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded-full blur-sm opacity-75"></div>
        
        {/* Main badge */}
        <span className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 backdrop-blur-sm px-5 py-2.5 text-white shadow-xl border border-amber-300/30">
          {/* Premium sparkle icon */}
          <svg className="w-5 h-5 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
          </svg>
          
          <span className="font-urbanist text-base font-700 tracking-wide drop-shadow-sm">
            {endDate ? `${startDate} - ${endDate}` : startDate}
          </span>
          
          {/* Premium shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
        </span>
      </div>
    </div>
  );
}