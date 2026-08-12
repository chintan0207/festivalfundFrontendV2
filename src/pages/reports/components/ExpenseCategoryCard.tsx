import type { ReactNode } from "react";
import { ChevronRight, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";

interface ExpenseCategoryCardProps {
  title: string;
  subtitle: string;
  amount: number;
  totalSpent: number;
  icon: ReactNode;
  gradientClass: string;
  onClick?: () => void;
}

export const ExpenseCategoryCard = ({
  title,
  subtitle,
  amount,
  totalSpent,
  icon,
  gradientClass,
  onClick,
}: ExpenseCategoryCardProps) => {
  const percentage = totalSpent > 0 ? Math.min(Math.round((amount / totalSpent) * 100), 100) : 0;

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 shadow-2xs hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer space-y-3 flex flex-col justify-between group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs transition-transform group-hover:scale-105",
              gradientClass
            )}
          >
            {icon}
          </span>
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate">
              {title}
            </h4>
            <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>
          </div>
        </div>

        <div className="h-6 w-6 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-extrabold text-foreground text-sm tabular-nums">
            ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-bold text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full">
            {percentage}% of total
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", gradientClass)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export interface CategoryBreakdownStripProps {
  categoryTotals: Record<string, number>;
  totalSpent: number;
  onSelectCategory?: (category: string) => void;
}

export function CategoryBreakdownStrip({
  categoryTotals,
  totalSpent,
  onSelectCategory,
}: CategoryBreakdownStripProps) {
  const theme = getModuleTheme("reports");

  const categories = [
    { key: "FOOD", label: "Food & Prasad", desc: "Meals, bhog, catering", gradient: "bg-gradient-to-r from-rose-500 to-red-600" },
    { key: "DECORATION", label: "Stage & Decoration", desc: "Mandap & lighting décor", gradient: "bg-gradient-to-r from-emerald-500 to-teal-600" },
    { key: "SERVICES", label: "Sound & Services", desc: "Sound, generator hire", gradient: "bg-gradient-to-r from-amber-500 to-orange-600" },
    { key: "CULTURAL", label: "Cultural Program", desc: "Artists & performances", gradient: "bg-gradient-to-r from-purple-500 to-indigo-600" },
    { key: "OTHER", label: "Other / Admin", desc: "Miscellaneous expenses", gradient: "bg-gradient-to-r from-slate-600 to-slate-800" },
  ];

  return (
    <div className="rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-xs overflow-hidden space-y-3 p-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0",
              theme.gradient,
            )}
          >
            <PieChart className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Festival Expense Category Breakdown
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Comprehensive category distribution & percentage of total spend
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-extrabold text-foreground px-3 py-1 rounded-full bg-muted/60">
          Total Spent: ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {categories.map((cat) => {
          const amt = categoryTotals[cat.key] || 0;
          const pct =
            totalSpent > 0 ? Math.min(Math.round((amt / totalSpent) * 100), 100) : 0;

          return (
            <div
              key={cat.key}
              onClick={() => onSelectCategory?.(cat.key)}
              className="rounded-lg border border-border/50 p-2.5 hover:border-border hover:bg-muted/30 transition-all cursor-pointer group min-w-0"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={cn(
                      "h-6 w-6 rounded-md shrink-0 flex items-center justify-center text-white text-[10px] font-bold",
                      cat.gradient,
                    )}
                  >
                    {cat.label[0]}
                  </span>

                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-[11px] truncate group-hover:text-primary transition-colors">
                      {cat.label}
                    </p>
                    <p className="text-[9px] text-muted-foreground truncate">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0" />
              </div>

              <div className="mt-2 pt-1.5 border-t border-border/40">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono font-bold text-foreground text-[11px] tabular-nums truncate">
                    ₹
                    {amt.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>

                  <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                    {pct}%
                  </span>
                </div>

                <div className="w-full h-1 rounded-full bg-muted overflow-hidden mt-1">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      cat.gradient,
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExpenseCategoryCard;
