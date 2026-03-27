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
        "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium",
        "bg-muted text-foreground",
        className,
      )}
    >
      {icon}
      {children}
    </div>
  );
}
