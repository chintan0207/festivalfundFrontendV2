import * as React from "react";
import { AppCard } from "./AppCard";
import { cn } from "@/lib/utils";

interface AppCTASectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AppCTASection({
  title,
  description,
  children,
  className,
}: AppCTASectionProps) {
  return (
    <section className={cn("relative px-4 py-20 sm:px-6", className)}>
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/15 via-chart-2/15 to-transparent blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-5xl">
        <AppCard className="rounded-3xl border border-border/60 bg-background/60 p-8 text-center shadow-xl backdrop-blur-xl sm:p-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-muted-foreground">
              {description}
            </p>
          )}
          {children && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {children}
            </div>
          )}
        </AppCard>
      </div>
    </section>
  );
}
