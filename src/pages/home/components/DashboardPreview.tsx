import { AppBadge } from "@/components/common/AppBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  kpiData,
  monthlyData,
  categoryData,
  tenantOrgs,
} from "@/lib/data/landingPageData";
import { cn } from "@/lib/utils";

const DashboardPreview = () => {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl animate-fade-up px-4 sm:px-6">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-chart-2/20 blur-2xl" />
      <Card className="relative overflow-hidden">
        <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/50 px-4">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center font-mono text-2xs text-muted-foreground">
            app.festivalfund.com/dashboard
          </div>
        </div>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Dashboard Overview</p>
              <p className="text-2xs text-muted-foreground">
                Shri Ganesh Temple Trust · 2025-26
              </p>
            </div>
            <AppBadge className="bg-green-500/10 text-green-600 dark:text-green-400">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              Live
            </AppBadge>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {kpiData.map((kpi, i) => (
              <div key={i} className="rounded-xl border border-border bg-muted/50 p-3">
                <p className="text-2xs text-muted-foreground">{kpi.label}</p>
                <p className="mt-0.5 text-lg font-bold">{kpi.value}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span
                    className={cn(
                      "text-2xs font-medium",
                      kpi.change.startsWith("+")
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-500",
                    )}
                  >
                    {kpi.change}
                  </span>
                  <Sparkline data={kpi.spark} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/50 p-4 sm:col-span-2">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                Collection Trend
              </p>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="collectionTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="url(#collectionTrend)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                By Category
              </p>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {categoryData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {categoryData.map((cat) => (
                  <div
                    key={cat.label}
                    className="flex items-center gap-1 text-2xs text-muted-foreground"
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-24 mb-4 text-center">
        <p className="mb-6 text-sm" style={{ color: "var(--tertiary)" }}>
          Trusted by organizations of all sizes
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-60 sm:gap-10">
          {tenantOrgs?.map((org) => (
            <span key={org} className="text-sm font-semibold text-muted-foreground">
              {org}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;

const Sparkline = ({ data }: { data: number[] }) => {
  const points = data.map((d, i) => `${i * 8},${16 - (d / 60) * 16}`).join(" ");
  return (
    <svg width="48" height="16" viewBox="0 0 48 16">
      <polyline
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
};
