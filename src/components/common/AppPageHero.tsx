import * as React from "react";
import { AppBadge } from "./AppBadge";
import { cn } from "@/lib/utils";

interface AppPageHeroProps {
  badge?: React.ReactNode;
  badgeIcon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AppPageHero({
  badge,
  badgeIcon,
  title,
  description,
  actions,
  children,
  className,
}: AppPageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 md:pt-32", className)}>
      <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 via-chart-2/10 to-transparent blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {badge && (
            <AppBadge icon={badgeIcon} className="mb-5 mx-auto w-fit">
              {badge}
            </AppBadge>
          )}

          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            {title}
          </h1>

          {description && (
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {actions && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {actions}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
