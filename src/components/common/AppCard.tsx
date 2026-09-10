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
  const hasHeader = Boolean(title || subtitle || icon);

  return (
    <Card
      className={cn(
        "rounded-2xl border border-border/60 bg-card/95 backdrop-blur-md shadow-sm transition-all max-w-full overflow-hidden py-0 gap-0",
        variant === "dotted" && "border-dashed border-2",
        variant === "shadow" && "shadow-lg shadow-primary/5",
        variant === "elevated" && "shadow-xl border-primary/20",
        variant === "flat" && "shadow-none bg-muted/30",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <CardHeader
          className={cn(
            "border-b border-border/50",
            compact ? "px-4 py-3 sm:px-5 sm:py-3.5" : "px-5 py-4 sm:px-6 sm:py-4.5"
          )}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={cn(
                  "rounded-xl bg-primary/10 text-primary shrink-0 flex items-center justify-center",
                  compact ? "h-7 w-7 [&>svg]:size-3.5" : "h-9 w-9 [&>svg]:size-4"
                )}
              >
                {icon}
              </div>
            )}

            <div className="space-y-0.5 min-w-0">
              {title && (
                <CardTitle
                  className={cn(
                    "font-bold tracking-tight text-foreground",
                    compact ? "text-sm leading-none" : "text-base sm:text-lg font-semibold"
                  )}
                >
                  {title}
                </CardTitle>
              )}
              {subtitle && (
                <CardDescription
                  className={cn(
                    "text-muted-foreground leading-relaxed",
                    compact ? "text-2xs" : "text-xs sm:text-sm"
                  )}
                >
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      {children && (
        <CardContent
          className={cn(
            (className?.includes("flex-col") || className?.includes("h-full")) && "flex-1 flex flex-col min-h-0",
            hasHeader
              ? compact
                ? "p-4 sm:p-5"
                : "p-5 sm:p-6"
              : className?.includes("p-")
              ? "p-0"
              : compact
              ? "p-4"
              : "p-5 sm:p-6",
            contentClassName
          )}
        >
          {children}
        </CardContent>
      )}
    </Card>
  );
}
