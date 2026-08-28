import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import GroupedBarChart, { type GroupedBarRow } from "@/components/charts/GroupedBarChart";
import type { DashboardData } from "@/api/dashboard/dashboard.service";
import { formatINR, formatPct } from "../lib/dashboardFormat";

interface DashboardOverviewProps {
  data: DashboardData;
}

function PeriodSummary({ income, expense }: { income: number; expense: number }) {
  const net = income - expense;
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-muted/40 border border-border/60 px-3.5 py-2.5 text-xs">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <span className="h-2 w-2 rounded-sm bg-emerald-500" />
        Collected
        <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums font-bold">
          {formatINR(income)}
        </strong>
      </span>
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <span className="h-2 w-2 rounded-sm bg-rose-500" />
        Spent
        <strong className="text-rose-500 dark:text-rose-400 tabular-nums font-bold">
          {formatINR(expense)}
        </strong>
      </span>
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        Net movement
        <strong
          className={
            net >= 0
              ? "text-emerald-600 dark:text-emerald-400 tabular-nums font-bold"
              : "text-rose-500 dark:text-rose-400 tabular-nums font-bold"
          }
        >
          {net >= 0 ? "+" : ""}
          {formatINR(net)}
        </strong>
      </span>
    </div>
  );
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const trends = data?.trends || { income: { value: 0, previous: 0, pct: null }, expense: { value: 0, previous: 0, pct: null } };

  const rows: GroupedBarRow[] = useMemo(() => {
    const map = new Map<string, { date: string; income: number; expense: number }>();
    (data?.contributions?.timeSeries || []).forEach((p) => {
      if (!p || !p.date) return;
      const key = String(p.date).split("T")[0];
      const existing = map.get(key) || { date: key, income: 0, expense: 0 };
      existing.income = (existing.income || 0) + (p.income || 0);
      map.set(key, existing);
    });
    (data?.expenses?.timeSeries || []).forEach((p) => {
      if (!p || !p.date) return;
      const key = String(p.date).split("T")[0];
      const existing = map.get(key) || { date: key, income: 0, expense: 0 };
      existing.expense = (existing.expense || 0) + (p.expense || 0);
      map.set(key, existing);
    });

    // Fallback: If timeSeries produced no items, construct rows from recent records
    if (map.size === 0) {
      (data?.contributions?.recent || []).forEach((c) => {
        if (!c || !c.date) return;
        const key = String(c.date).split("T")[0];
        const existing = map.get(key) || { date: key, income: 0, expense: 0 };
        const amt = c.type === "MONEY" ? (c.amount || 0) : (c.estimatedValue || 0);
        existing.income += amt;
        map.set(key, existing);
      });
      (data?.expenses?.recent || []).forEach((e) => {
        if (!e || !e.date) return;
        const key = String(e.date).split("T")[0];
        const existing = map.get(key) || { date: key, income: 0, expense: 0 };
        existing.expense += e.amount || 0;
        map.set(key, existing);
      });
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [
    data?.contributions?.timeSeries,
    data?.expenses?.timeSeries,
    data?.contributions?.recent,
    data?.expenses?.recent,
  ]);

  const periodTotals = useMemo(() => {
    let income = (data?.contributions?.timeSeries || []).reduce(
      (sum, p) => sum + Number(p?.income || 0),
      0,
    );
    let expense = (data?.expenses?.timeSeries || []).reduce(
      (sum, p) => sum + Number(p?.expense || 0),
      0,
    );
    if (income === 0 && expense === 0 && rows.length > 0) {
      rows.forEach((r) => {
        income += r.income;
        expense += r.expense;
      });
    }
    return { income, expense };
  }, [data?.contributions?.timeSeries, data?.expenses?.timeSeries, rows]);

  const incomeTrendChip = (
    <span
      className={
        "inline-flex items-center gap-1 font-semibold text-xs " +
        (trends.income?.pct != null && trends.income.pct >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-muted-foreground")
      }
    >
      <TrendingUp className="h-3.5 w-3.5" />
      {trends.income?.pct != null && `7d ${formatPct(trends.income.pct)}`}
    </span>
  );

  const expenseTrendChip = (
    <span
      className={
        "inline-flex items-center gap-1 font-semibold text-xs " +
        (trends.expense?.pct != null && trends.expense.pct >= 0
          ? "text-rose-500 dark:text-rose-400"
          : "text-muted-foreground")
      }
    >
      <TrendingDown className="h-3.5 w-3.5" />
      {trends.expense?.pct != null && `7d ${formatPct(trends.expense.pct)}`}
    </span>
  );

  return (
    <GroupedBarChart
      rows={rows}
      openingBalance={data?.stats?.openingBalance}
      title="Financial Overview"
      subtitle="Daily contributions vs expenses"
      trendChips={
        <>
          {incomeTrendChip}
          {expenseTrendChip}
        </>
      }
      height={280}
      summary={<PeriodSummary {...periodTotals} />}
    />
  );
}