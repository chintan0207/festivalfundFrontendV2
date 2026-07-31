import type { FormEvent, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AppButton } from "./AppButton";

export interface FormDialogProps {
  open: boolean;
  title: string;
  titleIcon?: ReactNode;
  description?: ReactNode;
  submitLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  gradient?: string;
  contentClassName?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  children: ReactNode;
}

export function FormDialog({
  open,
  title,
  titleIcon,
  description,
  submitLabel,
  cancelLabel = "Cancel",
  loading = false,
  gradient,
  contentClassName,
  onSubmit,
  onClose,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-md rounded-2xl p-0 overflow-hidden max-h-[85dvh] flex flex-col gap-0",
          "max-sm:inset-x-0 max-sm:top-auto max-sm:bottom-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:rounded-b-none max-sm:rounded-t-2xl max-sm:max-h-[90dvh] max-sm:pb-[env(safe-area-inset-bottom)]",
          "max-sm:data-[state=open]:slide-in-from-bottom-full max-sm:data-[state=open]:zoom-in-100 max-sm:data-[state=closed]:slide-out-to-bottom-full max-sm:data-[state=closed]:zoom-out-100",
          contentClassName,
        )}
      >
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          {/* Header */}
          <div className="relative overflow-hidden border-b border-border/60 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 shrink-0">
            <div className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex items-center gap-3">
              {titleIcon && (
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-muted/70 text-foreground ring-1 ring-border/60">
                  {titleIcon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-[15px] font-bold tracking-tight text-foreground sm:text-lg">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="mt-0.5 text-xs text-muted-foreground">
                    {description}
                  </DialogDescription>
                )}
              </div>
            </div>
            <div aria-hidden className="mx-auto mt-3 h-1 w-10 rounded-full bg-border/70 sm:hidden" />
          </div>

          {/* Body */}
          <div className="grid gap-3 px-4 py-4 text-xs sm:gap-4 sm:px-6 min-h-0 overflow-y-auto overscroll-contain">
            {children}
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/40 px-4 py-3 sm:flex-row sm:justify-end sm:px-6 sm:py-4 shrink-0">
            <AppButton
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {cancelLabel}
            </AppButton>
            <AppButton type="submit" loading={loading} gradient={gradient} className="w-full sm:w-auto">
              {submitLabel}
            </AppButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
