import { type ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradientColorNames } from "@/theme/colors";

export type KPIAccentColor =
  | "emerald"
  | "blue"
  | "indigo"
  | "amber"
  | "rose"
  | "purple"
  | "violet"
  | "cyan";

export interface KPICardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  sparkData?: number[];
  accent?: KPIAccentColor;
  gradient?: string;
  subtext?: string;
  className?: string;
}

const ACCENT_STYLES: Record<KPIAccentColor, { gradient: string; spark: string }> = {
  emerald: {
    gradient: gradientColorNames.greenToEmerald,
    spark: "#10b981",
  },
  blue: {
    gradient: gradientColorNames.skyToBlue,
    spark: "#3b82f6",
  },
  indigo: {
    gradient: gradientColorNames.violetToPurple,
    spark: "#6366f1",
  },
  amber: {
    gradient: gradientColorNames.amberToYellow,
    spark: "#f59e0b",
  },
  rose: {
    gradient: gradientColorNames.pinkToRose,
    spark: "#f43f5e",
  },
  purple: {
    gradient: gradientColorNames.violetToPurple,
    spark: "#8b5cf6",
  },
  violet: {
    gradient: gradientColorNames.violetToFuchsia,
    spark: "#8b5cf6",
  },
  cyan: {
    gradient: gradientColorNames.skyToBlue,
    spark: "#06b6d4",
  },
};

export function KPICard({
  label,
  value,
  change,
  changeType = "positive",
  icon,
  sparkData,
  accent = "emerald",
  gradient,
  subtext,
  className,
}: KPICardProps) {
  const style = ACCENT_STYLES[accent] || ACCENT_STYLES.emerald;

  const isPositive =
    changeType === "positive" || (change && change.startsWith("+"));
  const isNegative =
    changeType === "negative" || (change && change.startsWith("-"));

  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-card border border-border/70 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between relative overflow-hidden",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground min-w-0 break-words tabular-nums">
            {value}
          </p>
        </div>

        {icon && (
          <div
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0",
              gradient ?? style.gradient
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 mt-1">
        {change ? (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "text-[11px] font-medium inline-flex items-center gap-0.5",
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : isNegative
                    ? "text-rose-500 dark:text-rose-400"
                    : "text-muted-foreground"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : isNegative ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              <span>{change}</span>
            </span>
          </div>
        ) : subtext ? (
          <span className="text-[10px] text-muted-foreground/80 line-clamp-1">{subtext}</span>
        ) : <div />}

        {sparkData && sparkData.length > 1 && (
          <div className="w-14 h-6 flex items-end ml-auto shrink-0">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
              {(() => {
                const max = Math.max(...sparkData, 1);
                const min = Math.min(...sparkData, 0);
                const range = max - min || 1;
                const pts = sparkData.map((v, i) => ({
                  x: (i / (sparkData.length - 1)) * 60,
                  y: 18 - ((v - min) / range) * 16,
                }));
                const d = pts
                  .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                  .join(" ");
                return (
                  <path
                    d={d}
                    fill="none"
                    stroke={style.spark}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })()}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export interface KPIGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

export function KPIGrid({ children, columns = 4, className }: KPIGridProps) {
  const colStyles = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  };

  return (
    <div className={cn("grid gap-3 sm:gap-4", colStyles[columns], className)}>
      {children}
    </div>
  );
}
