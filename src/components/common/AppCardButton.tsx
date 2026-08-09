import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AppCardButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  /** Non-interactive (no click handler). */
  disabled?: boolean;
}

/** Clickable content-card base with a single source for hover/focus styling. */
export function AppCardButton({
  children,
  onClick,
  className,
  disabled,
}: AppCardButtonProps) {
  const interactive = !!onClick && !disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      className={cn(
        "rounded-2xl bg-card border border-border/80 shadow-xs p-4 text-left transition-all text-xs",
        interactive
          ? "hover:shadow-md cursor-pointer hover:border-indigo-500/40 disabled:opacity-60"
          : "cursor-default",
        className,
      )}
    >
      {children}
    </button>
  );
}