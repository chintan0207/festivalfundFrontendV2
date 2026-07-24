import * as React from "react";
import { cn } from "@/lib/utils";

interface AppBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function AppBadge({ children, icon, className }: AppBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs sm:text-sm font-semibold tracking-wide border border-border/50",
        "bg-muted/80 text-foreground backdrop-blur-sm",
        className
      )}
    >
      {icon}
      {children}
    </div>
  );
}
