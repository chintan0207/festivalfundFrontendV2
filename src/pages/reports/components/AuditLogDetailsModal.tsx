import { X, ArrowRight, ShieldCheck, HardDrive } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import type { AuditLogItem } from "@/api/audit/audit.service";

interface AuditLogDetailsModalProps {
  log: AuditLogItem | null;
  onClose: () => void;
}

export const AuditLogDetailsModal = ({ log, onClose }: AuditLogDetailsModalProps) => {
  if (!log) return null;

  const hasDiffs = log.changedFields && log.changedFields.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border/80 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4 text-left overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
              {log.module?.slice(0, 3) || "LOG"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">{log.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-mono font-bold uppercase text-muted-foreground">
                  {log.action}
                </span>
              </div>
              {log.code && <p className="text-xs font-mono text-muted-foreground mt-0.5">{log.code}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
          {/* Overview Grid */}
          <div className="grid grid-cols-2 gap-2 bg-muted/30 p-3.5 rounded-xl border border-border/40">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Actor</span>
              <span className="font-semibold text-foreground">{log.user || "System"}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Timestamp</span>
              <span className="font-semibold text-foreground">{log.date?.full || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Module / Entity</span>
              <span className="font-semibold text-foreground">{log.module} / {log.entityType}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Severity</span>
              <span className={`font-bold inline-block px-1.5 py-0.5 rounded text-[10px] ${
                log.severity === "CRITICAL"
                  ? "bg-rose-500/10 text-rose-500"
                  : log.severity === "WARNING"
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-blue-500/10 text-blue-500"
              }`}>
                {log.severity || "INFO"}
              </span>
            </div>
          </div>

          {/* Description */}
          {log.subtitle && (
            <div className="bg-muted/20 p-3 rounded-xl border border-border/40 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Description</span>
              <p className="text-xs text-foreground leading-relaxed">{log.subtitle}</p>
            </div>
          )}

          {/* Field Differences Table (Before -> After) */}
          {hasDiffs && (
            <div className="space-y-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block tracking-wider">
                Field Level Changes ({log.changedFields?.length})
              </span>
              <div className="rounded-xl border border-border/60 overflow-hidden divide-y divide-border/40 bg-card">
                <div className="grid grid-cols-3 bg-muted/50 p-2 text-[10px] font-bold text-muted-foreground uppercase">
                  <div>Field</div>
                  <div>Previous State</div>
                  <div>New State</div>
                </div>
                {log.changedFields?.map((field) => {
                  const oldVal = log.oldValues?.[field];
                  const newVal = log.newValues?.[field];
                  return (
                    <div key={field} className="grid grid-cols-3 p-2.5 items-center gap-2 text-xs">
                      <div className="font-mono font-semibold text-primary truncate">
                        {field}
                      </div>
                      <div className="text-rose-600 dark:text-rose-400 font-mono bg-rose-500/5 px-2 py-1 rounded truncate">
                        {oldVal !== undefined && oldVal !== null ? String(oldVal) : "—"}
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/5 px-2 py-1 rounded truncate flex items-center gap-1">
                        <ArrowRight className="h-3 w-3 shrink-0 opacity-60" />
                        <span>{newVal !== undefined && newVal !== null ? String(newVal) : "—"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Network & Source Metadata */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 bg-muted/20 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5" />
              <span>IP: {log.ipAddress || "Internal"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Append-Only Immutability Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-border/60 flex justify-end">
          <AppButton size="sm" variant="outline" onClick={onClose}>
            Close Detail
          </AppButton>
        </div>
      </div>
    </div>
  );
};
