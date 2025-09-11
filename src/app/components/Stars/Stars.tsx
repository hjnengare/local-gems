export default function Stars({ value = 5 }: { value?: number }) {
  const full = Math.max(0, Math.min(5, Math.floor(value)));
  return (
    <div className="flex items-center gap-[2px] text-[15px] text-coral">
      {[...Array(5)].map((_, i) => (
        <ion-icon key={i} name={i < full ? "star" : "star-outline"} />
      ))}
    </div>
  );
}