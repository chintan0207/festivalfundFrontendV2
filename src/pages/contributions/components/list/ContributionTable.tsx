import { Banknote, Package, Pencil, Trash2, Calendar } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { formatDate } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import {
  contributionCategoryBadge,
  contributionCategoryLabel,
  contributionStatusBadge,
  contributionStatusLabel,
  contributionTypeBadge,
  contributionTypeLabel,
} from "../../lib/contributionMeta";
import { contributionFestivalLabel, formatContributionAmount } from "@/lib/contributionFormat";
import type { ContributionListItem } from "@/types/Types";

interface ContributionTableProps {
  contributions: ContributionListItem[];
  isLoading: boolean;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (contribution: ContributionListItem) => void;
  onDelete: (id: string) => void;
  onRowClick: (contribution: ContributionListItem) => void;
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
}: ContributionTableProps) {
  const theme = getModuleTheme("contributions");

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
      render: (c) => (
        <AppBadge size="xs" className={contributionStatusBadge(c.status)}>
          {contributionStatusLabel(c.status)}
        </AppBadge>
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
        <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
          <AppButton
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            onClick={() => onEdit(c)}
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </AppButton>
          <AppButton
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500"
            onClick={() => onDelete(c._id)}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </AppButton>
        </div>
      ),
    },
  ];

  return (
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
  );
}
