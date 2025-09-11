export default function VerifiedBadge() {
  return (
    <div className="absolute left-3 top-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/80 backdrop-blur-sm">
      <ion-icon name="checkmark" class="text-white text-sm drop-shadow-sm" />
    </div>
  );
}