import { MapPin, Phone, Mail, Search, Pencil, Trash2, Eye } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, initials, formatDate } from "@/lib/utils";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import { AppBadge } from "@/components/common/AppBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { RowActionsMenu } from "@/components/common/RowActionsMenu";
import { CardListSkeleton } from "@/components/common/CardListSkeleton";
import { categoryAvatarGradient, categoryBadge, categoryLabel } from "@/lib/categoryMeta";
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
  const isAdmin = useIsOrgAdmin();
  const actionsMenu = (
    <RowActionsMenu
      actions={[
        {
          key: "view",
          label: "View",
          icon: <Eye className="h-3.5 w-3.5" />,
          onSelect: () => onRowClick(contributor),
        },
        {
          key: "edit",
          label: "Edit",
          icon: <Pencil className="h-3.5 w-3.5" />,
          show: isAdmin,
          onSelect: () => onEdit(contributor),
        },
        {
          key: "delete",
          label: "Delete",
          icon: <Trash2 className="h-3.5 w-3.5" />,
          variant: "destructive",
          separatorBefore: true,
          show: isAdmin,
          onSelect: () => onDelete(contributor._id),
        },
      ]}
    />
  );

  return (
    <div
      className={cn(
        "rounded-2xl bg-card border border-border/80 shadow-xs transition-transform overflow-hidden",
        !minimal && "group",
      )}
    >
      <div
        className={cn(minimal ? "p-3" : "p-3.5", minimal ? "space-y-2" : "space-y-2.5")}
      >
        {minimal ? (
          <div className="flex items-center gap-3">
            <Avatar size="default" className="h-8 w-8">
              <AvatarFallback
                className={cn(
                  "rounded-full text-white text-[11px] font-bold",
                  categoryAvatarGradient(contributor.category),
                )}
              >
                {initials(contributor.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-foreground truncate">
                {contributor.name}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground truncate">
                {contributor.contributorCode}
              </p>
            </div>
            <AppBadge size="xs" className={categoryBadge(contributor.category)}>
              {categoryLabel(contributor.category)}
            </AppBadge>
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              {actionsMenu}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <Avatar size="default" className="h-9 w-9 rounded-xl">
                <AvatarFallback
                  className={cn(
                    "rounded-lg text-white text-xs font-bold",
                    categoryAvatarGradient(contributor.category),
                  )}
                >
                  {initials(contributor.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {contributor.name}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {contributor.contributorCode}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <AppBadge size="xs" className={categoryBadge(contributor.category)}>
                  {categoryLabel(contributor.category)}
                </AppBadge>
                <div onClick={(e) => e.stopPropagation()}>
                  {actionsMenu}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pl-[10px]">
              {contributor.phoneNumber && (
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`tel:${contributor.phoneNumber}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-indigo-600 transition-colors"
                  >
                    <Phone className="h-3 w-3 text-indigo-500 shrink-0" />
                    <span className="text-[11px] underline decoration-dotted underline-offset-2">{contributor.phoneNumber}</span>
                  </a>
                  {contributor.createdAt && (
                    <span className="text-[11px] text-muted-foreground/70">
                      {formatDate(contributor.createdAt)}
                    </span>
                  )}
                </div>
              )}

              {contributor.email && (
                <a
                  href={`mailto:${contributor.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-indigo-600 transition-colors"
                >
                  <Mail className="h-3 w-3 shrink-0 text-indigo-500" />
                  <span className="text-[11px] truncate underline decoration-dotted underline-offset-2">{contributor.email}</span>
                </a>
              )}

              {contributor.address && (
                <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-indigo-500" />
                  <span className="truncate">{contributor.address}</span>
                </div>
              )}
            </div>
          </>
        )}
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
    return <CardListSkeleton />;
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