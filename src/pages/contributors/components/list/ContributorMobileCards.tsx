import { MapPin, Phone, Pencil, Trash2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, initials, formatDate } from "@/lib/utils";
import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { EmptyState } from "@/components/common/EmptyState";
import { contributorCategoryBadge, contributorCategoryLabel, contributorAvatarGradient } from "../../lib/contributorMeta";
import type { Contributor } from "@/types/Types";

interface ContributorMobileCardsProps {
  contributors: Contributor[];
  isLoading: boolean;
  minimal?: boolean;
  onEdit: (contributor: Contributor) => void;
  onDelete: (id: string) => void;
  onRowClick: (contributor: Contributor) => void;
}

function ContributorCard({
  contributor,
  minimal,
  onEdit,
  onDelete,
  onRowClick,
}: {
  contributor: Contributor;
  minimal?: boolean;
  onEdit: (c: Contributor) => void;
  onDelete: (id: string) => void;
  onRowClick: (c: Contributor) => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card border border-border/80 shadow-xs cursor-pointer active:scale-[0.99] transition-transform",
        minimal ? "p-3" : "p-4 space-y-3"
      )}
      onClick={() => onRowClick(contributor)}
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className={cn("text-xs font-bold text-white", contributorAvatarGradient(contributor.category))}>
            {initials(contributor.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{contributor.name}</p>
          <p className="text-[11px] text-muted-foreground">{contributor.contributorCode}</p>
        </div>
        <AppBadge size="xs" className={contributorCategoryBadge(contributor.category)}>
          {contributorCategoryLabel(contributor.category)}
        </AppBadge>
      </div>

      {!minimal && (
        <>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {contributor.phoneNumber && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/30 text-muted-foreground">
                <Phone className="h-3 w-3 text-indigo-500" />
                <span>{contributor.phoneNumber}</span>
              </div>
            )}
            {contributor.createdAt && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/30 text-muted-foreground">
                <span className="text-[10px]">{formatDate(contributor.createdAt)}</span>
              </div>
            )}
          </div>

          {contributor.address && (
            <div className="flex items-start gap-1.5 pl-2 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-indigo-500" />
              <span className="truncate">{contributor.address}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            <AppButton
              variant="outline"
              className="flex-1 h-9 rounded-xl text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              onClick={() => onEdit(contributor)}
              leftIcon={<Pencil className="h-3.5 w-3.5" />}
            >
              Edit
            </AppButton>
            <AppButton
              variant="outline"
              className="flex-1 h-9 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10"
              onClick={() => onDelete(contributor._id)}
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
        <Skeleton className="h-8 w-8 rounded-full" />
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

export function ContributorMobileCards({
  contributors,
  isLoading,
  minimal,
  onEdit,
  onDelete,
  onRowClick,
}: ContributorMobileCardsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <MobileCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (contributors.length === 0) {
    return (
      <div className="md:hidden">
        <EmptyState
          icon={Search}
          title="No contributors found"
          description="Try adjusting your search or filters"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 md:hidden">
      {contributors.map((c) => (
        <ContributorCard
          key={c._id}
          contributor={c}
          minimal={minimal}
          onEdit={onEdit}
          onDelete={onDelete}
          onRowClick={onRowClick}
        />
      ))}
    </div>
  );
}
