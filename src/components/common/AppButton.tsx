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
  ...props
}: AppButtonProps) {
  return (
    <Button
      className={cn("flex items-center gap-2 rounded-2xl", className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}

      {!loading && leftIcon}

      {children}

      {!loading && rightIcon}
    </Button>
  );
}
