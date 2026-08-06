import { Banknote, Package, ChevronDown, MoreVertical, Pencil, Receipt, Trash2, Search, Eye } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/common/EmptyState";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getModuleTheme, categoryAvatarGradient } from "@/theme/colors";
import {
  contributionStatusBadge,
  contributionStatusLabel,
  contributionStatusOptions,
} from "../../lib/contributionMeta";
import { contributorInitials, formatContributionAmount } from "@/lib/contributionFormat";
import { StatusConfirmDialog } from "./StatusConfirmDialog";
import type { ContributionListItem, ContributionStatus } from "@/types/Types";

interface ContributionMobileCardsProps {
  contributions: ContributionListItem[];
  isLoading: boolean;
  minimal?: boolean;
  onEdit: (contribution: ContributionListItem) => void;
  onDelete: (id: string) => void;
  onRowClick: (contribution: ContributionListItem) => void;
  onStatusChange: (id: string, status: ContributionStatus, reason?: string) => void;
  onDownloadSlip: (id: string) => void;
  isStatusPending?: boolean;
  isSlipPending?: boolean;
}

function StatusDropdown({
  status,
  disabled,
  onRequestStatus,
}: {
  status: ContributionStatus;
  disabled?: boolean;
  onRequestStatus: (status: ContributionStatus) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-opacity",
            contributionStatusBadge(status),
            "hover:opacity-80 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          )}
          disabled={disabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {contributionStatusLabel(status)}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-xl p-1.5">
        {contributionStatusOptions.map((opt) => {
          const allowed =
            status === "PENDING" ||
            (status === "DEPOSITED" && opt.value === "PENDING");
          if (!allowed) return null;
          return (
            <DropdownMenuItem
              key={opt.value}
              disabled={opt.value === status}
              onSelect={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onRequestStatus(opt.value as ContributionStatus);
              }}
              className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", contributionStatusBadge(opt.value))} />
                {opt.label}
              </span>
              {opt.value === status && <span className="ml-auto text-muted-foreground">✓</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MoreMenu({
  onEdit,
  onDelete,
  isSlipPending,
  onDownloadSlip,
  onView,
  isDeposited,
}: {
  onEdit: () => void;
  onDelete: () => void;
  isSlipPending?: boolean;
  onDownloadSlip: () => void;
  onView: () => void;
  isDeposited: boolean;
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
        {!isDeposited && (
          <DropdownMenuItem
            onSelect={onEdit}
            className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={onDownloadSlip}
          disabled={isSlipPending}
          className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
        >
          <Receipt className="h-3.5 w-3.5" />
          Download Slip
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isDeposited}
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
  const isCash = contribution.type === "MONEY";
  const category = contribution.contributor?.category;
  const amount = formatContributionAmount(contribution);
  const valueLabel =
    minimal && amount === "—" && contribution.itemName ? contribution.itemName : amount;

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
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Avatar size="default" className="h-8 w-8">
                <AvatarFallback
                  className={cn("rounded-full text-white text-[11px] font-bold", categoryAvatarGradient(category))}
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

            <p className="text-sm font-extrabold text-foreground whitespace-nowrap text-center">
              {valueLabel}
            </p>

            <StatusDropdown
              status={contribution.status}
              disabled={isStatusPending}
              onRequestStatus={(s) => onRequestStatus(s)}
            />

            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <MoreMenu
                onEdit={() => onEdit(contribution)}
                onDelete={() => onDelete(contribution._id)}
                onDownloadSlip={() => onDownloadSlip(contribution._id)}
                onView={() => onView(contribution)}
                isSlipPending={isSlipPending}
                isDeposited={contribution.status === "DEPOSITED"}
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
                    categoryAvatarGradient(category)
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

              <StatusDropdown
                status={contribution.status}
                disabled={isStatusPending}
                onRequestStatus={(s) => onRequestStatus(s)}
              />
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              {isCash ? (
                <Banknote className={`h-3 w-3 ${theme.iconColor}`} />
              ) : (
                <Package className={`h-3 w-3 ${theme.iconColor}`} />
              )}
              <span className="text-[11px]">
                {isCash ? "Cash" : contribution.itemName || "Item"}
              </span>
              {contribution.date && (
                <span className="text-[11px] text-muted-foreground/70 ml-auto">
                  {formatDate(contribution.date)}
                </span>
              )}
            </div>

            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="text-base font-extrabold text-foreground break-words">{amount}</p>
              </div>

              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                <MoreMenu
                  onEdit={() => onEdit(contribution)}
                  onDelete={() => onDelete(contribution._id)}
                  onDownloadSlip={() => onDownloadSlip(contribution._id)}
                  onView={() => onView(contribution)}
                  isSlipPending={isSlipPending}
                  isDeposited={contribution.status === "DEPOSITED"}
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
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <Skeleton className="h-8 rounded-lg" />
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
        onConfirm={(reason) => {
          if (statusTarget) {
            onStatusChange(statusTarget.contribution._id, statusTarget.status, reason);
          }
        }}
        onCancel={() => setStatusTarget(null)}
      />
    </>
  );
}