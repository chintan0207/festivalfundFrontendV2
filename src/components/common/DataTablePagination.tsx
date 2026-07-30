import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { AppSelect } from "./AppSelect";

export interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  module?: string;
}

export function DataTablePagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  module = "default",
}: DataTablePaginationProps) {
  const theme = getModuleTheme(module);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    const start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const btnBase =
    "flex items-center justify-center h-8 w-8 rounded-lg text-xs font-semibold transition-colors select-none";

  return (
    <div className="flex items-center justify-center sm:justify-between gap-3 flex-wrap">
      {/* "Show X of Y results" + limit selector */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Show</span>
        <AppSelect
          value={String(limit)}
          onChange={(val) => onLimitChange(Number(val))}
          options={[
            { value: "2", label: "2" },
            { value: "5", label: "5" },
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          className="h-8 text-xs py-0"
        />
        <span>of {total}</span>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            btnBase,
            page <= 1
              ? "text-muted-foreground/30 cursor-not-allowed"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground cursor-pointer",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={cn(
              btnBase,
              "cursor-pointer",
              page === pageNum
                ? cn("text-white", theme.gradient)
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {pageNum}
          </button>
        ))}

        {totalPages > 5 && page + 2 < totalPages && (
          <span className="flex items-center justify-center h-8 w-8 text-xs text-muted-foreground">
            ...
          </span>
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            btnBase,
            page >= totalPages
              ? "text-muted-foreground/30 cursor-not-allowed"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground cursor-pointer",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
