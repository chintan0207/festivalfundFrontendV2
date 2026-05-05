import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AppInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      id,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {/* Label */}
        {label && (
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
          </Label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </span>
          )}

          <Input
            id={id}
            ref={ref}
            className={cn(
              // base style (match your theme)
              "h-9 rounded-xl border bg-background px-3 text-sm shadow-sm transition-all",

              // focus style (important)
              "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary",

              // icon spacing
              leftIcon && "pl-10",
              rightIcon && "pr-10",

              // error state
              error &&
                "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive",

              className,
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Hint / Error */}
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  },
);

AppInput.displayName = "AppInput";
