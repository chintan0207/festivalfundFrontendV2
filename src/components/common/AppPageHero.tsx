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
  containerClassName?: string;
}

export function AppPageHero({
  badge,
  badgeIcon,
  title,
  description,
  actions,
  children,
  className,
  containerClassName,
}: AppPageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden px-3.5 pb-10 -mt-16 pt-22 sm:px-6 sm:pb-12 sm:pt-26 md:pt-28", className)}>
      {/* Seamless Ambient Background Glow extending all the way up behind transparent Navbar */}
      <div className="absolute left-1/2 -top-20 h-[900px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/16 via-chart-2/8 to-transparent blur-3xl pointer-events-none" />
      
      {/* Background Dot Pattern for Texture */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.4) 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />

      <div className={cn("relative mx-auto max-w-7xl space-y-8 sm:space-y-12", containerClassName)}>
        <div className="mx-auto max-w-3xl text-center">
          {badge && (
            <AppBadge icon={badgeIcon} className="mb-4 sm:mb-5 mx-auto w-fit max-w-full truncate">
              {badge}
            </AppBadge>
          )}

          <h1 className="text-3xl font-extrabold leading-[1.18] tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            {title}
          </h1>

          {description && (
            <p className="mx-auto mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {actions && (
            <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row w-full max-w-md sm:max-w-none mx-auto">
              {actions}
            </div>
          )}
        </div>

        {/* Seamlessly connected child content inside the ambient hero background */}
        {children && <div className="relative z-10">{children}</div>}
      </div>
    </section>
  );
}
