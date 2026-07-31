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

function getPageNumbers(current: number, total: number, siblings: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const rangeStart = Math.max(2, current - siblings);
  const rangeEnd = Math.min(total - 1, current + siblings);
  pages.push(1);
  if (rangeStart > 2) pages.push("...");
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
  if (rangeEnd < total - 1) pages.push("...");
  if (total > 1) pages.push(total);
  return pages;
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
  const pages = getPageNumbers(page, totalPages, 1);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pageBtnBase =
    "flex items-center justify-center h-8 w-8 rounded-full text-xs font-semibold transition-all duration-200 select-none";

  const navBtnBase =
    "flex items-center gap-1 h-8 rounded-full text-xs font-semibold transition-all duration-200 select-none px-3 text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:scale-105 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:scale-100";

  const iconBtnBase =
    "flex items-center justify-center h-8 w-8 rounded-full text-xs font-semibold transition-all duration-200 select-none text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:scale-105 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:scale-100";

  return (
    <div className="rounded-full bg-card border border-border/80 shadow-sm px-3 sm:px-4 py-1.5">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Range + total */}
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground whitespace-nowrap shrink-0">
          <AppSelect
            value={String(limit)}
            onChange={(val) => onLimitChange(Number(val))}
            options={[
              { value: "10", label: "10" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },

              { value: "5", label: "5" },
              { value: "20", label: "20" },
            ]}
            className="!h-7 sm:!h-7 text-[11px] rounded-full px-2.5 min-w-[52px]"
          />
          <span>
            {from}–{to} of {total}
          </span>
        </div>

        {/* Right: Navigation */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Previous */}
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onPageChange(page - 1)}
            className={cn(navBtnBase, "hidden sm:flex")}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onPageChange(page - 1)}
            className={cn(iconBtnBase, "sm:hidden")}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {/* Page numbers */}
          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`e-${i}`}
                className="flex items-center justify-center h-8 w-5 text-xs text-muted-foreground/30 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={cn(
                  pageBtnBase,
                  "cursor-pointer active:scale-90",
                  p === page
                    ? cn("text-white shadow-sm scale-110", theme.gradient)
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:scale-105",
                  Math.abs(p - page) > 2 &&
                    p !== 1 &&
                    p !== totalPages &&
                    "hidden sm:flex",
                )}
              >
                {p}
              </button>
            ),
          )}

          {/* Next */}
          <button
            type="button"
            disabled={isLast}
            onClick={() => onPageChange(page + 1)}
            className={cn(navBtnBase, "hidden sm:flex")}
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onPageChange(page + 1)}
            className={cn(iconBtnBase, "sm:hidden")}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
