import { Banknote, Package, Calendar } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { AppBadge } from "@/components/common/AppBadge";
import { getModuleTheme } from "@/theme/colors";
import { StatusBadgeSelect } from "@/components/common/StatusBadgeSelect";
import { DetailStatsRow } from "@/components/common/DetailStatsRow";
import {
  contributionPaymentLabel,
  contributionStatusBadge,
  contributionStatusLabel,
  contributionStatusOptions,
  contributionStatusTransitions,
  contributionTypeBadge,
  contributionTypeLabel,
} from "../../lib/contributionMeta";
import { formatContributionAmount } from "@/lib/contributionFormat";
import type { ContributionListItem, ContributionStatus } from "@/types/Types";

export function ContributionDetailHeader({
  contribution,
  onRequestStatus,
}: {
  contribution: ContributionListItem;
  onRequestStatus?: (status: ContributionStatus) => void;
}) {
  const theme = getModuleTheme("contributions");
  const isCash = contribution.type === "MONEY";

  return (
    <div className="rounded-2xl bg-card border border-border/80 shadow-sm overflow-hidden">
      <div className="p-3.5 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md",
                theme.gradient
              )}
            >
              {isCash ? <Banknote className="h-5 w-5 sm:h-6 sm:w-6" /> : <Package className="h-5 w-5 sm:h-6 sm:w-6" />}
            </div>
            <div>
              <h1 className={`font-mono font-bold text-sm sm:text-lg ${theme.iconColor}`}>
                {contribution.contributionCode}
              </h1>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                {contributionTypeLabel(contribution.type)} contribution
              </p>
            </div>
          </div>

          {onRequestStatus ? (
            <StatusBadgeSelect
              status={contribution.status}
              options={contributionStatusOptions}
              transitions={contributionStatusTransitions[contribution.status]}
              badgeClass={contributionStatusBadge}
              labelOf={contributionStatusLabel}
              onRequestStatus={(value) => onRequestStatus(value as ContributionStatus)}
              size="md"
              align="end"
            />
          ) : (
            <AppBadge size="sm" className={contributionStatusBadge(contribution.status)}>
              {contributionStatusLabel(contribution.status)}
            </AppBadge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
          {contribution.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 shrink-0" />
              {formatDate(contribution.date)}
            </span>
          )}
          <span>Mode: {contributionPaymentLabel(contribution.paymentMode)}</span>
          {contribution.isBalanceApplied && <span>Balance applied</span>}
        </div>
      </div>

      <DetailStatsRow
        stats={[
          { label: "Type", value: contributionTypeLabel(contribution.type) },
          { label: "Amount", value: formatContributionAmount(contribution) },
          isCash
            ? { label: "Payment", value: contributionPaymentLabel(contribution.paymentMode) }
            : {
                label: "Quantity",
                value: contribution.quantity ? String(contribution.quantity) : "—",
              },
          { label: "Status", value: contributionStatusLabel(contribution.status) },
        ]}
      />

      {!isCash && contribution.itemName && (
        <div className="px-3.5 sm:px-6 pb-3.5 sm:pb-4">
          <AppBadge size="xs" className={contributionTypeBadge("ITEM")}>
            {contribution.itemName}
          </AppBadge>
        </div>
      )}
    </div>
  );
}