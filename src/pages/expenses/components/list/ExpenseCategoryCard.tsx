import { PieChart } from "lucide-react";
import { useExpenseApiStore } from "@/api/expense/expense.store";
import { cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { expenseCategoryMeta } from "../../lib/expenseMeta";

const fmt = (value: number) =>
  `₹${(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

/** Right-rail category breakdown card. Reads PAID expense totals hydrated by the list query. */
export function ExpenseCategoryCard({
  variant = "card",
}: {
  variant?: "card" | "strip";
}) {
  const theme = getModuleTheme("expenses");
  const categoryTotals = useExpenseApiStore((s) => s.categoryTotals) || {};

  const rows = expenseCategoryMeta.map(({ key, label, description, Icon, gradient }) => ({
    key,
    label,
    description,
    Icon,
    gradient,
    amount: Number(categoryTotals[key] ?? 0) || 0,
  }));

  const total = rows.reduce((acc, r) => acc + r.amount, 0);

  if (variant === "strip") {
    return (
      <div className="rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60">
          <span
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0",
              theme.gradient,
            )}
          >
            <PieChart className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Category Breakdown
            </h3>
            <p className="text-[11px] text-muted-foreground">Paid expenses by category</p>
          </div>
        </div>

        <div className="p-3.5 grid grid-cols-2 md:grid-cols-3 gap-2">
          {rows.map(({ key, label, description, Icon, gradient, amount }) => (
            <div
              key={key}
              className="rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span
                  className={cn(
                    "h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-white",
                    gradient,
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground text-xs truncate">{label}</p>

                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 break-words">
                    {description}
                  </p>
                </div>
              </div>

              <p className="font-extrabold text-foreground text-sm mt-2 tabular-nums truncate">
                {fmt(amount)}
              </p>
            </div>
          ))}

          <div
            className={cn(
              "rounded-xl p-3 text-white flex flex-col min-w-0",
              theme.gradient,
            )}
          >
            <div className="flex items-start gap-2 min-w-0">
              <span className="h-8 w-8 rounded-lg bg-white/20 shrink-0 flex items-center justify-center text-xs font-bold">
                ₹
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-bold text-white text-xs truncate">Total</p>

                <p className="text-[10px] text-white/85 mt-0.5 truncate">Paid expenses</p>
              </div>
            </div>

            <p className="font-extrabold text-white text-base sm:text-lg mt-2 tabular-nums truncate">
              {fmt(total)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60">
        <span
          className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0",
            theme.gradient,
          )}
        >
          <PieChart className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            Category Breakdown
          </h3>
          <p className="text-[11px] text-muted-foreground">Paid expenses by category</p>
        </div>
      </div>

      <div className="p-3.5 space-y-1.5">
        {rows.map(({ key, label, description, Icon, gradient, amount }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 px-2.5 py-2.5 rounded-xl border border-border/40 text-xs transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={cn(
                  "h-7 w-7 rounded-lg shrink-0 flex items-center justify-center text-white",
                  gradient,
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{label}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {description}
                </p>
              </div>
            </div>
            <p className="font-bold text-foreground whitespace-nowrap pl-2 tabular-nums">
              {fmt(amount)}
            </p>
          </div>
        ))}

        <div
          className={cn(
            "flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-white mt-2",
            theme.gradient,
          )}
        >
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center">
              ₹
            </span>
            <div>
              <p className="font-bold text-white text-xs">Total</p>
              <p className="text-[10px] text-white/85">Paid expenses</p>
            </div>
          </div>
          <p className="font-extrabold text-white whitespace-nowrap pl-2 text-sm tabular-nums">
            {fmt(total)}
          </p>
        </div>
      </div>
    </div>
  );
}
