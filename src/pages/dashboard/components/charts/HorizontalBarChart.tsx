import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

export interface HBarDatum {
  name: string;
  value: number;
  count?: number;
  color: string;
}

interface HorizontalBarChartProps {
  data: HBarDatum[];
  height?: number;
  emptyText?: string;
  /** Invoked when a row is clicked (e.g. deep-link into a filtered list). */
  onRowClick?: (datum: HBarDatum) => void;
}

function fmtINR(value: number): string {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function fmtINRCompact(value: number): string {
  return `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0))}`;
}

interface ChartRow extends HBarDatum {
  fullName: string;
  pct: number;
}

/** Horizontal (vertical-layout) bar chart for ranked categories. */
export function HorizontalBarChart({
  data,
  height,
  emptyText = "No data recorded yet.",
  onRowClick,
}: HorizontalBarChartProps) {
  const { rows } = useMemo(() => {
    const filtered = (data || [])
      .filter((d) => Number(d.value || 0) > 0)
      .sort((a, b) => b.value - a.value);

    const sum = filtered.reduce((acc, d) => acc + Number(d.value || 0), 0);
    return {
      rows: filtered.map((d) => ({
        ...d,
        fullName: d.count != null ? `${d.name} · ${d.count}` : d.name,
        pct: sum > 0 ? Math.round((Number(d.value || 0) / sum) * 100) : 0,
      })),
    };
  }, [data]);

  const chartHeight = height ?? Math.max(170, rows.length * 46 + 28);

  if (rows.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-muted-foreground"
        style={{ height: 170 }}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={rows}
        layout="vertical"
        margin={{ top: 4, right: 44, bottom: 4, left: 8 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="currentColor"
          className="text-border/40"
        />
        <XAxis
          type="number"
          tick={{ fontSize: 10 }}
          stroke="currentColor"
          className="text-muted-foreground"
          tickFormatter={(v: number) => fmtINRCompact(v)}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="fullName"
          tick={{ fontSize: 11 }}
          stroke="currentColor"
          className="text-muted-foreground"
          width={110}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)", fillOpacity: 0.3 }}
          contentStyle={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            borderRadius: "10px",
            fontSize: "11px",
          }}
          formatter={(value, name, item) => {
            const row = item?.payload as ChartRow | undefined;
            return [
              `${fmtINR(Number(value ?? 0))}${
                row?.count != null ? ` · ${row.count}` : ""
              } · ${row?.pct ?? 0}%`,
              String(name ?? "Amount"),
            ];
          }}
          labelFormatter={(label) => String(label ?? "").split(" · ")[0]}
        />
        <Bar dataKey="value" name="Amount" radius={[0, 6, 6, 0]} maxBarSize={18}>
          {rows.map((r) => (
            <Cell
              key={r.fullName}
              fill={r.color}
              className={onRowClick ? "cursor-pointer" : undefined}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
            />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v) => fmtINRCompact(Number(v ?? 0))}
            style={{ fontSize: 10, fill: "currentColor" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}