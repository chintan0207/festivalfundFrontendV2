import { Receipt, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppCard } from "@/components/common/AppCard";
import { AppBadge } from "@/components/common/AppBadge";
import { EmptyState } from "@/components/common/EmptyState";
import {
  expenseCategoryLabel,
  expenseCategoryMetaOf,
  expenseStatusLabel,
  expenseStatusBadge,
} from "@/pages/expenses/lib/expenseMeta";
import type {
  DashboardData,
  DashboardExpenseRecent,
} from "@/api/dashboard/dashboard.service";
import { formatINR, formatDate } from "../lib/dashboardFormat";

function ExpenseRow({ e }: { e: DashboardExpenseRecent }) {
  const meta = expenseCategoryMetaOf(e.category);
  const Icon = meta?.Icon || Receipt;
  return (
    <Link
      to="/dashboard/expenses/$expenseId"
      params={{ expenseId: e._id }}
      className="flex items-center gap-3 rounded-xl px-2 py-2 -mx-2 hover:bg-muted/40 transition-colors"
    >
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 ${meta?.gradient || ""}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground truncate">
            {e.vendorName || e.description || expenseCategoryLabel(e.category)}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
          <span className="truncate">{e.expenseCode}</span>
          <span>·</span>
          <span>{expenseCategoryLabel(e.category)}</span>
          <span>·</span>
          <span>{formatDate(e.date)}</span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-foreground tabular-nums">
          {formatINR(e.amount)}
        </p>
        <AppBadge size="xs" className={expenseStatusBadge(e.status)}>
          {expenseStatusLabel(e.status)}
        </AppBadge>
      </div>
    </Link>
  );
}

export function DashboardRecentExpenses({
  data,
  limit,
}: {
  data: DashboardData;
  limit?: number;
}) {
  const recent = limit ? data.expenses.recent.slice(0, limit) : data.expenses.recent;

  return (
    <AppCard
      icon={<Receipt className="h-4 w-4" />}
      title="Recent Expenses"
      subtitle={`${data.expenses.totalCount} total records`}
      compact
      className="flex h-full flex-col"
    >
      {recent.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses yet"
          description="Record an expense from the quick actions above."
        />
      ) : (
        <div className="divide-y divide-border/60 flex-1">
          {recent.map((e) => (
            <ExpenseRow key={e._id} e={e} />
          ))}
        </div>
      )}

      <Link
        to="/dashboard/expenses"
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        View all expenses <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </AppCard>
  );
}
