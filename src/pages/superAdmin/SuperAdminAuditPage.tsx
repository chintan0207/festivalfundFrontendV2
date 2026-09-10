import { useState } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilterToolbar, type FilterTab, type QuickFilterGroup } from "@/components/common/PageFilterToolbar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { AppBadge } from "@/components/common/AppBadge";
import { FormDialog } from "@/components/common/FormDialog";
import { useSuperAdminAuditLogs } from "@/api/superAdmin/useSuperAdmin";
import type { SuperAdminAuditItem } from "@/api/superAdmin/superAdmin.service";
import { Eye, Clock } from "lucide-react";

export const SuperAdminAuditPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const [inspectItem, setInspectItem] = useState<SuperAdminAuditItem | null>(null);

  const { data, isLoading } = useSuperAdminAuditLogs({
    page,
    limit,
    search,
    module: moduleFilter !== "ALL" ? moduleFilter : undefined,
    severity: severityFilter !== "ALL" ? severityFilter : undefined,
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 };

  const filterTabs: FilterTab[] = [
    { id: "ALL", label: "All Events" },
    { id: "ORGANIZATION", label: "Organizations" },
    { id: "USER", label: "Users" },
    { id: "FESTIVAL", label: "Festivals" },
    { id: "SUBSCRIPTION", label: "Subscriptions" },
    { id: "AUTH", label: "Authentication" },
  ];

  const quickFilterGroups: QuickFilterGroup[] = [
    {
      id: "severity",
      label: "Severity",
      value: severityFilter,
      options: [
        { value: "ALL", label: "All Severities" },
        { value: "INFO", label: "Info" },
        { value: "WARNING", label: "Warning" },
        { value: "CRITICAL", label: "Critical" },
      ],
      onChange: (val) => {
        setSeverityFilter(val);
        setPage(1);
      },
    },
  ];

  const columns: Column<SuperAdminAuditItem>[] = [
    {
      id: "time",
      label: "Date & Time",
      className: "w-36 text-muted-foreground whitespace-nowrap text-2xs",
      render: (log) => (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 shrink-0" />
          <span>{log.date?.full || "N/A"}</span>
        </div>
      ),
    },
    {
      id: "actor",
      label: "Actor",
      className: "font-semibold whitespace-nowrap min-w-[140px]",
      render: (log) => (
        <div className="flex items-center gap-1.5">
          <span className="truncate max-w-[120px]">{log.user}</span>
          {log.userRole && (
            <AppBadge size="sm" variant="outline" className="text-[9px]">
              {log.userRole}
            </AppBadge>
          )}
        </div>
      ),
    },
    {
      id: "action",
      label: "Event Description",
      className: "min-w-[220px]",
      render: (log) => (
        <div className="flex flex-col">
          <span className="text-foreground font-semibold">{log.title}</span>
          {log.subtitle && (
            <span className="text-2xs text-muted-foreground line-clamp-1">{log.subtitle}</span>
          )}
        </div>
      ),
    },
    {
      id: "module",
      label: "Module",
      className: "w-28 text-center",
      render: (log) => (
        <AppBadge size="sm" variant="secondary" className="font-semibold text-2xs">
          {log.module}
        </AppBadge>
      ),
    },
    {
      id: "severity",
      label: "Severity",
      className: "w-24 text-center",
      render: (log) => (
        <AppBadge
          size="sm"
          className={
            log.severity === "CRITICAL"
              ? "bg-rose-500/15 text-rose-600 border-rose-500/30 font-bold"
              : log.severity === "WARNING"
                ? "bg-amber-500/15 text-amber-600 border-amber-500/30 font-semibold"
                : "bg-sky-500/15 text-sky-600 border-sky-500/30"
          }
        >
          {log.severity || "INFO"}
        </AppBadge>
      ),
    },
    {
      id: "inspect",
      label: "Diff",
      className: "w-16 text-right",
      render: (log) => (
        <button
          type="button"
          onClick={() => setInspectItem(log)}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          title="Inspect Event"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <PageContainer variant="list">
      <PageHeader
        title="Platform Audit Trail"
        description="Immutable audit history tracking all administrative, security, and financial lifecycle events across the platform."
        module="audit-logs"
        badge={`${pagination.total} Records`}
      />

      <PageFilterToolbar
        module="audit-logs"
        searchPlaceholder="Search events, users, mandals..."
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        tabs={filterTabs}
        activeTab={moduleFilter}
        onTabChange={(tab) => {
          setModuleFilter(tab);
          setPage(1);
        }}
        quickFilters={quickFilterGroups}
        onResetAll={() => {
          setSearch("");
          setModuleFilter("ALL");
          setSeverityFilter("ALL");
          setPage(1);
        }}
      />

      <DataTable
        columns={columns}
        data={logs}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle="No audit records found"
        module="audit-logs"
      />

      {pagination.totalPages > 1 && (
        <DataTablePagination
          page={page}
          totalPages={pagination.totalPages}
          limit={limit}
          total={pagination.total}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          module="audit-logs"
        />
      )}

      {/* INSPECT AUDIT DIFF DIALOG */}
      {inspectItem && (
        <FormDialog
          open={!!inspectItem}
          onClose={() => setInspectItem(null)}
          title={`Audit Event: ${inspectItem.action}`}
          description={`${inspectItem.title} on ${inspectItem.date?.full}`}
          contentClassName="max-w-xl"
          submitLabel="Close"
          cancelLabel="Dismiss"
          onSubmit={(e) => {
            e.preventDefault();
            setInspectItem(null);
          }}
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actor:</span>
                <span className="font-semibold">{inspectItem.user} ({inspectItem.userRole})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Module:</span>
                <span className="font-semibold">{inspectItem.module}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold">{inspectItem.status}</span>
              </div>
            </div>

            {inspectItem.changedFields && inspectItem.changedFields.length > 0 && (
              <div>
                <span className="font-semibold block text-foreground mb-1">Modified Fields:</span>
                <div className="flex flex-wrap gap-1">
                  {inspectItem.changedFields.map((f: string) => (
                    <AppBadge key={f} size="sm" variant="outline">{f}</AppBadge>
                  ))}
                </div>
              </div>
            )}

            {(inspectItem.oldValues || inspectItem.newValues) && (
              <div className="space-y-2">
                <span className="font-semibold block text-foreground">Data State Snapshot:</span>
                <pre className="p-3 rounded-xl bg-muted/60 border border-border text-2xs overflow-x-auto max-h-52 font-mono">
                  {JSON.stringify(
                    {
                      before: inspectItem.oldValues,
                      after: inspectItem.newValues,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            )}
          </div>
        </FormDialog>
      )}
    </PageContainer>
  );
};

export default SuperAdminAuditPage;
