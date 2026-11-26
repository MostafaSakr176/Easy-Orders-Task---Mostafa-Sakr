import type { ReactNode } from "react";

interface IconButtonProps {
  children: ReactNode;
  label: string;
  onClick: () => void;
  pressed?: boolean;
  compact?: boolean;
}

export function IconButton({ children, label, onClick, pressed, compact = false }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`grid place-items-center rounded-lg bg-[#f2f2f2] ${compact ? "size-10" : "size-[52px]"}`}
    >
      {children}
    </button>
  );
}
