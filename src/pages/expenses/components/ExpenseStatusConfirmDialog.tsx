import { useState } from "react";
import { Banknote, AlertTriangle, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AppButton } from "@/components/common/AppButton";
import { AppTextArea } from "@/components/common/AppTextArea";
import { expenseStatusLabel, formatExpenseAmount } from "../lib/expenseMeta";
import { cn } from "@/lib/utils";
import type { Expense, ExpenseListItem, ExpenseStatus } from "@/types/Types";

export type ExpenseStatusTarget = Pick<
  Expense | ExpenseListItem,
  "expenseCode" | "status" | "amount" | "description" | "vendorName" | "invoiceNumber"
>;

const PRESET_REASONS = [
  "Wrong amount entered",
  "Duplicate entry",
  "Vendor refund received",
  "Accounting correction",
  "Payment never executed",
];

export function ExpenseStatusConfirmDialog({
  open,
  expense,
  nextStatus,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  expense: ExpenseStatusTarget | null;
  nextStatus: ExpenseStatus;
  loading?: boolean;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");

  if (!expense) return null;

  const current = expense.status;
  const isMarkingPaid = nextStatus === "PAID" && current !== "PAID";
  const isReversal = current === "PAID" && nextStatus === "PENDING";
  const isCancelling = nextStatus === "CANCELLED";
  const requiresReason = isReversal;
  const showReason = requiresReason || isCancelling;

  const amountLabel = formatExpenseAmount(expense.amount);

  const title = isMarkingPaid
    ? "Mark this expense as paid?"
    : isReversal
      ? "Reverse this payment?"
      : isCancelling
        ? "Cancel this expense?"
        : "Change expense status?";

  const confirmLabel = isReversal ? "Reverse Payment" : `Mark as ${expenseStatusLabel(nextStatus)}`;
  const danger = isReversal || isCancelling;

  const renderImpact = () => {
    if (isMarkingPaid) {
      return (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-xs">
          <p className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5" />
            {amountLabel} will be counted in the festival balance
          </p>
          <p className="text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
            This makes the record final. Amount and details will be locked.
          </p>
        </div>
      );
    }

    if (isReversal) {
      return (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-xs">
          <p className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            {amountLabel} will be removed from the festival balance
          </p>
          <p className="text-amber-700/80 dark:text-amber-400/80 mt-0.5">
            The record will unlock and return to Pending. This action is recorded in the audit trail.
          </p>
        </div>
      );
    }

    if (isCancelling) {
      return (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 text-xs">
          <p className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            This expense will never be counted in the balance
          </p>
          <p className="text-rose-700/80 dark:text-rose-400/80 mt-0.5">
            The record is marked as cancelled and cannot be restored.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-0 overflow-hidden max-h-[85dvh] flex flex-col gap-0">
        <div className="relative overflow-hidden border-b border-border/60 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 shrink-0">
          <div
            className={cn(
              "pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full blur-2xl",
              danger ? "bg-rose-500/10" : "bg-emerald-500/10",
            )}
          />
          <DialogTitle className="text-[15px] font-bold tracking-tight text-foreground sm:text-lg">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-1 text-xs text-muted-foreground">
            {expense.expenseCode} · {expense.description || expense.vendorName || "Expense"} ·{" "}
            {expenseStatusLabel(current)} → {expenseStatusLabel(nextStatus)}
          </DialogDescription>
        </div>

        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6 space-y-3">
          {renderImpact()}

          {showReason && (
            <>
              <AppTextArea
                id="expense-status-reason"
                label={requiresReason ? "Reason for reversal" : "Reason (optional)"}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder={
                  requiresReason
                    ? "Required — explain why this payment is reversed"
                    : "Optional note (stored in audit trail)"
                }
                className={cn(requiresReason && !reason.trim() && "border-amber-400/60")}
              />

              <div className="flex flex-wrap gap-1.5">
                {PRESET_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer active:scale-95",
                      reason === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/80 bg-muted/40 text-muted-foreground hover:bg-muted/70",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {requiresReason && reason.trim().length < 10 && (
                <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  A reason of at least 10 characters is required.
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/40 px-4 py-3 sm:mt-auto sm:flex-row sm:justify-end sm:px-6 sm:py-4 shrink-0">
          <AppButton variant="outline" onClick={onCancel} disabled={loading} className="w-full sm:w-auto">
            Cancel
          </AppButton>
          <AppButton
            onClick={() => onConfirm(requiresReason ? reason.trim() : reason.trim() || undefined)}
            loading={loading}
            disabled={requiresReason && reason.trim().length < 10}
            variant={danger ? "destructive" : "default"}
            className="w-full sm:w-auto"
          >
            {confirmLabel}
          </AppButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
