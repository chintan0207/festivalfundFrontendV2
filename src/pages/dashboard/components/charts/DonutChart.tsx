import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

export interface DonutDatum {
  label: string;
  value: number;
  count?: number;
  color: string;
}

interface DonutChartProps {
  data: DonutDatum[];
  centerLabel?: string;
  height?: number;
  emptyText?: string;
  className?: string;
  /** Invoked when a slice is clicked (e.g. deep-link into filtered list). */
  onSliceClick?: (datum: DonutDatum) => void;
}

function fmtINR(value: number): string {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

/** Compact donut with a centered total and an amount + percentage legend. */
export function DonutChart({
  data,
  centerLabel = "Total",
  height = 190,
  emptyText = "No data recorded yet.",
  className,
  onSliceClick,
}: DonutChartProps) {
  const total = (data || []).reduce((sum, d) => sum + Number(d.value || 0), 0);

  if (total <= 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-xs text-muted-foreground",
          className,
        )}
        style={{ height }}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((d) => (
                <Cell
                  key={d.label}
                  fill={d.color}
                  className={onSliceClick ? "cursor-pointer" : undefined}
                  onClick={
                    onSliceClick ? () => onSliceClick(d) : undefined
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "10px",
                fontSize: "11px",
              }}
              formatter={(value, name) => [
                fmtINR(Number(value ?? 0)),
                String(name ?? ""),
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground tabular-nums">
            {fmtINR(total)}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {centerLabel}
          </span>
        </div>
      </div>

      <div className="space-y-2 mt-3">
        {data.map((d) => {
          const pct = total > 0 ? Math.round((Number(d.value || 0) / total) * 100) : 0;
          return (
            <button
              key={d.label}
              type="button"
              onClick={onSliceClick ? () => onSliceClick(d) : undefined}
              disabled={!onSliceClick}
              className="flex items-center gap-2 text-xs w-full text-left disabled:cursor-default group"
            >
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-muted-foreground truncate min-w-0 flex-1 group-hover:text-foreground transition-colors">
                {d.label}
                {d.count != null && (
                  <span className="text-muted-foreground/70"> · {d.count}</span>
                )}
              </span>
              <span className="font-semibold text-foreground tabular-nums shrink-0">
                {fmtINR(Number(d.value || 0))}
              </span>
              <span className="text-muted-foreground tabular-nums w-9 text-right shrink-0">
                {pct}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
