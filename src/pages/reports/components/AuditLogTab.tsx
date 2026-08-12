import { ShieldCheck, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { Contribution, Expense } from "@/lib/data/mockData";

interface AuditLogTabProps {
  contributions: Contribution[];
  expenses: Expense[];
}

export const AuditLogTab = ({ contributions, expenses }: AuditLogTabProps) => {
  // Combine contributions & expenses into chronological audit events
  const auditEvents = [
    ...contributions.map((c) => ({
      id: c.id,
      type: "CONTRIBUTION" as const,
      code: c.receiptNo,
      title: `Contribution Received from ${c.contributorName}`,
      subtitle: `Payment Mode: ${c.paymentMode || "CASH"} | Contributor: ${c.contributorName}`,
      amount: c.amount,
      date: c.date,
      status: c.status,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      type: "EXPENSE" as const,
      code: e.voucherNo,
      title: `Expense Paid: ${e.title}`,
      subtitle: `Category: ${e.category} | Paid to: ${e.paidTo}`,
      amount: e.amount,
      date: e.date,
      status: "APPROVED" as const,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-indigo-600">
          <ShieldCheck className="h-5 w-5" />
          <h2 className="text-base font-bold text-foreground">Chronological Audit Log</h2>
        </div>
        <span className="text-2xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
          {auditEvents.length} Total Audit Records
        </span>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden">
        <div className="divide-y divide-border/60 text-xs">
          {auditEvents.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No audit log entries recorded.
            </div>
          ) : (
            auditEvents.map((evt) => (
              <div
                key={`${evt.type}-${evt.id}`}
                className="p-3.5 flex items-center justify-between hover:bg-muted/30 transition-all gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                      evt.type === "CONTRIBUTION"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-rose-500/10 text-rose-600"
                    }`}
                  >
                    {evt.type === "CONTRIBUTION" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">{evt.title}</p>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                        {evt.code}
                      </span>
                    </div>
                    <p className="text-2xs text-muted-foreground mt-0.5">{evt.subtitle}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`font-mono font-extrabold text-sm ${
                      evt.type === "CONTRIBUTION" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {evt.type === "CONTRIBUTION" ? "+" : "-"}₹{evt.amount.toLocaleString()}
                  </p>
                  <p className="text-2xs text-muted-foreground mt-0.5">{evt.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogTab;
