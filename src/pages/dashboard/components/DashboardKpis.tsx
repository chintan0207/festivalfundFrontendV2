import { TrendingUp, TrendingDown, Activity, Clock, Landmark } from "lucide-react";
import { KPICard, KPIGrid } from "@/components/common/KPICard";
import type { DashboardData } from "@/api/dashboard/dashboard.service";
import { formatINR, formatPct } from "../lib/dashboardFormat";

interface DashboardKpisProps {
  data: DashboardData;
}

export function DashboardKpis({ data }: DashboardKpisProps) {
  const { stats, trends, contributions } = data;

  const incomeSpark = contributions.timeSeries.map((p) => p.income);
  const expenseSpark = data.expenses.timeSeries.map((p) => p.expense);

  const incomeTrend =
    trends.income.pct == null ? undefined : `7d ${formatPct(trends.income.pct)} vs prev`;
  const expenseTrend =
    trends.expense.pct == null
      ? undefined
      : `7d ${formatPct(trends.expense.pct)} vs prev`;

  return (
    <KPIGrid columns={5}>
      <KPICard
        label="Opening Balance"
        value={formatINR(stats.openingBalance)}
        icon={<Landmark className="h-5 w-5" />}
        accent="blue"
        subtext="Starting funds"
      />
      <KPICard
        label="Total Collected"
        value={formatINR(stats.totalCollected)}
        icon={<TrendingUp className="h-5 w-5" />}
        accent="emerald"
        sparkData={incomeSpark}
        change={incomeTrend}
        changeType={
          trends.income.pct != null
            ? trends.income.pct >= 0
              ? "positive"
              : "negative"
            : "neutral"
        }
        subtext={`${contributions.statusCounts.DEPOSITED.count} deposited contributions`}
      />
      <KPICard
        label="Total Spent"
        value={formatINR(stats.totalExpenses)}
        icon={<TrendingDown className="h-5 w-5" />}
        accent="rose"
        sparkData={expenseSpark}
        change={expenseTrend}
        changeType={
          trends.expense.pct != null
            ? trends.expense.pct >= 0
              ? "negative"
              : "positive"
            : "neutral"
        }
        subtext={`${data.expenses.statusCounts.PAID.count} paid expenses`}
      />
      <KPICard
        label="Current Balance"
        value={formatINR(stats.currentBalance)}
        icon={<Activity className="h-5 w-5" />}
        accent="indigo"
        subtext="Available funds"
      />
      <KPICard
        label="Pending Balance"
        value={formatINR(stats.pendingAmount)}
        icon={<Clock className="h-5 w-5" />}
        accent="amber"
        subtext={`${contributions.statusCounts.PENDING.count} pending contributions`}
      />
    </KPIGrid>
  );
}