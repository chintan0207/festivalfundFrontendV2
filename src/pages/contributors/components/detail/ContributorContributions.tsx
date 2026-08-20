import { Banknote, Package, Calendar } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { cn, formatDate } from "@/lib/utils";
import { AppBadge } from "@/components/common/AppBadge";
import { ContributionsSectionHeading } from "./ContributionsSectionHeading";
import {
  contributionFestivalLabel,
  contributionStatusBadge,
  contributionTypeStyles,
  formatContributionAmount,
} from "@/lib/contributionFormat";
import type { Contribution } from "@/types/Types";

export function ContributorContributions({
  contributions,
  isLoading,
  onRowClick,
  module = "contributors",
}: {
  contributions: Contribution[];
  isLoading: boolean;
  onRowClick?: (contribution: Contribution) => void;
  module?: string;
}) {
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
      render: (c) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">{contributionFestivalLabel(c)}</span>
        </div>
      ),
    },
    {
      id: "type",
      label: "Type",
      sortable: true,
      render: (c) => (
        <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", contributionTypeStyles[c.type])}>
          {c.type === "MONEY" ? <Banknote className="h-3 w-3" /> : <Package className="h-3 w-3" />}
          {c.type}
        </span>
      ),
    },
    {
      id: "amount",
      label: "Amount",
      sortable: true,
      className: "font-semibold text-foreground",
      render: (c) => formatContributionAmount(c),
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
        <AppBadge size="xs" className={contributionStatusBadge(c.status)}>
          {c.status}
        </AppBadge>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <ContributionsSectionHeading count={contributions.length} />

      <DataTable
        columns={columns}
        data={contributions}
        keyExtractor={(c) => c._id}
        sortField="date"
        sortOrder="desc"
        isLoading={isLoading}
        onRowClick={onRowClick}
        emptyTitle="No contributions found"
        emptyDescription="This contributor has not made any contributions yet."
        module={module}
      />
    </div>
  );
}
