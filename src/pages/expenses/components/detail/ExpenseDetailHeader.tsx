import { Calendar, Building2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { AppBadge } from "@/components/common/AppBadge";
import { getModuleTheme } from "@/theme/colors";
import { StatusBadgeSelect } from "@/components/common/StatusBadgeSelect";
import { DetailStatsRow } from "@/components/common/DetailStatsRow";
import {
  expenseCategoryLabel,
  expenseCategoryMetaOf,
  expensePaymentLabel,
  expenseStatusBadge,
  expenseStatusLabel,
  expenseStatusOptions,
  expenseStatusTransitions,
  formatExpenseAmount,
} from "../../lib/expenseMeta";
import type { Expense, ExpenseStatus } from "@/types/Types";

export function ExpenseDetailHeader({
  expense,
  onRequestStatus,
}: {
  expense: Expense;
  onRequestStatus?: (status: ExpenseStatus) => void;
}) {
  const theme = getModuleTheme("expenses");
  const categoryMeta = expenseCategoryMetaOf(expense.category);

  return (
    <div className="rounded-2xl bg-card border border-border/80 shadow-sm overflow-hidden">
      <div className="p-3.5 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md",
                categoryMeta?.gradient || theme.gradient,
              )}
            >
              {categoryMeta?.Icon ? (
                <categoryMeta.Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </div>
            <div>
              <h1 className={`font-mono font-bold text-sm sm:text-lg ${theme.iconColor}`}>
                {expense.expenseCode}
              </h1>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                {expenseCategoryLabel(expense.category)} expense
              </p>
            </div>
          </div>

          {onRequestStatus ? (
            <StatusBadgeSelect
              status={expense.status}
              options={expenseStatusOptions}
              transitions={expenseStatusTransitions[expense.status]}
              badgeClass={expenseStatusBadge}
              labelOf={expenseStatusLabel}
              onRequestStatus={(value) => onRequestStatus(value as ExpenseStatus)}
              size="md"
              align="end"
            />
          ) : (
            <AppBadge size="sm" className={expenseStatusBadge(expense.status)}>
              {expenseStatusLabel(expense.status)}
            </AppBadge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
          {expense.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 shrink-0" />
              {formatDate(expense.date)}
            </span>
          )}
          <span>Mode: {expensePaymentLabel(expense.paymentMode)}</span>
          {expense.vendorName && (
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3 w-3 shrink-0" />
              Paid to: {expense.vendorName}
            </span>
          )}
          {expense.isBalanceApplied && <span>Balance applied</span>}
        </div>
      </div>

      <DetailStatsRow
        stats={[
          { label: "Category", value: expenseCategoryLabel(expense.category) },
          {
            label: "Amount",
            labelSm: "Amt",
            value: formatExpenseAmount(expense.amount),
          },
          { label: "Payment", value: expensePaymentLabel(expense.paymentMode) },
          { label: "Status", value: expenseStatusLabel(expense.status) },
        ]}
      />
    </div>
  );
}
