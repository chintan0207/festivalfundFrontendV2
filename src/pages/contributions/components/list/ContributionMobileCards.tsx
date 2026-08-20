import {
  Banknote,
  Package,
  Pencil,
  Receipt,
  Trash2,
  Search,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/common/EmptyState";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RowActionsMenu } from "@/components/common/RowActionsMenu";
import { StatusBadgeSelect } from "@/components/common/StatusBadgeSelect";
import { AppBadge } from "@/components/common/AppBadge";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import { CardListSkeleton } from "@/components/common/CardListSkeleton";
import { getModuleTheme } from "@/theme/colors";
import { categoryAvatarGradient } from "@/lib/categoryMeta";
import {
  contributionStatusBadge,
  contributionStatusLabel,
  contributionStatusOptions,
  contributionStatusTransitions,
} from "../../lib/contributionMeta";
import { contributorInitials, formatContributionAmount } from "@/lib/contributionFormat";
import { StatusConfirmDialog } from "../StatusConfirmDialog";
import type { ContributionListItem, ContributionStatus } from "@/types/Types";

interface ContributionMobileCardsProps {
  contributions: ContributionListItem[];
  isLoading: boolean;
  minimal?: boolean;
  onEdit: (contribution: ContributionListItem) => void;
  onDelete: (id: string) => void;
  onRowClick: (contribution: ContributionListItem) => void;
  onStatusChange: (
    id: string,
    status: ContributionStatus,
    reason?: string,
  ) => Promise<unknown> | void;
  onDownloadSlip: (id: string) => void;
  isStatusPending?: boolean;
  isSlipPending?: boolean;
}

function ContributionCard({
  contribution,
  minimal,
  onEdit,
  onDelete,
  onView,
  onRequestStatus,
  onDownloadSlip,
  isStatusPending,
  isSlipPending,
}: {
  contribution: ContributionListItem;
  minimal?: boolean;
  onEdit: (c: ContributionListItem) => void;
  onDelete: (id: string) => void;
  onView: (c: ContributionListItem) => void;
  onRequestStatus: (status: ContributionStatus) => void;
  onDownloadSlip: (id: string) => void;
  isStatusPending?: boolean;
  isSlipPending?: boolean;
}) {
  const theme = getModuleTheme("contributions");
  const isAdmin = useIsOrgAdmin();
  const isCash = contribution.type === "MONEY";
  const category = contribution.contributor?.category;
  const amount = formatContributionAmount(contribution);
  const valueLabel =
    minimal && amount === "—" && contribution.itemName ? contribution.itemName : amount;

  const statusSelect = isAdmin ? (
    <StatusBadgeSelect
      status={contribution.status}
      options={contributionStatusOptions}
      transitions={contributionStatusTransitions[contribution.status]}
      badgeClass={contributionStatusBadge}
      labelOf={contributionStatusLabel}
      onRequestStatus={(s) => onRequestStatus(s as ContributionStatus)}
      disabled={isStatusPending}
      align="end"
    />
  ) : (
    <AppBadge size="sm" className={contributionStatusBadge(contribution.status)}>
      {contributionStatusLabel(contribution.status)}
    </AppBadge>
  );

  const actionsMenu = (
    <RowActionsMenu
      actions={[
        {
          key: "view",
          label: "View",
          icon: <Eye className="h-3.5 w-3.5" />,
          onSelect: () => onView(contribution),
        },
        {
          key: "edit",
          label: "Edit",
          icon: <Pencil className="h-3.5 w-3.5" />,
          show: isAdmin && contribution.status === "PENDING",
          onSelect: () => onEdit(contribution),
        },
        {
          key: "slip",
          label: "Download Slip",
          icon: <Receipt className="h-3.5 w-3.5" />,
          show: contribution.status === "DEPOSITED",
          disabled: isSlipPending,
          onSelect: () => onDownloadSlip(contribution._id),
        },
        {
          key: "delete",
          label: "Delete",
          icon: <Trash2 className="h-3.5 w-3.5" />,
          variant: "destructive",
          separatorBefore: true,
          show: isAdmin && contribution.status !== "DEPOSITED",
          onSelect: () => onDelete(contribution._id),
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
        className={cn(minimal ? "p-2" : "p-3.5", minimal ? "space-y-2" : "space-y-2.5")}
      >
        {minimal ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Avatar size="default" className="h-8 w-8">
                <AvatarFallback
                  className={cn(
                    "rounded-full text-white text-[11px] font-bold",
                    categoryAvatarGradient(category),
                  )}
                >
                  {contributorInitials(contribution.contributor?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-foreground truncate">
                  {contribution.contributor?.name || "—"}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground truncate">
                  {contribution.contributionCode}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <p className="text-sm font-extrabold text-foreground whitespace-nowrap truncate text-center max-w-[45%]">
                {valueLabel}
              </p>

              {statusSelect}
              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                {actionsMenu}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <Avatar size="default" className="h-9 w-9 rounded-xl">
                <AvatarFallback
                  className={cn(
                    "rounded-lg text-white text-xs font-bold",
                    categoryAvatarGradient(category),
                  )}
                >
                  {contributorInitials(contribution.contributor?.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {contribution.contributor?.name || "—"}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {contribution.contributionCode}
                </p>
              </div>

              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                {actionsMenu}
              </div>
            </div>

            <div className="space-y-1.5 pl-[10px]">
              <div className="flex items-center justify-between gap-2 text-muted-foreground">
                <div className="flex items-center gap-1.5 min-w-0">
                  {isCash ? (
                    <Banknote className={`h-3 w-3 shrink-0 ${theme.iconColor}`} />
                  ) : (
                    <Package className={`h-3 w-3 shrink-0 ${theme.iconColor}`} />
                  )}
                  <span className="text-[11px] truncate">
                    {isCash ? "Cash" : contribution.itemName || "Item"}
                  </span>
                </div>
                {contribution.date && (
                  <span className="text-[11px] text-muted-foreground/70">
                    {formatDate(contribution.date)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 ">
                  <p className="text-base font-extrabold text-foreground break-words">
                    {amount}
                  </p>
                </div>

                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                  {statusSelect}
                </div>
              </div>
            </div>
          </>
        )}
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
  onStatusChange,
  onDownloadSlip,
  isStatusPending,
  isSlipPending,
}: ContributionMobileCardsProps) {
  const [statusTarget, setStatusTarget] = useState<{
    contribution: ContributionListItem;
    status: ContributionStatus;
  } | null>(null);

  if (isLoading) {
    return <CardListSkeleton />;
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
    <>
      <div className="space-y-3 md:hidden">
        {contributions.map((c) => (
          <ContributionCard
            key={c._id}
            contribution={c}
            minimal={minimal}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onRowClick}
            onRequestStatus={(status) => setStatusTarget({ contribution: c, status })}
            onDownloadSlip={onDownloadSlip}
            isStatusPending={isStatusPending}
            isSlipPending={isSlipPending}
          />
        ))}
      </div>

      <StatusConfirmDialog
        open={!!statusTarget}
        contribution={statusTarget?.contribution ?? null}
        nextStatus={statusTarget?.status ?? "PENDING"}
        loading={isStatusPending}
        onConfirm={async (reason) => {
          if (statusTarget) {
            try {
              await onStatusChange(
                statusTarget.contribution._id,
                statusTarget.status,
                reason,
              );
              setStatusTarget(null);
            } catch {
              // keep dialog open so the user can retry
            }
          }
        }}
        onCancel={() => setStatusTarget(null)}
      />
    </>
  );
}