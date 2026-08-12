import { History, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AppBadge } from "@/components/common/AppBadge";
import { expenseStatusBadge, expenseStatusLabel } from "../../lib/expenseMeta";
import type { Expense } from "@/types/Types";

export function ExpenseStatusHistory({ expense }: { expense: Expense }) {
  const history = expense.statusHistory ?? [];

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-card border border-border/80 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border/60 px-3.5 sm:px-5 py-3">
        <History className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-bold text-foreground">Status History</h2>
      </div>

      <ol className="divide-y divide-border/60 px-3.5 sm:px-5">
        {[...history].reverse().map((entry, index) => (
          <li key={index} className="flex items-start gap-3 py-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="flex flex-wrap items-center gap-1.5 text-[13px]">
                {entry.from ? (
                  <>
                    <AppBadge size="xs" className={expenseStatusBadge(entry.from)}>
                      {expenseStatusLabel(entry.from)}
                    </AppBadge>
                    <span className="text-muted-foreground">→</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Created as</span>
                )}
                <AppBadge size="xs" className={expenseStatusBadge(entry.to)}>
                  {expenseStatusLabel(entry.to)}
                </AppBadge>
              </p>

              {entry.reason && (
                <p className="text-xs text-muted-foreground italic">“{entry.reason}”</p>
              )}

              {entry.at && (
                <p className="text-[11px] text-muted-foreground/70">
                  {formatDate(entry.at)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
