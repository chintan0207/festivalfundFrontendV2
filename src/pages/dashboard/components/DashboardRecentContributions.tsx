import { HandCoins, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppCard } from "@/components/common/AppCard";
import { AppBadge } from "@/components/common/AppBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { categoryAvatarGradient } from "@/theme/colors";
import { contributorInitials } from "@/lib/contributionFormat";
import {
  contributionStatusLabel,
  contributionStatusBadge,
  contributionTypeLabel,
  contributionTypeBadge,
} from "@/pages/contributions/lib/contributionMeta";
import type {
  DashboardData,
  DashboardContributionRecent,
} from "@/api/dashboard/dashboard.service";
import { formatINR, formatDate } from "../lib/dashboardFormat";

function ContributionRow({ c }: { c: DashboardContributionRecent }) {
  const isMoney = c.type === "MONEY";
  return (
    <Link
      to="/dashboard/contributions/$contributionId"
      params={{ contributionId: c._id }}
      className="flex items-center gap-3 rounded-xl px-2 py-2 -mx-2 hover:bg-muted/40 transition-colors"
    >
      <div
        className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${categoryAvatarGradient(c.contributor?.category)}`}
      >
        {contributorInitials(c.contributor?.name)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground truncate">
            {c.contributor?.name || "Contributor"}
          </p>
          <AppBadge size="xs" className={contributionTypeBadge(c.type)}>
            {contributionTypeLabel(c.type)}
          </AppBadge>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
          <span className="truncate">{c.contributionCode}</span>
          <span>·</span>
          <span>{formatDate(c.date)}</span>
          <span>·</span>
          <AppBadge size="xs" className={contributionStatusBadge(c.status)}>
            {contributionStatusLabel(c.status)}
          </AppBadge>
        </div>
      </div>

      <div className="text-right shrink-0">
        {isMoney ? (
          <p className="text-sm font-bold text-foreground tabular-nums">
            {formatINR(c.amount)}
          </p>
        ) : c.estimatedValue ? (
          <p className="text-sm font-bold text-foreground tabular-nums">
            {formatINR(c.estimatedValue)}
          </p>
        ) : (
          <p className="text-sm font-semibold text-muted-foreground">Item</p>
        )}
        <p className="text-[10px] text-muted-foreground">{c.paymentMode}</p>
      </div>
    </Link>
  );
}

export function DashboardRecentContributions({
  data,
  limit,
}: {
  data: DashboardData;
  limit?: number;
}) {
  const recent = limit
    ? data.contributions.recent.slice(0, limit)
    : data.contributions.recent;

  return (
    <AppCard
      icon={<HandCoins className="h-4 w-4" />}
      title="Recent Contributions"
      subtitle={`${data.contributions.totalCount} total records`}
      compact
      className="flex h-full flex-col"
    >
      {recent.length === 0 ? (
        <EmptyState
          icon={HandCoins}
          title="No contributions yet"
          description="Add a contribution from the quick actions above."
        />
      ) : (
        <div className="divide-y divide-border/60 flex-1">
          {recent.map((c) => (
            <ContributionRow key={c._id} c={c} />
          ))}
        </div>
      )}

      <Link
        to="/dashboard/contributions"
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        View all contributions <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </AppCard>
  );
}
