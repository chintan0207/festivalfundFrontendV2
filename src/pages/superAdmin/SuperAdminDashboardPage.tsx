import { useMemo } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { KPICard, KPIGrid } from "@/components/common/KPICard";
import { AppCard } from "@/components/common/AppCard";
import { AppBadge } from "@/components/common/AppBadge";
import { DataTable, type Column } from "@/components/common/DataTable";
import GroupedBarChart, { type GroupedBarRow } from "@/components/charts/GroupedBarChart";
import { usePlatformDashboard } from "@/api/superAdmin/useSuperAdmin";
import {
  Building2,
  CalendarDays,
  Users,
  Receipt,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowRight,
  CreditCard,
  Landmark,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { AppButton } from "@/components/common/AppButton";

export const SuperAdminDashboardPage = () => {
  const { data: stats, isLoading } = usePlatformDashboard();

  const activityColumns: Column<any>[] = [
    {
      id: "time",
      label: "Time",
      className: "w-32 text-muted-foreground whitespace-nowrap",
      render: (item) => item.date?.time || item.date?.date || "Just now",
    },
    {
      id: "actor",
      label: "Actor",
      className: "font-semibold whitespace-nowrap",
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <span className="truncate max-w-[120px]">{item.user}</span>
          {item.userRole && (
            <AppBadge size="sm" variant="outline" className="text-[9px] uppercase">
              {item.userRole}
            </AppBadge>
          )}
        </div>
      ),
    },
    {
      id: "action",
      label: "Action",
      className: "font-medium",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-foreground">{item.title}</span>
          {item.subtitle && (
            <span className="text-2xs text-muted-foreground line-clamp-1">{item.subtitle}</span>
          )}
        </div>
      ),
    },
    {
      id: "module",
      label: "Module",
      className: "w-28 text-center",
      render: (item) => (
        <AppBadge size="sm" variant="secondary" className="text-2xs font-semibold">
          {item.module || item.type}
        </AppBadge>
      ),
    },
    {
      id: "severity",
      label: "Severity",
      className: "w-24 text-right",
      render: (item) => (
        <AppBadge
          size="sm"
          className={
            item.severity === "CRITICAL"
              ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
              : item.severity === "WARNING"
                ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                : "bg-sky-500/15 text-sky-600 border-sky-500/30"
          }
        >
          {item.severity || "INFO"}
        </AppBadge>
      ),
    },
  ];

  const chartRows: GroupedBarRow[] = useMemo(() => {
    if (stats?.monthlyGrowth && stats.monthlyGrowth.length > 0) {
      return stats.monthlyGrowth.map((g) => {
        const parts = g.label.split("/");
        const m = parts[0]?.padStart(2, "0") || "01";
        const y = parts[1] || "2026";
        const divisor = stats.monthlyGrowth.length || 1;
        return {
          date: `${y}-${m}-01`,
          income: Math.round((stats.financials.totalCollectedAmount || 0) / divisor),
          expense: Math.round((stats.financials.totalExpensesAmount || 0) / divisor),
        };
      });
    }
    const today = new Date().toISOString().split("T")[0];
    return [
      {
        date: today,
        income: stats?.financials.totalCollectedAmount || 0,
        expense: stats?.financials.totalExpensesAmount || 0,
      },
    ];
  }, [stats]);

  return (
    <PageContainer variant="list">
      <PageHeader
        title="Platform Command Center"
        description="Comprehensive real-time health, organizations, and financial volume across FestivalFund."
        module="dashboard"
        badge={
          <AppBadge size="sm" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 gap-1.5 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Platform
          </AppBadge>
        }
        actions={
          <Link to="/super-admin/organizations" className="no-underline">
            <AppButton size="sm" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
              Explore Organizations
            </AppButton>
          </Link>
        }
      />

      {/* TOP LEVEL KPIS - 5 COLUMNS MATCHING ORG DASHBOARD */}
      <KPIGrid columns={5}>
        <KPICard
          label="Total Mandals"
          value={isLoading ? "-" : stats?.organizations.total || 0}
          icon={<Building2 className="h-5 w-5" />}
          accent="blue"
          subtext={`${stats?.organizations.active || 0} active · ${stats?.organizations.newThisMonth || 0} new`}
          isLoading={isLoading}
        />
        <KPICard
          label="Active Festivals"
          value={isLoading ? "-" : stats?.festivals.active || 0}
          icon={<CalendarDays className="h-5 w-5" />}
          accent="purple"
          subtext={`${stats?.festivals.total || 0} total festivals`}
          isLoading={isLoading}
        />
        <KPICard
          label="Total Collected"
          value={isLoading ? "-" : `₹${formatINR(stats?.financials.totalCollectedAmount || 0)}`}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="emerald"
          subtext={`${stats?.financials.totalContributionsCount || 0} receipts`}
          isLoading={isLoading}
        />
        <KPICard
          label="Total Spent"
          value={isLoading ? "-" : `₹${formatINR(stats?.financials.totalExpensesAmount || 0)}`}
          icon={<TrendingDown className="h-5 w-5" />}
          accent="rose"
          subtext={`${stats?.financials.totalExpensesCount || 0} vouchers`}
          isLoading={isLoading}
        />
        <KPICard
          label="Net Balance"
          value={isLoading ? "-" : `₹${formatINR(stats?.financials.netPlatformBalance || 0)}`}
          icon={<Activity className="h-5 w-5" />}
          accent="indigo"
          subtext="Available liquid funds"
          isLoading={isLoading}
        />
      </KPIGrid>

      {/* ROW 2: PLATFORM METRICS CARDS - COMPACT APPCARD STANDARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 items-stretch">
        {/* CARD 1: FINANCIAL LEDGER BALANCE */}
        <AppCard
          icon={<Landmark className="h-4 w-4 text-emerald-500" />}
          title="Financial Ledger Balance"
          subtitle="Aggregated volume across all tenant mandals"
          compact
          className="flex h-full flex-col"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Collected</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
                  ₹{formatINR(stats?.financials.totalCollectedAmount || 0)}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  {stats?.financials.totalContributionsCount || 0} receipts
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Expenses</span>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5 tabular-nums">
                  ₹{formatINR(stats?.financials.totalExpensesAmount || 0)}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  {stats?.financials.totalExpensesCount || 0} vouchers
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Net Liquid Mandal Funds
                </span>
                <p className="text-base font-black text-primary tabular-nums">
                  ₹{formatINR(stats?.financials.netPlatformBalance || 0)}
                </p>
              </div>
              <Receipt className="h-5 w-5 text-primary/40" />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
              <span>Pending Collections:</span>
              <span className="font-semibold text-amber-500 tabular-nums">
                ₹{formatINR(stats?.financials.totalPendingAmount || 0)}
              </span>
            </div>
          </div>
        </AppCard>

        {/* CARD 2: SUBSCRIPTION DISTRIBUTION */}
        <AppCard
          icon={<CreditCard className="h-4 w-4 text-amber-500" />}
          title="Subscription Distribution"
          subtitle="Tenant plan adoption tiers"
          compact
          className="flex h-full flex-col"
        >
          <div className="space-y-2.5 flex-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  <span className="font-medium text-foreground">Basic (Free)</span>
                </div>
                <span className="font-bold tabular-nums text-foreground">
                  {stats?.organizations.byPlan?.["FREE"] || 0}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-slate-400 transition-all duration-500"
                  style={{
                    width: `${((stats?.organizations.byPlan?.["FREE"] || 0) / Math.max(stats?.organizations.total || 1, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  <span className="font-medium text-foreground">Standard (₹299/mo)</span>
                </div>
                <span className="font-bold tabular-nums text-foreground">
                  {stats?.organizations.byPlan?.["STANDARD"] || 0}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{
                    width: `${((stats?.organizations.byPlan?.["STANDARD"] || 0) / Math.max(stats?.organizations.total || 1, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-foreground">Premium (₹399/mo)</span>
                </div>
                <span className="font-bold tabular-nums text-foreground">
                  {stats?.organizations.byPlan?.["PREMIUM"] || 0}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{
                    width: `${((stats?.organizations.byPlan?.["PREMIUM"] || 0) / Math.max(stats?.organizations.total || 1, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-2xs text-muted-foreground border-t border-border/40">
              <span>Suspended Mandals</span>
              <span className="font-bold text-rose-500 tabular-nums">
                {stats?.organizations.suspended || 0}
              </span>
            </div>
          </div>

          <Link
            to="/super-admin/plans"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Manage Subscription Plans <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </AppCard>

        {/* CARD 3: USER ROLES SPLIT */}
        <AppCard
          icon={<Users className="h-4 w-4 text-indigo-500" />}
          title="User Roles Split"
          subtitle="Platform-wide access privileges"
          compact
          className="flex h-full flex-col"
        >
          <div className="space-y-3 flex-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Organization Admins</span>
                <span className="font-bold text-foreground tabular-nums">
                  {stats?.users.byRole?.["ORG_ADMIN"] || 0}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((stats?.users.byRole?.["ORG_ADMIN"] || 0) / Math.max(stats?.users.total || 1, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Organization Viewers</span>
                <span className="font-bold text-foreground tabular-nums">
                  {stats?.users.byRole?.["ORG_VIEWER"] || 0}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((stats?.users.byRole?.["ORG_VIEWER"] || 0) / Math.max(stats?.users.total || 1, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Platform Super Admins</span>
                <span className="font-bold text-primary tabular-nums">
                  {stats?.users.byRole?.["SUPER_ADMIN"] || 0}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${((stats?.users.byRole?.["SUPER_ADMIN"] || 0) / Math.max(stats?.users.total || 1, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-2 text-2xs text-muted-foreground border-t border-border/40">
              {stats?.users.total || 0} total registered user accounts.
            </div>
          </div>

          <Link
            to="/super-admin/users"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View Users Directory <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </AppCard>
      </div>

      {/* ROW 3: PLATFORM VOLUME BAR CHART */}
      <GroupedBarChart
        rows={chartRows}
        title="Platform Financial Movement"
        subtitle="Collections vs expenses across tenant organizations"
        height={260}
        summary={
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-muted/40 border border-border/60 px-3.5 py-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-sm bg-emerald-500" />
              Total Collected
              <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums font-bold">
                ₹{formatINR(stats?.financials.totalCollectedAmount || 0)}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-sm bg-rose-500" />
              Total Spent
              <strong className="text-rose-500 dark:text-rose-400 tabular-nums font-bold">
                ₹{formatINR(stats?.financials.totalExpensesAmount || 0)}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              Net Platform Balance
              <strong className="text-primary tabular-nums font-bold">
                ₹{formatINR(stats?.financials.netPlatformBalance || 0)}
              </strong>
            </span>
          </div>
        }
      />

      {/* ROW 4: RECENT PLATFORM AUDIT FEED */}
      <AppCard
        icon={<Activity className="h-4 w-4 text-sky-500" />}
        title="Recent Platform Activity"
        subtitle="Live audit trail of administrative and security events"
        compact
        className="flex flex-col"
      >
        <div className="space-y-3">
          <DataTable
            columns={activityColumns}
            data={stats?.recentActivity || []}
            keyExtractor={(item) => item.id || String(Math.random())}
            isLoading={isLoading}
            emptyTitle="No platform activity recorded yet"
            module="dashboard"
          />

          <div className="flex justify-end pt-1">
            <Link
              to="/super-admin/audit-logs"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View Full Audit Log Explorer <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </AppCard>
    </PageContainer>
  );
};

export default SuperAdminDashboardPage;
