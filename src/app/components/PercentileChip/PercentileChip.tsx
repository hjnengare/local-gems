export default function PercentileChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1 rounded-3 bg-gradient-to-r from-cultured-2 to-cultured-1 px-3 py-1.5 shadow-sm border border-white/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:scale-105">
      <span className="font-urbanist text-9 font-600 text-charcoal/80">{label}</span>
      <span className="font-urbanist text-9 font-700 text-sage">{value}</span>
    </div>
  );
}