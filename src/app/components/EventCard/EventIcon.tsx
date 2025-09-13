interface EventIconProps {
  iconName?: string;
  className?: string;
}

export default function EventIcon({ iconName, className = "w-16 h-16 text-sage drop-shadow-sm" }: EventIconProps) {
  const getIonIcon = (name: string) => {
    switch (name) {
      case "paint-brush-outline":
        return "brush-outline";
      case "pizza-outline":
        return "pizza-outline";
      case "cut-outline":
        return "cut-outline";
      case "musical-notes-outline":
        return "musical-notes-outline";
      case "wine-outline":
        return "wine-outline";
      case "body-outline":
        return "fitness-outline";
      default:
        return "calendar-outline";
    }
  };

  return (
    <ion-icon
      name={getIonIcon(iconName || "")}
      class={className}
    />
  );
}