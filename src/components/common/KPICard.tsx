import { type ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type KPIAccentColor =
  | "emerald"
  | "blue"
  | "indigo"
  | "amber"
  | "rose"
  | "purple"
  | "cyan";

export interface KPICardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  sparkData?: number[];
  accent?: KPIAccentColor;
  subtext?: string;
  className?: string;
}

const ACCENT_STYLES: Record<
  KPIAccentColor,
  { bg: string; text: string; border: string; spark: string }
> = {
  emerald: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
    spark: "#10b981",
  },
  blue: {
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
    spark: "#3b82f6",
  },
  indigo: {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/15",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/20",
    spark: "#6366f1",
  },
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
    spark: "#f59e0b",
  },
  rose: {
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/20",
    spark: "#f43f5e",
  },
  purple: {
    bg: "bg-purple-500/10 dark:bg-purple-500/15",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/20",
    spark: "#8b5cf6",
  },
  cyan: {
    bg: "bg-cyan-500/10 dark:bg-cyan-500/15",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/20",
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
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>

        {icon && (
          <div
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center border shrink-0 transition-colors",
              style.bg,
              style.text,
              style.border
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
  columns?: 2 | 3 | 4;
  className?: string;
}

export function KPIGrid({ children, columns = 4, className }: KPIGridProps) {
  const colStyles = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-3 sm:gap-4", colStyles[columns], className)}>
      {children}
    </div>
  );
}
