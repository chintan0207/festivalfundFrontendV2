import * as React from "react";
import { cn } from "@/lib/utils";
import { gradientColors } from "@/theme/colors";

interface AppIconBadgeProps {
  icon: React.ReactNode;
  colorIndex?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AppIconBadge({
  icon,
  colorIndex = 0,
  size = "md",
  className,
}: AppIconBadgeProps) {
  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg text-sm",
    md: "h-10 w-10 rounded-xl text-base",
    lg: "h-12 w-12 rounded-2xl text-lg",
  };

  const gradientClass = gradientColors[colorIndex % gradientColors.length];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center text-white shadow-sm font-semibold",
        sizeClasses[size],
        gradientClass,
        className
      )}
    >
      {icon}
    </div>
  );
}
