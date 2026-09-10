import { useState } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilterToolbar, type FilterTab } from "@/components/common/PageFilterToolbar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { AppBadge } from "@/components/common/AppBadge";
import { useSuperAdminFestivals } from "@/api/superAdmin/useSuperAdmin";
import type { SuperAdminFestival } from "@/api/superAdmin/superAdmin.service";
import { Calendar, Building2 } from "lucide-react";
import { formatINR } from "@/lib/utils";

export const SuperAdminFestivalsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const { data, isLoading } = useSuperAdminFestivals({
    page,
    limit,
    search,
    status,
  });

  const festivals = data?.festivals || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const filterTabs: FilterTab[] = [
    { id: "ALL", label: "All Festivals" },
    { id: "ACTIVE", label: "Active" },
    { id: "UPCOMING", label: "Upcoming" },
    { id: "COMPLETED", label: "Completed" },
    { id: "ARCHIVED", label: "Archived" },
  ];

  const columns: Column<SuperAdminFestival>[] = [
    {
      id: "festival",
      label: "Festival / Event",
      className: "font-semibold min-w-[200px]",
      render: (f) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold flex items-center justify-center text-xs shrink-0 border border-pink-500/20">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-foreground font-semibold truncate">{f.name}</span>
            <span className="text-2xs text-muted-foreground">{f.year} · {f.category || "General"}</span>
          </div>
        </div>
      ),
    },
    {
      id: "organization",
      label: "Organization / Trust",
      className: "min-w-[180px]",
      render: (f) =>
        f.organizationId ? (
          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate max-w-[170px]">{f.organizationId.name}</span>
          </div>
        ) : (
          <span className="text-2xs text-muted-foreground italic">Unknown</span>
        ),
    },
    {
      id: "status",
      label: "Status",
      className: "w-28 text-center",
      render: (f) => (
        <AppBadge
          size="sm"
          className={
            f.status === "ACTIVE"
              ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-semibold"
              : f.status === "UPCOMING"
                ? "bg-sky-500/15 text-sky-600 border-sky-500/30"
                : f.status === "COMPLETED"
                  ? "bg-purple-500/15 text-purple-600 border-purple-500/30"
                  : "bg-muted text-muted-foreground"
          }
        >
          {f.status}
        </AppBadge>
      ),
    },
    {
      id: "finances",
      label: "Collected / Expenses",
      className: "w-44 text-right tabular-nums",
      render: (f) => (
        <div className="flex flex-col text-right">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            ₹{formatINR(f.stats?.totalCollected || 0)}
          </span>
          <span className="text-2xs text-rose-500">
            - ₹{formatINR(f.stats?.totalExpenses || 0)}
          </span>
        </div>
      ),
    },
    {
      id: "balance",
      label: "Net Balance",
      className: "w-32 text-right font-black tabular-nums",
      render: (f) => (
        <span className="text-foreground">
          ₹{formatINR((f.stats?.totalCollected || 0) - (f.stats?.totalExpenses || 0))}
        </span>
      ),
    },
    {
      id: "contributors",
      label: "Contributors",
      className: "w-24 text-center text-2xs font-semibold text-muted-foreground",
      render: (f) => f.stats?.contributorsCount || 0,
    },
  ];

  return (
    <PageContainer variant="list">
      <PageHeader
        title="Festivals Monitor"
        description="Real-time cross-tenant overview of all ongoing, upcoming, and past community festivals."
        module="festivals"
        badge={`${pagination.total} Festivals`}
      />

      <PageFilterToolbar
        searchPlaceholder="Search festivals by name, category, location..."
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        tabs={filterTabs}
        activeTab={status}
        onTabChange={(tab) => {
          setStatus(tab);
          setPage(1);
        }}
        onResetAll={() => {
          setSearch("");
          setStatus("ALL");
          setPage(1);
        }}
      />

      <DataTable
        columns={columns}
        data={festivals}
        keyExtractor={(f) => f._id}
        isLoading={isLoading}
        emptyTitle="No festivals found"
        emptyDescription="No festivals match the active search filters."
        module="festivals"
      />

      {pagination.totalPages > 1 && (
        <DataTablePagination
          page={page}
          totalPages={pagination.totalPages}
          limit={limit}
          total={pagination.total}
          onPageChange={setPage}
          onLimitChange={(newLimit: number) => {
            setLimit(newLimit);
            setPage(1);
          }}
          module="festivals"
        />
      )}
    </PageContainer>
  );
};

export default SuperAdminFestivalsPage;
