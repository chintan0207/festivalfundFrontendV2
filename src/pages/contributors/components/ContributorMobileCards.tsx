import { Phone, Pencil, Trash2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, initials, formatDate } from "@/lib/utils";
import { badgeColors, gradientColors } from "@/theme/colors";
import type { Contributor } from "@/types/Types";

const categoryStyles: Record<string, string> = {
  PARENT: badgeColors.parents,
  BOY: badgeColors.boys,
  GIRL: badgeColors.girls,
};

const avatarGradient: Record<string, string> = {
  PARENT: gradientColors[2],
  BOY: gradientColors[1],
  GIRL: gradientColors[0],
};

const categoryLabels: Record<string, string> = {
  PARENT: "Parents",
  BOY: "Boys",
  GIRL: "Girls",
};

interface ContributorMobileCardsProps {
  contributors: Contributor[];
  isLoading: boolean;
  onEdit: (contributor: Contributor) => void;
  onDelete: (id: string) => void;
  onRowClick: (contributor: Contributor) => void;
}

function ContributorCard({
  contributor,
  onEdit,
  onDelete,
  onRowClick,
}: {
  contributor: Contributor;
  onEdit: (c: Contributor) => void;
  onDelete: (id: string) => void;
  onRowClick: (c: Contributor) => void;
}) {
  return (
    <div
      className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3 cursor-pointer active:scale-[0.99] transition-transform"
      onClick={() => onRowClick(contributor)}
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className={cn("text-xs font-bold text-white", avatarGradient[contributor.category] || gradientColors[5])}>
            {initials(contributor.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{contributor.name}</p>
          <p className="text-[11px] text-muted-foreground">{contributor.contributorCode}</p>
        </div>
        <span
          className={cn(
            "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
            categoryStyles[contributor.category] || "bg-muted text-muted-foreground",
          )}
        >
          {categoryLabels[contributor.category] || contributor.category}
        </span>
      </div>

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
        <p className="text-[11px] text-muted-foreground truncate">{contributor.address}</p>
      )}

      <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onEdit(contributor)}
          className="flex-1 py-2 rounded-xl text-xs font-semibold border border-border/80 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(contributor._id)}
          className="flex-1 py-2 rounded-xl text-xs font-semibold border border-border/80 text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
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
      <div className="md:hidden px-4 py-12 text-center">
        <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">No contributors found</p>
        <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:hidden">
      {contributors.map((c) => (
        <ContributorCard
          key={c._id}
          contributor={c}
          onEdit={onEdit}
          onDelete={onDelete}
          onRowClick={onRowClick}
        />
      ))}
    </div>
  );
}
