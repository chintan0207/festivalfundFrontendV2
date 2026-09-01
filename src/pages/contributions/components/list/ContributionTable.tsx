import { Banknote, Package, Calendar, Pencil, Receipt, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { formatDate } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { AppBadge } from "@/components/common/AppBadge";
import { RowActionsMenu } from "@/components/common/RowActionsMenu";
import { StatusBadgeSelect } from "@/components/common/StatusBadgeSelect";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import {
  contributionStatusBadge,
  contributionStatusLabel,
  contributionStatusOptions,
  contributionStatusTransitions,
  contributionTypeBadge,
  contributionTypeLabel,
} from "../../lib/contributionMeta";
import { categoryBadge, categoryLabel } from "@/lib/categoryMeta";
import { contributionFestivalLabel, formatContributionAmount } from "@/lib/contributionFormat";
import { StatusConfirmDialog } from "../StatusConfirmDialog";
import type { ContributionListItem, ContributionStatus } from "@/types/Types";

interface ContributionTableProps {
  contributions: ContributionListItem[];
  isLoading: boolean;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (contribution: ContributionListItem) => void;
  onDelete: (id: string) => void;
  onRowClick: (contribution: ContributionListItem) => void;
  onStatusChange: (id: string, status: ContributionStatus, reason?: string) => Promise<unknown> | void;
  onDownloadSlip: (id: string) => void;
  isStatusPending?: boolean;
  isSlipPending?: boolean;
}

export function ContributionTable({
  contributions,
  isLoading,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onRowClick,
  onStatusChange,
  onDownloadSlip,
  isStatusPending,
  isSlipPending,
}: ContributionTableProps) {
  const theme = getModuleTheme("contributions");
  const isAdmin = useIsOrgAdmin();
  const [statusTarget, setStatusTarget] = useState<{
    contribution: ContributionListItem;
    status: ContributionStatus;
  } | null>(null);

  const columns: Column<ContributionListItem>[] = [
    {
      id: "contributionCode",
      label: "Code",
      sortable: true,
      className: `font-mono font-bold ${theme.iconColor} text-[11px]`,
      render: (c) => c.contributionCode,
    },
    {
      id: "name",
      label: "Contributor",
      sortable: true,
      render: (c) => (
        <div>
          <p className="font-bold text-foreground">{c.contributor?.name || "—"}</p>
          {c.contributor?.phoneNumber && (
            <a
              href={`tel:${c.contributor.phoneNumber}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-muted-foreground hover:text-indigo-600 transition-colors underline decoration-dotted underline-offset-2"
              title="Click to call"
            >
              📞 {c.contributor.phoneNumber}
            </a>
          )}
        </div>
      ),
    },
    {
      id: "category",
      label: "Category",
      sortable: false,
      render: (c) => (
        <AppBadge size="xs" className={categoryBadge(c.contributor?.category)}>
          {categoryLabel(c.contributor?.category)}
        </AppBadge>
      ),
    },
    {
      id: "festival",
      label: "Festival",
      sortable: false,
      render: (c) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3 w-3 shrink-0" />
          <span className="truncate">{contributionFestivalLabel(c)}</span>
        </div>
      ),
    },
    {
      id: "type",
      label: "Type",
      sortable: true,
      render: (c) => (
        <span className="inline-flex items-center gap-1">
          {c.type === "MONEY" ? (
            <Banknote className={`h-3 w-3 ${theme.iconColor}`} />
          ) : (
            <Package className={`h-3 w-3 ${theme.iconColor}`} />
          )}
          <AppBadge size="xs" className={contributionTypeBadge(c.type)}>
            {contributionTypeLabel(c.type)}
          </AppBadge>
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (c) => (
        <div onClick={(e) => e.stopPropagation()}>
          {isAdmin ? (
            <StatusBadgeSelect
              status={c.status}
              options={contributionStatusOptions}
              transitions={contributionStatusTransitions[c.status]}
              badgeClass={contributionStatusBadge}
              labelOf={contributionStatusLabel}
              onRequestStatus={(value) =>
                setStatusTarget({ contribution: c, status: value as ContributionStatus })
              }
              disabled={isStatusPending}
              align="start"
            />
          ) : (
            <AppBadge size="sm" className={contributionStatusBadge(c.status)}>
              {contributionStatusLabel(c.status)}
            </AppBadge>
          )}
        </div>
      ),
    },
    {
      id: "date",
      label: "Date",
      sortable: true,
      className: "text-muted-foreground text-[11px]",
      render: (c) => (c.date ? formatDate(c.date) : "—"),
    },
    {
      id: "amount",
      label: "Amount",
      sortable: true,
      className: "font-extrabold text-foreground text-right whitespace-nowrap",
      render: (c) => formatContributionAmount(c),
    },
    {
      id: "actions",
      label: "",
      sortable: false,
      render: (c) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <RowActionsMenu
            actions={[
              {
                key: "view",
                label: "View",
                icon: <Eye className="h-3.5 w-3.5" />,
                onSelect: () => onRowClick(c),
              },
              {
                key: "edit",
                label: "Edit",
                icon: <Pencil className="h-3.5 w-3.5" />,
                show: isAdmin && c.status === "PENDING",
                onSelect: () => onEdit(c),
              },
              {
                key: "slip",
                label: "Download Slip",
                icon: <Receipt className="h-3.5 w-3.5" />,
                show: c.status === "DEPOSITED",
                disabled: isSlipPending,
                onSelect: () => onDownloadSlip(c._id),
              },
              {
                key: "delete",
                label: "Delete",
                icon: <Trash2 className="h-3.5 w-3.5" />,
                variant: "destructive",
                separatorBefore: true,
                show: isAdmin && c.status !== "DEPOSITED",
                onSelect: () => onDelete(c._id),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={contributions}
        keyExtractor={(c) => c._id}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}
        isLoading={isLoading}
        onRowClick={onRowClick}
        emptyTitle="No contributions found"
        emptyDescription="Try adjusting your search or filters"
        module="contributions"
      />

      <StatusConfirmDialog
        open={!!statusTarget}
        contribution={statusTarget?.contribution ?? null}
        nextStatus={statusTarget?.status ?? "PENDING"}
        loading={isStatusPending}
        onConfirm={async (reason) => {
          if (statusTarget) {
            try {
              await onStatusChange(statusTarget.contribution._id, statusTarget.status, reason);
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