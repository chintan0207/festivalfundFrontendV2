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
}

export function AppCard({ title, subtitle, icon, children, className, variant, ...props }: AppCardProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border/60 bg-card/95 backdrop-blur-md shadow-sm transition-all",
        variant === "dotted" && "border-dashed border-2",
        variant === "shadow" && "shadow-lg shadow-primary/5",
        variant === "elevated" && "shadow-xl border-primary/20",
        variant === "flat" && "shadow-none bg-muted/30",
        className
      )}
      {...props}
    >
      {(title || subtitle || icon) && (
        <CardHeader>
          <div className="flex items-start gap-3">
            {icon && (
              <div className="rounded-xl bg-primary/10 p-2 text-primary">{icon}</div>
            )}

            <div className="space-y-1">
              {title && <CardTitle className="text-xl font-bold tracking-tight text-foreground">{title}</CardTitle>}
              {subtitle && <CardDescription className="text-xs sm:text-sm text-muted-foreground">{subtitle}</CardDescription>}
            </div>
          </div>
        </CardHeader>
      )}

      {children && <CardContent className={cn((title || subtitle || icon) ? "pt-0" : "p-6")}>{children}</CardContent>}
    </Card>
  );
}
