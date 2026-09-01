import {
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Landmark,
  Plus,
  CheckCircle,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { AppBadge, AppButton } from "@/components/common";
import { KPICard, KPIGrid } from "@/components/common/KPICard";

const mockContributions = [
  {
    code: "CTR-0142",
    name: "Ramesh M Patel",
    category: "Parents",
    amount: "₹11,000",
    mode: "UPI",
    type: "MONEY",
    status: "DEPOSITED",
    time: "2 mins ago",
  },
  {
    code: "CTR-0089",
    name: "Suresh K Shah",
    category: "Boys",
    amount: "Khichdi & Kadhi Set",
    mode: "ITEM",
    type: "ITEM",
    status: "DEPOSITED",
    time: "15 mins ago",
  },
  {
    code: "CTR-0204",
    name: "Anil V Sharma",
    category: "Parents",
    amount: "₹5,000",
    mode: "CASH",
    type: "MONEY",
    status: "PENDING",
    time: "42 mins ago",
  },
];

const mockActivities = [
  {
    title: "Contribution Deposited",
    desc: "Ramesh M Patel · ₹11,000 via UPI",
    time: "2m ago",
  },
  {
    title: "Receipt Slip Generated",
    desc: "Slip CTR-0142 downloaded",
    time: "5m ago",
  },
  {
    title: "Expense Verified & Paid",
    desc: "Shree Decorators · ₹65,000",
    time: "1h ago",
  },
];

const DashboardPreview = () => {
  return (
    <div className="relative mx-auto mt-14 max-w-6xl animate-fade-up px-4 sm:px-6">
      {/* Subtle outer glow backdrop */}
      <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-primary/30 via-indigo-500/20 to-purple-600/30 blur-xl opacity-75 dark:opacity-50 pointer-events-none" />

      {/* Main Glassmorphic Window Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl">
        {/* Browser Top Navigation Header */}
        <div className="flex h-11 items-center justify-between border-b border-border bg-muted/60 px-4 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400/90" />
              <div className="h-3 w-3 rounded-full bg-amber-400/90" />
              <div className="h-3 w-3 rounded-full bg-green-400/90" />
            </div>
            <span className="ml-2 hidden font-mono text-[11px] font-medium text-muted-foreground/80 sm:inline-block">
              app.festivalfund.com/dashboard/ganesh-utsav-2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            <AppBadge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 text-xs px-2.5 py-0.5">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ganesh Utsav 2026 · LIVE
            </AppBadge>
          </div>
        </div>

        {/* Real App Dashboard Page Container */}
        <div className="p-4 sm:p-6 space-y-5 text-left bg-background/50">
          {/* Subheader & Quick Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  Ganesh Utsav 2026
                </h3>
                <AppBadge variant="secondary" size="sm" className="bg-primary/10 text-primary border-primary/20">
                  ACTIVE
                </AppBadge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Live overview of collections, expenses, contributors and activity log
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <AppButton size="xs" variant="outline" className="text-xs h-8 gap-1 border-border/80">
                <Plus className="h-3.5 w-3.5 text-primary" />
                Add Expense
              </AppButton>
              <AppButton size="xs" className="text-xs h-8 gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs">
                <Plus className="h-3.5 w-3.5" />
                Add Contribution
              </AppButton>
            </div>
          </div>

          {/* 1. Real 5-Column KPI Cards Row */}
          <KPIGrid columns={5}>
            <KPICard
              size="sm"
              label="Opening Balance"
              value="₹50,000"
              icon={<Landmark className="h-3.5 w-3.5" />}
              accent="blue"
              subtext="Starting funds"
            />
            <KPICard
              size="sm"
              label="Total Collected"
              value="₹4,85,000"
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              accent="emerald"
              sparkData={[20, 35, 45, 60, 75, 95, 120]}
              change="+18%"
              changeType="positive"
              subtext="142 deposited"
            />
            <KPICard
              size="sm"
              label="Total Spent"
              value="₹1,65,000"
              icon={<TrendingDown className="h-3.5 w-3.5" />}
              accent="rose"
              sparkData={[10, 15, 20, 30, 45, 55, 65]}
              change="-5%"
              changeType="positive"
              subtext="24 paid expenses"
            />
            <KPICard
              size="sm"
              label="Current Balance"
              value="₹3,70,000"
              icon={<Activity className="h-3.5 w-3.5" />}
              accent="indigo"
              subtext="Available funds"
            />
            <KPICard
              size="sm"
              label="Pending Pledges"
              value="₹45,000"
              icon={<Clock className="h-3.5 w-3.5" />}
              accent="amber"
              subtext="12 pending pledges"
            />
          </KPIGrid>

          {/* 2. Middle Row: Collection Progress & Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Festival Budget Progress Card */}
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  Festival Budget Target
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  97% Achieved
                </span>
              </div>
              <div>
                <div className="flex justify-between text-2xs text-muted-foreground mb-1">
                  <span>Collected: ₹4,85,000</span>
                  <span>Target: ₹5,00,000</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[97%]" />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground/90">
                ₹15,000 remaining to reach festival target.
              </p>
            </div>

            {/* Payment Channels Distribution */}
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-2.5">
              <span className="text-xs font-bold text-foreground block">
                Payment Channel Breakdown
              </span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-2xs text-muted-foreground mb-0.5">
                    <span>Cash (65%)</span>
                    <span className="font-semibold text-foreground">₹3,15,250</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 w-[65%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-2xs text-muted-foreground mb-0.5">
                    <span>UPI / QR (30%)</span>
                    <span className="font-semibold text-foreground">₹1,45,500</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 w-[30%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contributor Category Stats */}
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-2.5">
              <span className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Donor Categories</span>
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-emerald-500/10 p-2 border border-emerald-500/20">
                  <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Parents</span>
                  <span className="text-sm font-bold text-foreground">142</span>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-2 border border-blue-500/20">
                  <span className="block text-[10px] font-semibold text-blue-600 dark:text-blue-400">Boys</span>
                  <span className="text-sm font-bold text-foreground">85</span>
                </div>
                <div className="rounded-lg bg-rose-500/10 p-2 border border-rose-500/20">
                  <span className="block text-[10px] font-semibold text-rose-600 dark:text-rose-400">Girls</span>
                  <span className="text-sm font-bold text-foreground">48</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Lower Grid: Recent Contributions & Expenses Mock Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Recent Contributions Table */}
            <div className="lg:col-span-2 rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Recent Contributions</span>
                <span className="text-[11px] font-semibold text-primary flex items-center gap-0.5">
                  Live Feed <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <div className="divide-y divide-border/60">
                {mockContributions.map((item) => (
                  <div key={item.code} className="py-2 flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground truncate">{item.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {item.code}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{item.category} · {item.time}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block font-bold text-foreground">{item.amount}</span>
                      <AppBadge
                        size="sm"
                        className={
                          item.status === "DEPOSITED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] py-0 px-1.5"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] py-0 px-1.5"
                        }
                      >
                        {item.status}
                      </AppBadge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-3">
              <span className="text-xs font-bold text-foreground block">
                Live Activity Feed
              </span>
              <div className="space-y-3">
                {mockActivities.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                      <CheckCircle className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground leading-tight">{act.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">{act.desc}</p>
                      <span className="text-[10px] text-muted-foreground/70">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust reassurance banner */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground font-medium inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Multi-tenant secure data · Instant receipt PDFs · 100% free early access
        </p>
      </div>
    </div>
  );
};

export default DashboardPreview;
