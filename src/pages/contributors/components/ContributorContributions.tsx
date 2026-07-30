import { Banknote, Package, Calendar, Tag } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { cn, formatDate } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { EmptyState } from "@/components/common/EmptyState";
import type { Contribution } from "@/types/Types";

const statusStyles: Record<string, string> = {
  DEPOSITED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const typeStyles: Record<string, string> = {
  CASH: "text-emerald-600 dark:text-emerald-400",
  ITEM: "text-indigo-600 dark:text-indigo-400",
};

export function ContributorContributions({
  contributions,
  isLoading,
  module = "contributors",
}: {
  contributions: Contribution[];
  isLoading: boolean;
  module?: string;
}) {
  const theme = getModuleTheme(module);

  const columns: Column<Contribution>[] = [
    {
      id: "contributionCode",
      label: "Code",
      sortable: true,
      className: "font-mono font-bold text-indigo-600 text-[11px]",
      render: (c) => c.contributionCode,
    },
    {
      id: "festival",
      label: "Festival",
      sortable: true,
      render: (c) => {
        const fest = typeof c.festivalId === "object" ? c.festivalId : null;
        return (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">
              {fest ? `${fest.name} ${fest.year || ""}` : "—"}
            </span>
          </div>
        );
      },
    },
    {
      id: "type",
      label: "Type",
      sortable: true,
      render: (c) => (
        <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", typeStyles[c.type])}>
          {c.type === "CASH" ? <Banknote className="h-3 w-3" /> : <Package className="h-3 w-3" />}
          {c.type}
        </span>
      ),
    },
    {
      id: "amount",
      label: "Amount",
      sortable: true,
      className: "font-semibold text-foreground",
      render: (c) => {
        if (c.type === "CASH" && c.amount) return `₹${c.amount.toLocaleString("en-IN")}`;
        if (c.type === "ITEM" && c.estimatedValue) return `₹${c.estimatedValue.toLocaleString("en-IN")}`;
        return "—";
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
      id: "status",
      label: "Status",
      sortable: true,
      render: (c) => (
        <span
          className={cn(
            "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold",
            statusStyles[c.status] || "bg-muted text-muted-foreground",
          )}
        >
          {c.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-foreground">Contributions</h2>
        <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-semibold", theme.badgeColor)}>
          {contributions.length}
        </span>
      </div>

      <DataTable
        columns={columns}
        data={contributions}
        keyExtractor={(c) => c._id}
        sortField="date"
        sortOrder="desc"
        isLoading={isLoading}
        emptyTitle="No contributions found"
        emptyDescription="This contributor has not made any contributions yet."
        module={module}
      />

      {!isLoading && contributions.length === 0 && (
        <EmptyState
          icon={Tag}
          title="No contributions yet"
          description="Contributions made by this donor will appear here."
        />
      )}
    </div>
  );
}
