import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface AppBadgeProps extends React.ComponentProps<typeof Badge> {
  size?: "xs" | "sm" | "md" | "lg";
  icon?: React.ReactNode;
  dot?: boolean;
  dotColor?: string;
}

const sizeClasses: Record<"xs" | "sm" | "md" | "lg", string> = {
  xs: "text-[10px] px-2 py-0.2 rounded-full gap-1 [&>svg]:size-2.5",
  sm: "text-xs px-2.5 py-0.5 rounded-full gap-1.5 [&>svg]:size-3",
  md: "text-xs sm:text-sm px-3 py-1 rounded-full gap-2 [&>svg]:size-3.5",
  lg: "text-sm px-4 py-1.5 rounded-full gap-2 [&>svg]:size-4",
};

export function AppBadge({
  children,
  icon,
  dot,
  dotColor = "bg-primary",
  size = "sm",
  variant = "outline",
  className,
  ...props
}: AppBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        "font-semibold transition-all duration-200 shadow-2xs",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0 animate-pulse",
            dotColor
          )}
        />
      )}
      {icon}
      {children}
    </Badge>
  );
}
