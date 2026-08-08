import { MapPin, Phone, MoreVertical, Pencil, Trash2, Search, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, initials, formatDate } from "@/lib/utils";
import { AppBadge } from "@/components/common/AppBadge";
import { EmptyState } from "@/components/common/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function MoreMenu({
  onEdit,
  onDelete,
  onView,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="More actions"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground flex items-center justify-center transition-all active:scale-95 cursor-pointer"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5">
        <DropdownMenuItem
          onSelect={onView}
          className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={onEdit}
          className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={onDelete}
          className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
        "rounded-2xl bg-card border border-border/80 shadow-xs transition-transform overflow-hidden",
        !minimal && "group"
      )}
    >
      <div className={cn(minimal ? "p-3" : "p-3.5", minimal ? "space-y-2" : "space-y-2.5")}>
        {minimal ? (
          <div className="flex items-center gap-3">
            <Avatar size="default" className="h-8 w-8">
              <AvatarFallback
                className={cn("rounded-full text-white text-[11px] font-bold", contributorAvatarGradient(contributor.category))}
              >
                {initials(contributor.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-foreground truncate">{contributor.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground truncate">
                {contributor.contributorCode}
              </p>
            </div>
            <AppBadge size="xs" className={contributorCategoryBadge(contributor.category)}>
              {contributorCategoryLabel(contributor.category)}
            </AppBadge>
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <MoreMenu
                onEdit={() => onEdit(contributor)}
                onDelete={() => onDelete(contributor._id)}
                onView={() => onRowClick(contributor)}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <Avatar size="default" className="h-9 w-9 rounded-xl">
                <AvatarFallback
                  className={cn(
                    "rounded-lg text-white text-xs font-bold",
                    contributorAvatarGradient(contributor.category)
                  )}
                >
                  {initials(contributor.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{contributor.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {contributor.contributorCode}
                </p>
              </div>

              <AppBadge size="xs" className={contributorCategoryBadge(contributor.category)}>
                {contributorCategoryLabel(contributor.category)}
              </AppBadge>
            </div>

            {contributor.phoneNumber && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-3 w-3 text-indigo-500" />
                <span className="text-[11px]">{contributor.phoneNumber}</span>
                {contributor.createdAt && (
                  <span className="text-[11px] text-muted-foreground/70 ml-auto">
                    {formatDate(contributor.createdAt)}
                  </span>
                )}
              </div>
            )}

            {contributor.address && (
              <div className="flex items-start gap-1.5 pl-0.5 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-indigo-500" />
                <span className="truncate">{contributor.address}</span>
              </div>
            )}

            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                {contributor.email ? (
                  <p className="text-xs font-semibold text-foreground truncate">{contributor.email}</p>
                ) : null}
              </div>

              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                <MoreMenu
                  onEdit={() => onEdit(contributor)}
                  onDelete={() => onDelete(contributor._id)}
                  onView={() => onRowClick(contributor)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MobileCardSkeleton() {
  return (
    <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-2.5">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 rounded-lg" />
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
