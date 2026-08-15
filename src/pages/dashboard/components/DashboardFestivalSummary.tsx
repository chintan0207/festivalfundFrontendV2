import {
  CalendarDays,
  MapPin,
  Target,
  Landmark,
  Users,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppCard } from "@/components/common/AppCard";
import { AppBadge } from "@/components/common/AppBadge";
import {
  festivalStatusBadge,
  festivalStatusLabel,
  festivalCategoryBadge,
} from "@/pages/festivals/lib/festivalMeta";
import type { DashboardData } from "@/api/dashboard/dashboard.service";
import { formatINR, formatDate } from "../lib/dashboardFormat";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="font-semibold text-foreground truncate">{value}</span>
    </div>
  );
}

export function DashboardFestivalSummary({ data }: { data: DashboardData }) {
  const { festival, stats } = data;

  const target = festival.targetAmount || 0;
  const collected = stats.totalCollected || 0;
  const progressPct =
    target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;

  const dates =
    festival.startDate || festival.endDate
      ? `${formatDate(festival.startDate)} → ${formatDate(festival.endDate)}`
      : "Not set";

  return (
    <AppCard
      icon={<Landmark className="h-4 w-4" />}
      title={`${festival.name}`}
      subtitle={`${festival.year}`}
      compact
      className="flex h-full flex-col"
    >
      <div className="space-y-3">
        {/* Header: status + type */}
        <div className="flex flex-wrap items-center gap-1.5">
          <AppBadge size="xs" className={festivalStatusBadge(festival.status)}>
            {festivalStatusLabel(festival.status)}
          </AppBadge>
          {festival.category && (
            <AppBadge size="xs" className={festivalCategoryBadge(festival.category)}>
              {festival.category}
            </AppBadge>
          )}
        </div>

        {/* Dates / location */}
        <div className="rounded-xl bg-muted/40 border border-border/60 p-2.5 space-y-1.5">
          <InfoRow
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            label="Dates"
            value={dates}
          />
          <InfoRow
            icon={<MapPin className="h-3.5 w-3.5" />}
            label="Location"
            value={festival.location || "Not set"}
          />
        </div>

        {/* Financial progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Target className="h-3.5 w-3.5" />
              {target > 0 ? "Collection Progress" : "Collected"}
            </span>
            <span className="tabular-nums font-bold text-foreground">
              {formatINR(collected)}
              {target > 0 && <span className="text-muted-foreground font-medium"> / {formatINR(target)}</span>}
              <span className="text-muted-foreground"> ({progressPct}%)</span>
            </span>
          </div>
          {target > 0 ? (
            <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          ) : (
            <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: "100%" }}
              />
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Landmark className="h-3.5 w-3.5 shrink-0" />
            Opening balance{" "}
            <strong className="text-foreground tabular-nums font-semibold">
              {formatINR(stats.openingBalance)}
            </strong>
          </div>
        </div>

        {/* Activity counts */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-2 text-center">
            <p className="text-base font-bold text-foreground tabular-nums leading-none">
              {stats.contributorsCount}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Contributors</p>
          </div>
          <div className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-2 text-center">
            <p className="text-base font-bold text-foreground tabular-nums leading-none">
              {data.contributions.totalCount}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Contributions</p>
          </div>
          <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-2 text-center">
            <p className="text-base font-bold text-foreground tabular-nums leading-none">
              {data.expenses.totalCount}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Expenses</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5 shrink-0" />
          {stats.contributorsCount} contributors have made{" "}
          {data.contributions.totalCount} contribution
          {data.contributions.totalCount === 1 ? "" : "s"}.
        </div>
      </div>

      <Link
        to="/dashboard/festivals/$festivalId"
        params={{ festivalId: festival._id }}
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        View Festival Details <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </AppCard>
  );
}