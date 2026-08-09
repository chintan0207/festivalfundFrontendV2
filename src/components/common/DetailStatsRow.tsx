import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DetailStat {
  label: string;
  /** Shorter label shown on mobile (falls back to `label`). */
  labelSm?: string;
  value: ReactNode;
}

export interface DetailStatsRowProps {
  stats: DetailStat[];
  valueClassName?: string;
  className?: string;
}

export function DetailStatsRow({
  stats,
  valueClassName,
  className,
}: DetailStatsRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/60 border-t border-border/60",
        className,
      )}
    >
      {stats.map((stat) => (
        <DetailStatView key={stat.label} {...stat} valueClassName={valueClassName} />
      ))}
    </div>
  );
}

function DetailStatView({
  label,
  labelSm,
  value,
  valueClassName,
}: DetailStat & { valueClassName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-2.5 sm:py-3 px-1.5 sm:px-2 text-center">
      <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">
        {labelSm ? (
          <>
            <span className="sm:hidden">{labelSm}</span>
            <span className="hidden sm:inline">{label}</span>
          </>
        ) : (
          label
        )}
      </span>
      <span
        className={cn(
          "text-xs sm:text-sm font-bold text-foreground mt-0.5",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}