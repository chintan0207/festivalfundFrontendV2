import * as React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface AppCardProps extends React.ComponentProps<typeof Card> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function AppCard({ title, subtitle, icon, children, ...props }: AppCardProps) {
  return (
    <Card {...props}>
      {(title || subtitle || icon) && (
        <CardHeader>
          <div className="flex items-start gap-3">
            {icon && (
              <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
            )}

            <div className="space-y-1">
              {title && <CardTitle>{title}</CardTitle>}
              {subtitle && <CardDescription>{subtitle}</CardDescription>}
            </div>
          </div>
        </CardHeader>
      )}

      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
