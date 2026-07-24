import * as React from "react";
import { AppBadge } from "./AppBadge";
import { cn } from "@/lib/utils";

interface AppSectionHeaderProps {
  badge?: React.ReactNode;
  badgeIcon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function AppSectionHeader({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = "center",
  className,
}: AppSectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-2.5 sm:space-y-3",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {badge && (
        <AppBadge icon={badgeIcon} className={cn("w-fit mb-2.5 sm:mb-3", align === "center" && "mx-auto")}>
          {badge}
        </AppBadge>
      )}

      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-foreground leading-snug">
        {title}
      </h2>

      {subtitle && (
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
