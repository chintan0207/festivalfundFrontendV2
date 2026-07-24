import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function AppButton({
  loading,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  variant,
  ...props
}: AppButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        "flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98]",
        variant === "outline"
          ? "border-border/80 hover:bg-muted/60"
          : variant === "ghost"
            ? "hover:bg-muted/50 text-foreground"
            : variant === "secondary"
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : variant === "destructive"
                ? "bg-destructive text-white hover:bg-destructive/90"
                : "shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30",
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}

      {!loading && leftIcon}

      {children}

      {!loading && rightIcon}
    </Button>
  );
}
