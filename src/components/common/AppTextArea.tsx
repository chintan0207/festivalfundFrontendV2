import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface AppTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const AppTextArea = React.forwardRef<HTMLTextAreaElement, AppTextAreaProps>(
  ({ label, error, hint, className, containerClassName, id, ...props }, ref) => {
    return (
      <div className={cn("space-y-1.5 sm:space-y-2 w-full", containerClassName)}>
        {label && (
          <Label htmlFor={id} className="text-xs sm:text-sm font-semibold text-foreground">
            {label}
          </Label>
        )}

        <textarea
          id={id}
          ref={ref}
          className={cn(
            "w-full rounded-2xl border border-input bg-background/90 px-3.5 py-2 text-sm shadow-sm outline-none resize-none transition-all",
            "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary",
            error &&
              "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive",
            className,
          )}
          {...props}
        />

        {error ? (
          <p className="text-[11px] sm:text-xs font-medium text-destructive leading-tight">
            {error}
          </p>
        ) : hint ? (
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

AppTextArea.displayName = "AppTextArea";