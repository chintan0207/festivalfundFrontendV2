import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AppButton } from "./AppButton";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  icon?: ReactNode;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  icon,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-0 overflow-hidden max-h-[85dvh] flex flex-col gap-0">
        {/* Header */}
        <div className="relative overflow-hidden border-b border-border/60 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 shrink-0">
          <div
            className={cn(
              "pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full blur-2xl",
              isDanger ? "bg-rose-500/10" : "bg-primary/10",
            )}
          />
          <div className="relative flex items-start gap-3">
            {icon && (
              <div
                className={cn(
                  "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-border/60",
                  isDanger
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : "bg-muted/70 text-foreground",
                )}
              >
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-[15px] font-bold tracking-tight text-foreground sm:text-lg">
                {title}
              </DialogTitle>
            </div>
          </div>
        </div>

        {/* Body */}
        {description && (
          <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6">
            <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
              {description}
            </DialogDescription>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/40 px-4 py-3 sm:mt-auto sm:flex-row sm:justify-end sm:px-6 sm:py-4 shrink-0">
          <AppButton
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </AppButton>
          <AppButton
            onClick={onConfirm}
            loading={loading}
            variant={isDanger ? "destructive" : "default"}
            className="w-full sm:w-auto"
          >
            {confirmLabel}
          </AppButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
