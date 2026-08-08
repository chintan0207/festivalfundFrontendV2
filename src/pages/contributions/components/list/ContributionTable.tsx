import { Banknote, Package, Calendar, MoreVertical, Pencil, Receipt, Trash2, ChevronDown, Eye } from "lucide-react";
import { useState } from "react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { formatDate, cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { AppBadge } from "@/components/common/AppBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  contributionCategoryBadge,
  contributionCategoryLabel,
  contributionStatusBadge,
  contributionStatusLabel,
  contributionStatusOptions,
  contributionStatusTransitions,
  contributionTypeBadge,
  contributionTypeLabel,
} from "../../lib/contributionMeta";
import { contributionFestivalLabel, formatContributionAmount } from "@/lib/contributionFormat";
import { StatusConfirmDialog } from "./StatusConfirmDialog";
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
            <p className="text-[11px] text-muted-foreground">{c.contributor.phoneNumber}</p>
          )}
        </div>
      ),
    },
    {
      id: "category",
      label: "Category",
      sortable: false,
      render: (c) => (
        <AppBadge size="xs" className={contributionCategoryBadge(c.contributor?.category)}>
          {contributionCategoryLabel(c.contributor?.category)}
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
      render: (c) => {
        const transitions = contributionStatusTransitions[c.status] ?? [];
        if (transitions.length === 0) {
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                contributionStatusBadge(c.status),
              )}
            >
              {contributionStatusLabel(c.status)}
            </span>
          );
        }
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-opacity",
                    contributionStatusBadge(c.status),
                    "hover:opacity-80 active:scale-95 cursor-pointer disabled:opacity-60"
                  )}
                  disabled={isStatusPending}
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {contributionStatusLabel(c.status)}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 rounded-xl p-1.5">
                {contributionStatusOptions
                  .filter((opt) => transitions.includes(opt.value))
                  .map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      disabled={opt.value === c.status}
                      onSelect={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setStatusTarget({ contribution: c, status: opt.value as ContributionStatus });
                      }}
                      className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", contributionStatusBadge(opt.value))} />
                        {opt.label}
                      </span>
                      {opt.value === c.status && <span className="ml-auto text-muted-foreground">✓</span>}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
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
                onSelect={() => onRowClick(c)}
                className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </DropdownMenuItem>
              {c.status === "PENDING" && (
                <DropdownMenuItem
                  onSelect={() => onEdit(c)}
                  className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </DropdownMenuItem>
              )}
              {c.status === "DEPOSITED" && (
                <DropdownMenuItem
                  onSelect={() => onDownloadSlip(c._id)}
                  disabled={isSlipPending}
                  className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  Download Slip
                </DropdownMenuItem>
              )}
              {c.status !== "DEPOSITED" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => onDelete(c._id)}
                    className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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