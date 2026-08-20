import { Phone, Pencil, Trash2, Eye } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { formatDate } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import { AppBadge } from "@/components/common/AppBadge";
import { RowActionsMenu } from "@/components/common/RowActionsMenu";
import { categoryBadge, categoryLabel } from "@/lib/categoryMeta";
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
  const isAdmin = useIsOrgAdmin();

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
        <AppBadge size="xs" className={categoryBadge(c.category)}>
          {categoryLabel(c.category)}
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
                show: isAdmin,
                onSelect: () => onEdit(c),
              },
              {
                key: "delete",
                label: "Delete",
                icon: <Trash2 className="h-3.5 w-3.5" />,
                variant: "destructive",
                separatorBefore: true,
                show: isAdmin,
                onSelect: () => onDelete(c._id),
              },
            ]}
          />
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
