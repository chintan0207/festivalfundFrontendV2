import { useEffect, useState } from "react";
import { Search, ShieldAlert, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuditLogs } from "@/api/audit/useAuditLogs";
import type { AuditLogItem } from "@/api/audit/audit.service";
import { AppButton } from "@/components/common/AppButton";
import { Skeleton } from "@/components/ui/skeleton";
import { activityMeta } from "@/pages/dashboard/lib/activityMeta";
import { formatINR } from "@/pages/dashboard/lib/dashboardFormat";
import { AuditLogDetailsModal } from "./AuditLogDetailsModal";

interface AuditLogTabProps {
  festivalId: string;
  onTotalChange?: (total: number) => void;
}

const MODULE_OPTIONS = [
  "ALL",
  "AUTH",
  "ORGANIZATION",
  "USER",
  "CONTRIBUTOR",
  "CONTRIBUTION",
  "EXPENSE",
  "TASK",
  "NOTE",
  "DOCUMENT",
  "REPORT",
];

const ACTION_OPTIONS = [
  "ALL",
  "CREATED",
  "UPDATED",
  "DELETED",
  "STATUS_CHANGED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "LOGIN",
  "LOGOUT",
];

function AuditRow({ log, onClick }: { log: AuditLogItem; onClick: () => void }) {
  const meta = activityMeta(log.type || log.module);

  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 rounded-xl px-3.5 py-3 hover:bg-muted/50 transition-colors group cursor-pointer border border-transparent hover:border-border/40"
    >
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bubble}`}
      >
        <meta.Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
            {log.title}
          </span>
          {log.code && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
              {log.code}
            </span>
          )}
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
            {log.module}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
          {log.subtitle}
        </p>
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
          {log.user ? `Actor: ${log.user} · ` : ""}
          {log.date?.full || ""}
        </p>
      </div>

      <div className="text-right shrink-0">
        {log.amount && log.amount > 0 ? (
          <span className="text-xs font-bold text-foreground tabular-nums block">
            {formatINR(log.amount)}
          </span>
        ) : null}
        {log.changedFields && log.changedFields.length > 0 && (
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-1 inline-block">
            {log.changedFields.length} field diffs
          </span>
        )}
      </div>
    </div>
  );
}

export const AuditLogTab = ({ festivalId, onTotalChange }: AuditLogTabProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState("ALL");
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const { data, isLoading, isError, refetch } = useAuditLogs({
    festivalId,
    page,
    limit: 20,
    search: search.trim() || undefined,
    module: selectedModule !== "ALL" ? selectedModule : undefined,
    action: selectedAction !== "ALL" ? selectedAction : undefined,
  });

  const logs = data?.logs ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;

  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange]);

  if (isLoading && page === 1) {
    return (
      <div className="rounded-2xl border border-border/60 overflow-hidden divide-y divide-border/60 bg-card">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-3.5 flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card p-8 text-center">
        <ShieldAlert className="h-7 w-7 text-rose-500 mx-auto" />
        <p className="text-sm font-semibold text-foreground mt-2">Failed to load organization audit log.</p>
        <AppButton variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
          Retry Loading
        </AppButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search activity by actor, entity name, description..."
            className="h-9 w-full rounded-xl border border-border/70 bg-muted/30 pl-9 pr-4 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span className="font-semibold">Module:</span>
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setPage(1);
              }}
              className="h-8 rounded-lg border border-border bg-card px-2 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              {MODULE_OPTIONS.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-semibold">Action:</span>
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className="h-8 rounded-lg border border-border bg-card px-2 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              {ACTION_OPTIONS.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Log Feed List */}
      <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-xs">
        {logs.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-xs">
            No organization audit records found matching your filters.
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {logs.map((log: AuditLogItem) => (
              <AuditRow key={log.id} log={log} onClick={() => setSelectedLog(log)} />
            ))}
          </div>
        )}
      </div>

      {/* Server-Side Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-2 text-xs text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({total} total entries)
          </span>
          <div className="flex items-center gap-2">
            <AppButton
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
            >
              Previous
            </AppButton>
            <AppButton
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
            >
              Next
            </AppButton>
          </div>
        </div>
      )}

      {/* Audit Detail Modal with Field Diffing */}
      {selectedLog && (
        <AuditLogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
};

export default AuditLogTab;