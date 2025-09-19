"use client";

type IonProps = {
  name: string;
  label?: string;          // for screen readers; if omitted, we set aria-hidden
  className?: string;      // Tailwind (size/color)
  size?: "small" | "large"; // optional Ionicons preset
};

export function Ion({ name, label, className = "", size }: IonProps) {
  return (
    <ion-icon
      name={name}
      size={size}
      class={className}                // NOTE: web component uses `class`, not `className` internally; React maps it fine
      aria-label={label}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
    />
  );
}