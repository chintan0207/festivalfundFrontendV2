import { Pencil, Search, Trash2, Building2, Calendar } from "lucide-react";
import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/common/EmptyState";
import { RowActionsMenu } from "@/components/common/RowActionsMenu";
import { StatusBadgeSelect } from "@/components/common/StatusBadgeSelect";
import { AppBadge } from "@/components/common/AppBadge";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import { CardListSkeleton } from "@/components/common/CardListSkeleton";
import { getModuleTheme } from "@/theme/colors";
import {
  expenseCategoryBadge,
  expenseCategoryLabel,
  expenseCategoryMetaOf,
  expensePaymentLabel,
  expenseStatusBadge,
  expenseStatusLabel,
  expenseStatusOptions,
  expenseStatusTransitions,
  formatExpenseAmount,
} from "../../lib/expenseMeta";
import { ExpenseStatusConfirmDialog } from "../ExpenseStatusConfirmDialog";
import type { ExpenseListItem, ExpenseStatus } from "@/types/Types";

interface ExpenseMobileCardsProps {
  expenses: ExpenseListItem[];
  isLoading: boolean;
  minimal?: boolean;
  onEdit: (expense: ExpenseListItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (
    id: string,
    status: ExpenseStatus,
    reason?: string,
  ) => Promise<unknown> | void;
  isStatusPending?: boolean;
}

function ExpenseCard({
  expense,
  minimal,
  onEdit,
  onDelete,
  onRequestStatus,
  isStatusPending,
}: {
  expense: ExpenseListItem;
  minimal?: boolean;
  onEdit: (e: ExpenseListItem) => void;
  onDelete: (id: string) => void;
  onRequestStatus: (status: ExpenseStatus) => void;
  isStatusPending?: boolean;
}) {
  const theme = getModuleTheme("expenses");
  const isAdmin = useIsOrgAdmin();
  const amount = formatExpenseAmount(expense.amount);
  const categoryMeta = expenseCategoryMetaOf(expense.category);

  const avatar = (
    <span
      className={cn(
        "h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-white text-[11px] font-bold",
        categoryMeta?.gradient || theme.gradient,
      )}
      title={expenseCategoryLabel(expense.category)}
    >
      {categoryMeta?.Icon ? (
        <categoryMeta.Icon className="h-4 w-4" />
      ) : (
        expenseCategoryLabel(expense.category).charAt(0)
      )}
    </span>
  );

  const statusSelect = isAdmin ? (
    <StatusBadgeSelect
      status={expense.status}
      options={expenseStatusOptions}
      transitions={expenseStatusTransitions[expense.status]}
      badgeClass={expenseStatusBadge}
      labelOf={expenseStatusLabel}
      onRequestStatus={(s) => onRequestStatus(s as ExpenseStatus)}
      disabled={isStatusPending}
      align="end"
    />
  ) : (
    <AppBadge size="sm" className={expenseStatusBadge(expense.status)}>
      {expenseStatusLabel(expense.status)}
    </AppBadge>
  );

  const actionsMenu = isAdmin ? (
    <RowActionsMenu
      actions={[
        {
          key: "edit",
          label: "Edit",
          icon: <Pencil className="h-3.5 w-3.5" />,
          show: expense.status === "PENDING",
          onSelect: () => onEdit(expense),
        },
        {
          key: "delete",
          label: "Delete",
          icon: <Trash2 className="h-3.5 w-3.5" />,
          variant: "destructive",
          separatorBefore: true,
          show: expense.status === "PENDING",
          onSelect: () => onDelete(expense._id),
        },
      ]}
    />
  ) : null;

  if (minimal) {
    return (
      <div className="rounded-2xl bg-card border border-border/80 shadow-xs transition-transform overflow-hidden">
        <div className="p-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {avatar}
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-foreground truncate">
                  {expense.description || "Expense"}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground truncate">
                  {expense.expenseCode}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <p className="text-sm font-extrabold text-foreground whitespace-nowrap tabular-nums">
                {amount}
              </p>
              <div onClick={(e) => e.stopPropagation()}>{statusSelect}</div>
              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                {actionsMenu}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-border/80 shadow-xs transition-transform overflow-hidden">
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center gap-2.5">
          {avatar}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">
              {expense.description || "Expense"}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">{expense.expenseCode}</p>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
            {actionsMenu}
          </div>
        </div>

        <div className="space-y-1.5 pl-[10px]">
          <div className="flex items-center justify-between gap-2 text-muted-foreground">
            <div className="flex items-center gap-1.5 min-w-0">
              <Building2 className={`h-3 w-3 shrink-0 ${theme.iconColor}`} />
              <span className="text-[11px] truncate">
                {expense.vendorName || expensePaymentLabel(expense.paymentMode)}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground/70">
              {expense.date ? formatDate(expense.date) : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <p className="text-base font-extrabold text-foreground break-words tabular-nums">
                {amount}
              </p>
              <AppBadge size="xs" className={expenseCategoryBadge(expense.category)}>
                {expenseCategoryLabel(expense.category)}
              </AppBadge>
            </div>

            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              {statusSelect}
            </div>
          </div>

          {expense.festival && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {expense.festival.name} {expense.festival.year || ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ExpenseMobileCards({
  expenses,
  isLoading,
  minimal,
  onEdit,
  onDelete,
  onStatusChange,
  isStatusPending,
}: ExpenseMobileCardsProps) {
  const [statusTarget, setStatusTarget] = useState<{
    expense: ExpenseListItem;
    status: ExpenseStatus;
  } | null>(null);

  if (isLoading) {
    return <CardListSkeleton />;
  }

  if (expenses.length === 0) {
    return (
      <div className="md:hidden">
        <EmptyState
          icon={Search}
          title="No expenses found"
          description="Try adjusting your search or filters"
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {expenses.map((e) => (
          <ExpenseCard
            key={e._id}
            expense={e}
            minimal={minimal}
            onEdit={onEdit}
            onDelete={onDelete}
            onRequestStatus={(status) => setStatusTarget({ expense: e, status })}
            isStatusPending={isStatusPending}
          />
        ))}
      </div>

      <ExpenseStatusConfirmDialog
        open={!!statusTarget}
        expense={statusTarget?.expense ?? null}
        nextStatus={statusTarget?.status ?? "PENDING"}
        loading={isStatusPending}
        onConfirm={async (reason) => {
          if (statusTarget) {
            try {
              await onStatusChange(statusTarget.expense._id, statusTarget.status, reason);
              setStatusTarget(null);
            } catch {
              // keep dialog open so the user can retry
            }
          }
        }}
        onCancel={() => setStatusTarget(null)}
      />
    </>
  );
}
