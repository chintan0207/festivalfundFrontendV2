import { Banknote, Package, Calendar, Pencil, Trash2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { EmptyState } from "@/components/common/EmptyState";
import { getModuleTheme } from "@/theme/colors";
import {
  contributionCategoryBadge,
  contributionCategoryLabel,
  contributionStatusBadge,
  contributionStatusLabel,
} from "../../lib/contributionMeta";
import { contributionFestivalLabel, formatContributionAmount } from "@/lib/contributionFormat";
import type { ContributionListItem } from "@/types/Types";

interface ContributionMobileCardsProps {
  contributions: ContributionListItem[];
  isLoading: boolean;
  minimal?: boolean;
  onEdit: (contribution: ContributionListItem) => void;
  onDelete: (id: string) => void;
  onRowClick: (contribution: ContributionListItem) => void;
}

function ContributionCard({
  contribution,
  minimal,
  onEdit,
  onDelete,
  onRowClick,
}: {
  contribution: ContributionListItem;
  minimal?: boolean;
  onEdit: (c: ContributionListItem) => void;
  onDelete: (id: string) => void;
  onRowClick: (c: ContributionListItem) => void;
}) {
  const theme = getModuleTheme("contributions");
  const isCash = contribution.type === "MONEY";

  return (
    <div
      className={cn(
        "rounded-2xl bg-card border border-border/80 shadow-xs cursor-pointer active:scale-[0.99] transition-transform",
        minimal ? "p-3" : "p-4 space-y-3"
      )}
      onClick={() => onRowClick(contribution)}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
            theme.gradient,
            "text-white"
          )}
        >
          {isCash ? <Banknote className="h-4 w-4" /> : <Package className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">
            {contribution.contributor?.name || "—"}
          </p>
          <p className={`font-mono text-[11px] ${theme.iconColor}`}>{contribution.contributionCode}</p>
        </div>
        <AppBadge size="xs" className={contributionStatusBadge(contribution.status)}>
          {contributionStatusLabel(contribution.status)}
        </AppBadge>
      </div>

      {!minimal && (
        <>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="truncate">{contributionFestivalLabel(contribution)}</span>
            </div>
            <AppBadge size="xs" className={contributionCategoryBadge(contribution.contributor?.category)}>
              {contributionCategoryLabel(contribution.contributor?.category)}
            </AppBadge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              {contribution.date ? formatDate(contribution.date) : "—"}
            </span>
            <span className="text-sm font-extrabold text-foreground">
              {formatContributionAmount(contribution)}
            </span>
          </div>

          <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            <AppButton
              variant="outline"
              className="flex-1 h-9 rounded-xl text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              onClick={() => onEdit(contribution)}
              leftIcon={<Pencil className="h-3.5 w-3.5" />}
            >
              Edit
            </AppButton>
            <AppButton
              variant="outline"
              className="flex-1 h-9 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10"
              onClick={() => onDelete(contribution._id)}
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Delete
            </AppButton>
          </div>
        </>
      )}
    </div>
  );
}

function MobileCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-8 rounded-lg" />
        <Skeleton className="h-8 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export function ContributionMobileCards({
  contributions,
  isLoading,
  minimal,
  onEdit,
  onDelete,
  onRowClick,
}: ContributionMobileCardsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <MobileCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <div className="md:hidden">
        <EmptyState
          icon={Search}
          title="No contributions found"
          description="Try adjusting your search or filters"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 md:hidden">
      {contributions.map((c) => (
        <ContributionCard
          key={c._id}
          contribution={c}
          minimal={minimal}
          onEdit={onEdit}
          onDelete={onDelete}
          onRowClick={onRowClick}
        />
      ))}
    </div>
  );
}
