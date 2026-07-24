/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AppInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: any;
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
      <div className={cn("space-y-1.5 sm:space-y-2 w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <Label htmlFor={id} className="text-xs sm:text-sm font-semibold text-foreground">
            {label}
          </Label>
        )}

        {/* Input Wrapper */}
        <div className="relative w-full">
          {/* Left Icon */}
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center pointer-events-none">
              {leftIcon}
            </span>
          )}

          <Input
            id={id}
            ref={ref}
            className={cn(
              // base style
              "h-10 sm:h-10.5 w-full rounded-xl border border-input bg-background/90 px-3.5 text-xs sm:text-sm shadow-sm transition-all",

              // focus style
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
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Hint / Error */}
        {error ? (
          <p className="text-[11px] sm:text-xs font-medium text-destructive leading-tight">{error}</p>
        ) : hint ? (
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">{hint}</p>
        ) : null}
      </div>
    );
  },
);

AppInput.displayName = "AppInput";
