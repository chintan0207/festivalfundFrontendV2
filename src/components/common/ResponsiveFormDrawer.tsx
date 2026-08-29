import type { FormEvent, ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { AppButton } from "./AppButton";

export interface ResponsiveFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  title: string;
  titleIcon?: ReactNode;
  description?: ReactNode;
  submitLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  gradient?: string;
  side?: "right" | "bottom" | "left" | "top";
  children: ReactNode;
}

export function ResponsiveFormDrawer({
  open,
  onClose,
  onSubmit,
  title,
  titleIcon,
  description,
  submitLabel,
  cancelLabel = "Cancel",
  loading = false,
  gradient,
  side = "right",
  children,
}: ResponsiveFormDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side={side}
        className="w-full sm:max-w-lg flex flex-col p-0 gap-0 border-l border-border/80 shadow-2xl h-full"
      >
        <form onSubmit={onSubmit} className="flex flex-col h-full min-h-0">
          <SheetHeader className="p-5 border-b border-border/60 shrink-0 text-left relative overflow-hidden">
            <div className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex items-center gap-3">
              {titleIcon && (
                <div className="shrink-0 flex items-center justify-center">
                  {titleIcon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-lg font-bold tracking-tight text-foreground truncate">
                  {title}
                </SheetTitle>
                {description && (
                  <SheetDescription className="text-xs text-muted-foreground mt-0.5 truncate">
                    {description}
                  </SheetDescription>
                )}
              </div>
            </div>
          </SheetHeader>

          <div className="p-6 space-y-4 overflow-y-auto overscroll-contain flex-1 min-h-0 text-xs">
            {children}
          </div>

          <SheetFooter className="p-4 border-t border-border/60 bg-muted/30 shrink-0 flex flex-row gap-2 justify-end">
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-initial"
            >
              {cancelLabel}
            </AppButton>
            <AppButton
              type="submit"
              size="sm"
              loading={loading}
              gradient={gradient}
              className="flex-1 sm:flex-initial font-semibold"
            >
              {submitLabel}
            </AppButton>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

