import { Phone, Pencil, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { formatDate } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { contributorCategoryBadge, contributorCategoryLabel } from "../../lib/contributorMeta";
import type { Contributor } from "@/types/Types";

interface ContributorTableProps {
  contributors: Contributor[];
  isLoading: boolean;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (contributor: Contributor) => void;
  onDelete: (id: string) => void;
  onRowClick: (contributor: Contributor) => void;
}

export function ContributorTable({
  contributors,
  isLoading,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onRowClick,
}: ContributorTableProps) {
  const theme = getModuleTheme("contributors");

  const columns: Column<Contributor>[] = [
    {
      id: "contributorCode",
      label: "Code",
      sortable: true,
      className: `font-mono font-bold ${theme.iconColor}`,
      render: (c) => c.contributorCode,
    },
    {
      id: "name",
      label: "Contributor",
      sortable: true,
      render: (c) => (
        <div>
          <p className="font-bold text-foreground">{c.name}</p>
          {c.email && <p className="text-[11px] text-muted-foreground">{c.email}</p>}
        </div>
      ),
    },
    {
      id: "category",
      label: "Category",
      sortable: true,
      render: (c) => (
        <AppBadge size="xs" className={contributorCategoryBadge(c.category)}>
          {contributorCategoryLabel(c.category)}
        </AppBadge>
      ),
    },
    {
      id: "phoneNumber",
      label: "Contact",
      sortable: false,
      render: (c) =>
        c.phoneNumber ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Phone className="h-3 w-3 text-indigo-500" />
            <span>{c.phoneNumber}</span>
          </div>
        ) : null,
    },
    {
      id: "createdAt",
      label: "Created",
      sortable: true,
      className: "text-muted-foreground text-[11px]",
      render: (c) => (c.createdAt ? formatDate(c.createdAt) : "-"),
    },
    {
      id: "actions",
      label: "",
      sortable: false,
      render: (c) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
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
      data={contributors}
      keyExtractor={(c) => c._id}
      sortField={sortField}
      sortOrder={sortOrder}
      onSort={onSort}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyTitle="No contributors found"
      emptyDescription="Try adjusting your search or filters"
      module="contributors"
    />
  );
}
