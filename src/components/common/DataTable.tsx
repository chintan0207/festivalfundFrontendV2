import type { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  id: string;
  label: string;
  sortable?: boolean;
  render: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  skeletonRows?: number;
  module?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  sortField,
  sortOrder,
  onSort,
  isLoading,
  onRowClick,
  emptyTitle = "No data found",
  emptyDescription = "Try adjusting your search or filters",
  skeletonRows = 5,
  module = "default",
  className,
}: DataTableProps<T>) {
  const theme = getModuleTheme(module);

  return (
    <div className={cn("rounded-2xl bg-card border border-border/80 overflow-hidden shadow-xs", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border/80 text-2xs font-bold text-muted-foreground uppercase">
            <tr>
              {columns.map((col) => {
                const isActiveSort = sortField === col.id;
                return (
                  <th
                    key={col.id}
                    className={cn(
                      "px-4 py-3",
                      col.sortable && "cursor-pointer select-none hover:text-foreground transition-colors",
                      col.headerClassName,
                    )}
                    onClick={() => col.sortable && onSort?.(col.id)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.label}</span>
                      {col.sortable && isActiveSort && (
                        sortOrder === "asc"
                          ? <ArrowUp className={cn("h-3 w-3", theme.iconColor)} />
                          : <ArrowDown className={cn("h-3 w-3", theme.iconColor)} />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading
              ? Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.id} className="px-4 py-3">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.length === 0
                ? (
                  <tr>
                    <td colSpan={columns.length}>
                      <EmptyState title={emptyTitle} description={emptyDescription} className="py-12" />
                    </td>
                  </tr>
                )
                : data.map((item) => (
                    <tr
                      key={keyExtractor(item)}
                      className={cn(
                        "transition-colors",
                        onRowClick && "cursor-pointer hover:bg-muted/30",
                      )}
                      onClick={() => onRowClick?.(item)}
                    >
                      {columns.map((col) => (
                        <td key={col.id} className={cn("px-4 py-3", col.className)}>
                          {col.render(item)}
                        </td>
                      ))}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
