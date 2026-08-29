import { useMemo, useState, type ReactNode } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { chartPalette } from "@/theme/colors";

export interface GroupedBarRow {
  date: string;
  income: number;
  expense: number;
}

type GroupMode = "day" | "week" | "month";

const GROUP_MODES: { key: GroupMode; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
];

const DAY_MS = 86400000;

function fmtINR(value: number): string {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function fmtINRCompact(value: number): string {
  return `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0))}`;
}

function parseISODate(iso?: string): Date {
  if (!iso || typeof iso !== "string") return new Date();
  const parts = iso.split("-").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) {
    const parsed = new Date(iso);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }
  const [y, m, d] = parts;
  return new Date(Date.UTC(y, m - 1, d));
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function shortDate(d: Date, withYear: boolean): string {
  const date = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    ...(withYear ? { year: "numeric" as const } : {}),
  });
  return date.replace(/\s+/g, " ");
}

export interface GroupedBarChartProps {
  rows: GroupedBarRow[];
  openingBalance?: number;
  title: string;
  subtitle?: string;
  trendChips?: ReactNode;
  height?: number;
  emptyText?: string;
  onModeChange?: (mode: GroupMode) => void;
  /** Optional compact strip rendered below the chart (e.g. period totals). */
  summary?: ReactNode;
}

/** Grouped "Contributions vs Expenses" bar chart with optional subtle balance line.
 *  Reused by the dashboard and the reports analytics tab. */
export function GroupedBarChart({
  rows,
  openingBalance,
  title,
  subtitle,
  trendChips,
  height = 280,
  emptyText = "No income or expense activity yet for this festival.",
  onModeChange,
  summary,
}: GroupedBarChartProps) {
  const [mode, setMode] = useState<GroupMode>("day");

  const changeMode = (next: GroupMode) => {
    setMode(next);
    onModeChange?.(next);
  };

  const hasBalance = openingBalance != null;

  const points = useMemo(() => {
    if (!rows || !Array.isArray(rows) || rows.length === 0) return [];

    const validRows = rows.filter((r) => r && typeof r.date === "string" && r.date.trim().length > 0);
    if (validRows.length === 0) return [];

    const sorted = [...validRows].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const buckets = new Map<
      string,
      { label: string; fullLabel: string; income: number; expense: number }
    >();

    sorted.forEach((r) => {
      const d = parseISODate(r.date);
      let key: string;
      let label: string;
      let fullLabel: string;

      if (mode === "day") {
        key = r.date;
        label = shortDate(d, false);
        fullLabel = d.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } else if (mode === "week") {
        const dow = (d.getUTCDay() + 6) % 7;
        const monday = new Date(d.getTime() - dow * DAY_MS);
        const sunday = new Date(monday.getTime() + 6 * DAY_MS);
        key = monday.toISOString().slice(0, 10);
        label = `${monday.getUTCDate()}/${monday.getUTCMonth() + 1}`;
        fullLabel = `Week of ${shortDate(monday, true)} – ${shortDate(sunday, true)}`;
      } else {
        key = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
        label = d.toLocaleDateString("en-IN", { month: "short" });
        fullLabel = d.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        });
      }

      const bucket = buckets.get(key) || { label, fullLabel, income: 0, expense: 0 };
      bucket.income += r.income || 0;
      bucket.expense += r.expense || 0;
      buckets.set(key, bucket);
    });

    let running = openingBalance ?? 0;
    return Array.from(buckets.values()).map((b) => {
      running = running + b.income - b.expense;
      return {
        ...b,
        balance: hasBalance ? running : undefined,
      };
    });
  }, [rows, mode, openingBalance, hasBalance]);

  const isEmpty = points.length === 0;
  const tickInterval = Math.max(0, Math.ceil(points.length / 8) - 1);

  return (
    <div className="rounded-2xl bg-card border border-border/60 shadow-sm p-4 sm:p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {trendChips}
          {!isEmpty && (
            <div className="inline-flex items-center gap-0.5 rounded-xl bg-muted/60 p-0.5">
              {GROUP_MODES.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => changeMode(g.key)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer",
                    mode === g.key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <span
            className="h-2.5 w-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: chartPalette.contributions }}
          />
          Contributions
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <span
            className="h-2.5 w-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: chartPalette.expenses }}
          />
          Expenses
        </span>
        {hasBalance && (
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <span
              className="h-0 w-5 shrink-0 border-t-2 border-dashed"
              style={{ borderColor: chartPalette.balance }}
            />
            Balance
          </span>
        )}
      </div>

      <div style={{ height }} className="w-full">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={points}
              margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-border/40"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                stroke="currentColor"
                className="text-muted-foreground"
                interval={tickInterval}
                height={28}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="currentColor"
                className="text-muted-foreground"
                tickFormatter={(v: number) => fmtINRCompact(v)}
                width={56}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", fillOpacity: 0.3 }}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(value, name) => {
                  const label =
                    name === "income"
                      ? "Contributions"
                      : name === "expense"
                        ? "Expenses"
                        : name === "balance"
                          ? "Balance"
                          : String(name ?? "");
                  return [fmtINR(Number(value ?? 0)), label];
                }}
                labelFormatter={(label) => {
                  if (typeof label !== "string") return label;
                  const point = points.find((p) => p.label === label);
                  return point?.fullLabel || label;
                }}
              />
              <Bar
                dataKey="income"
                name="Contributions"
                fill={chartPalette.contributions}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="expense"
                name="Expenses"
                fill={chartPalette.expenses}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              {hasBalance && (
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke={chartPalette.balance}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {summary && <div>{summary}</div>}
    </div>
  );
}

export default GroupedBarChart;
