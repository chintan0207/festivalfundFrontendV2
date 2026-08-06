import { Phone, Calendar, ChevronRight } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { AppBadge } from "@/components/common/AppBadge";
import {
  contributionCategoryBadge,
  contributionCategoryLabel,
} from "../../lib/contributionMeta";
import type { ContributionListItem } from "@/types/Types";

export function ContributionLinkedCards({
  contribution,
  onContributorClick,
  onFestivalClick,
}: {
  contribution: ContributionListItem;
  onContributorClick?: () => void;
  onFestivalClick?: () => void;
}) {
  const contributor = contribution.contributor;
  const festival = contribution.festival;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Contributor */}
      <button
        type="button"
        onClick={onContributorClick}
        disabled={!onContributorClick || !contributor}
        className={cn(
          "rounded-2xl bg-card border border-border/80 shadow-xs p-4 text-left transition-all text-xs",
          onContributorClick && contributor
            ? "hover:shadow-md cursor-pointer hover:border-indigo-500/40"
            : "cursor-default"
        )}
      >
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Contributor
        </p>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0",
              "bg-gradient-to-r from-indigo-500 to-violet-600"
            )}
          >
            {initials(contributor?.name || "?")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground truncate">{contributor?.name || "—"}</p>
            {contributor?.contributorCode && (
              <p className="font-mono text-[11px] text-muted-foreground">{contributor.contributorCode}</p>
            )}
          </div>
          <AppBadge size="xs" className={contributionCategoryBadge(contributor?.category)}>
            {contributionCategoryLabel(contributor?.category)}
          </AppBadge>
        </div>
        {contributor?.phoneNumber && (
          <div className="flex items-center gap-1.5 mt-2.5 text-muted-foreground">
            <Phone className="h-3 w-3 shrink-0" />
            <span className="truncate">{contributor.phoneNumber}</span>
          </div>
        )}
        {onContributorClick && contributor && (
          <div className="flex items-center gap-0.5 mt-2 text-[11px] font-semibold text-indigo-500">
            View profile <ChevronRight className="h-3 w-3" />
          </div>
        )}
      </button>

      {/* Festival */}
      <button
        type="button"
        onClick={onFestivalClick}
        disabled={!onFestivalClick || !festival}
        className={cn(
          "rounded-2xl bg-card border border-border/80 shadow-xs p-4 text-left transition-all text-xs",
          onFestivalClick && festival
            ? "hover:shadow-md cursor-pointer hover:border-pink-500/40"
            : "cursor-default"
        )}
      >
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Festival
        </p>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-r from-pink-500 to-rose-600 shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground truncate">{festival?.name || "—"}</p>
            {festival?.year && <p className="text-[11px] text-muted-foreground">{festival.year}</p>}
          </div>
        </div>
        {onFestivalClick && festival && (
          <div className="flex items-center gap-0.5 mt-2 text-[11px] font-semibold text-pink-500">
            View festival <ChevronRight className="h-3 w-3" />
          </div>
        )}
      </button>
    </div>
  );
}
