import { Banknote, Package, Calendar, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import { AppBadge } from "@/components/common/AppBadge";
import { EmptyState } from "@/components/common/EmptyState";
import {
  contributionFestivalLabel,
  contributionStatusBadge,
  contributionTypeStyles,
  formatContributionAmount,
} from "@/lib/contributionFormat";
import type { Contribution } from "@/types/Types";

function ContributionCard({ c }: { c: Contribution }) {
  return (
    <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold text-indigo-600 text-[11px]">{c.contributionCode}</span>
        <AppBadge size="xs" className={contributionStatusBadge(c.status)}>
          {c.status}
        </AppBadge>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="font-medium text-foreground">{contributionFestivalLabel(c)}</span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={cn("inline-flex items-center gap-1 font-semibold", contributionTypeStyles[c.type])}>
          {c.type === "CASH" ? <Banknote className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
          {c.type}
        </span>
        <span className="font-bold text-foreground">{formatContributionAmount(c)}</span>
      </div>

      {c.date && (
        <div className="text-[11px] text-muted-foreground">{formatDate(c.date)}</div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-2.5">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-36" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function ContributorContributionCards({
  contributions,
  isLoading,
}: {
  contributions: Contribution[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No contributions yet"
        description="Contributions made by this donor will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {contributions.map((c) => (
        <ContributionCard key={c._id} c={c} />
      ))}
    </div>
  );
}
