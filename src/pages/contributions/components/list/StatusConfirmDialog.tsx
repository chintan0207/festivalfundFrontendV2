import { useState } from "react";
import { Banknote, Package, AlertTriangle, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AppButton } from "@/components/common/AppButton";
import { contributionStatusLabel } from "../../lib/contributionMeta";
import { contributionAmountValue } from "@/lib/contributionFormat";
import { cn } from "@/lib/utils";
import type { ContributionListItem, ContributionStatus } from "@/types/Types";

const PRESET_REASONS = [
  "Wrong amount entered",
  "Wrong contributor selected",
  "Duplicate entry",
  "Refunded to organizer",
  "Accounting correction",
];

export function StatusConfirmDialog({
  open,
  contribution,
  nextStatus,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  contribution: ContributionListItem | null;
  nextStatus: ContributionStatus;
  loading?: boolean;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");

  if (!contribution) return null;

  const current = contribution.status;
  const isDepositing = nextStatus === "DEPOSITED" && current !== "DEPOSITED";
  const isReversal = current === "DEPOSITED" && nextStatus === "PENDING";
  const isCancelling = nextStatus === "CANCELLED";
  const requiresReason = isReversal;
  const showReason = requiresReason || isCancelling;

  const amount = contributionAmountValue(contribution);
  const amountLabel = amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : null;
  const isCash = contribution.type === "MONEY";

  const title = isDepositing
    ? "Deposit this contribution?"
    : isReversal
      ? "Reverse this deposit?"
      : isCancelling
        ? "Cancel this contribution?"
        : "Change contribution status?";

  const confirmLabel = isReversal ? "Reverse Deposit" : `Mark as ${contributionStatusLabel(nextStatus)}`;
  const danger = isReversal || isCancelling;

  const renderImpact = () => {
    if (isDepositing) {
      return (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-xs">
          <p className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            {isCash ? <Banknote className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
            {amountLabel ? `+${amountLabel} added to festival balance` : "Added to festival balance"}
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
            {amountLabel
              ? `−${amountLabel} removed from festival balance`
              : "Removed from festival balance"}
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
            This contribution will never be added to the balance
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
            {contribution.contributionCode} · {contribution.contributor?.name || "Unknown"} ·{" "}
            {contributionStatusLabel(current)} → {contributionStatusLabel(nextStatus)}
          </DialogDescription>
        </div>

        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6 space-y-3">
          {renderImpact()}

          {showReason && (
            <>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-foreground">
                  {requiresReason ? "Reason for reversal" : "Reason (optional)"}
                </span>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder={requiresReason ? "Required — explain why this deposit is reversed" : "Optional note (stored in audit trail)"}
                  className={cn(
                    "w-full rounded-xl border border-input bg-background/90 px-3 py-2 text-sm shadow-sm outline-none resize-none transition-all",
                    "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary",
                    requiresReason && !reason.trim() && "border-amber-400/60",
                  )}
                />
              </label>

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