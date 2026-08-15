import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AppCardProps extends React.ComponentProps<typeof Card> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "dotted" | "shadow" | "elevated" | "flat";
  /** Denser header/content sizing for compact dashboard surfaces. */
  compact?: boolean;
  /** Extra classes merged onto the CardContent wrapper. */
  contentClassName?: string;
}

export function AppCard({ title, subtitle, icon, children, className, variant, compact, contentClassName, ...props }: AppCardProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border/60 bg-card/95 backdrop-blur-md shadow-sm transition-all max-w-full overflow-hidden",
        variant === "dotted" && "border-dashed border-2",
        variant === "shadow" && "shadow-lg shadow-primary/5",
        variant === "elevated" && "shadow-xl border-primary/20",
        variant === "flat" && "shadow-none bg-muted/30",
        className
      )}
      {...props}
    >
      {(title || subtitle || icon) && (
        <CardHeader className={cn("border-b border-border/50", compact ? "px-2" : "p-4 sm:p-4")}>
          <div className="flex items-start gap-3">
            {icon && (
              <div className={cn("rounded-xl bg-primary/10 text-primary shrink-0 flex items-center justify-center", compact ? "h-8 w-8 [&>svg]:size-3.5" : "p-2")}>{icon}</div>
            )}

            <div className="space-y-0.5 min-w-0">
              {title && (
                <CardTitle className={cn("font-bold tracking-tight text-foreground", compact ? "text-sm leading-none" : "text-lg sm:text-xl")}>
                  {title}
                </CardTitle>
              )}
              {subtitle && (
                <CardDescription className={cn("text-muted-foreground leading-relaxed", compact ? "text-[11px]" : "text-xs sm:text-sm")}>
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      {children && (
        <CardContent className={cn(
          compact ? "px-4 py-2" : (title || subtitle || icon) ? "px-4 sm:px-6 sm:pb-2 pt-0" : "p-4 sm:p-6",
          contentClassName
        )}>
          {children}
        </CardContent>
      )}
    </Card>
  );
}
