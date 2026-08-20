/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppBadge } from "./AppBadge";
import { moduleBadgeColors } from "@/theme/colors";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  to?: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  badge?: ReactNode | string | number;
  actions?: ReactNode;
  module?: string;
  gradientClass?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  badge,
  actions,
  module = "festivals",
  className,
}: PageHeaderProps) {
  const defaultBadgeClass =
    moduleBadgeColors[module] || moduleBadgeColors.default;

  return (
    <div className={cn("relative space-y-2 pb-2 rounded-2xl min-w-0", className)}>
      {/* Breadcrumbs with Router Navigation */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap min-w-0">
          {breadcrumbs.map((b, i) => {
            const isLast = i === breadcrumbs.length - 1;
            const targetPath = b.to || b.href;

            return (
              <span key={i} className="inline-flex items-center gap-1.5 min-w-0">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />}

                {targetPath ? (
                  <Link
                    to={targetPath as any}
                    className={cn(
                      "hover:text-foreground transition-colors font-medium rounded-xs px-0.5 focus:outline-none focus:ring-1 focus:ring-primary truncate",
                      isLast
                        ? "text-foreground font-semibold cursor-default pointer-events-none"
                        : "text-muted-foreground hover:underline"
                    )}
                  >
                    {b.label}
                  </Link>
                ) : b.onClick ? (
                  <button
                    type="button"
                    onClick={b.onClick}
                    className={cn(
                      "hover:text-foreground transition-colors font-medium rounded-xs px-0.5 focus:outline-none truncate",
                      isLast ? "text-foreground font-semibold cursor-default" : "text-muted-foreground hover:underline"
                    )}
                  >
                    {b.label}
                  </button>
                ) : (
                  <span
                    className={cn(
                      "font-medium truncate",
                      isLast ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {b.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      )}

      {/* Header Main Title & Badge Row */}
      <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center gap-3 sm:gap-4 lg:gap-6">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground break-words">
              {title}
            </h1>

            {badge && (
              typeof badge === "string" || typeof badge === "number" ? (
                <AppBadge size="sm" className={cn(defaultBadgeClass)}>
                  {badge}
                </AppBadge>
              ) : (
                badge
              )
            )}
          </div>

          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div
            data-fab-observe
            className="flex items-center gap-2 flex-wrap w-full lg:w-auto lg:ml-auto lg:shrink-0 justify-start"
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
