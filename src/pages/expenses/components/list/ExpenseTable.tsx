import { Calendar, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { cn, formatDate } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { AppBadge } from "@/components/common/AppBadge";
import { RowActionsMenu } from "@/components/common/RowActionsMenu";
import { StatusBadgeSelect } from "@/components/common/StatusBadgeSelect";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
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

interface ExpenseTableProps {
  expenses: ExpenseListItem[];
  isLoading: boolean;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (expense: ExpenseListItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ExpenseStatus, reason?: string) => Promise<unknown> | void;
  isStatusPending?: boolean;
}

export function ExpenseTable({
  expenses,
  isLoading,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onStatusChange,
  isStatusPending,
}: ExpenseTableProps) {
  const theme = getModuleTheme("expenses");
  const isAdmin = useIsOrgAdmin();
  const [statusTarget, setStatusTarget] = useState<{
    expense: ExpenseListItem;
    status: ExpenseStatus;
  } | null>(null);

  const columns: Column<ExpenseListItem>[] = [
    {
      id: "expenseCode",
      label: "Voucher No",
      sortable: false,
      className: `font-mono font-bold ${theme.iconColor} text-[11px] whitespace-nowrap`,
      render: (e) => e.expenseCode,
    },
    {
      id: "description",
      label: "Description & Vendor",
      sortable: false,
      className: "min-w-[200px] max-w-[380px]",
      render: (e) => {
        const categoryMeta = expenseCategoryMetaOf(e.category);
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={cn(
                "h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-white text-[11px] font-bold",
                categoryMeta?.gradient || theme.gradient,
              )}
              title={expenseCategoryLabel(e.category)}
            >
              {categoryMeta?.Icon ? (
                <categoryMeta.Icon className="h-4 w-4" />
              ) : (
                expenseCategoryLabel(e.category).charAt(0)
              )}
            </span>
            <div className="min-w-0">
              <p className="font-bold text-foreground truncate">{e.description || "—"}</p>
              {e.vendorName && (
                <p className="text-[11px] text-muted-foreground truncate">
                  Paid to: {e.vendorName}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "category",
      label: "Category",
      sortable: true,
      render: (e) => (
        <AppBadge size="xs" className={expenseCategoryBadge(e.category)}>
          {expenseCategoryLabel(e.category)}
        </AppBadge>
      ),
    },
    {
      id: "festival",
      label: "Festival",
      sortable: false,
      render: (e) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {e.festival ? `${e.festival.name} ${e.festival.year || ""}` : "—"}
          </span>
        </div>
      ),
    },
    {
      id: "paymentMode",
      label: "Mode",
      sortable: false,
      render: (e) => (
        <span className="text-muted-foreground whitespace-nowrap">{expensePaymentLabel(e.paymentMode)}</span>
      ),
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (e) => (
        <div onClick={(event) => event.stopPropagation()}>
          {isAdmin ? (
            <StatusBadgeSelect
              status={e.status}
              options={expenseStatusOptions}
              transitions={expenseStatusTransitions[e.status]}
              badgeClass={expenseStatusBadge}
              labelOf={expenseStatusLabel}
              onRequestStatus={(value) =>
                setStatusTarget({ expense: e, status: value as ExpenseStatus })
              }
              disabled={isStatusPending}
              align="start"
            />
          ) : (
            <AppBadge size="sm" className={expenseStatusBadge(e.status)}>
              {expenseStatusLabel(e.status)}
            </AppBadge>
          )}
        </div>
      ),
    },
    {
      id: "date",
      label: "Date",
      sortable: true,
      className: "text-muted-foreground text-[11px] whitespace-nowrap",
      render: (e) => (e.date ? formatDate(e.date) : "—"),
    },
    {
      id: "amount",
      label: "Amount",
      sortable: true,
      className: "font-extrabold text-foreground text-right whitespace-nowrap",
      render: (e) => formatExpenseAmount(e.amount),
    },
    {
      id: "actions",
      label: "",
      sortable: false,
      render: (e) => (
        <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
          {isAdmin ? (
            <RowActionsMenu
              actions={[
                {
                  key: "edit",
                  label: "Edit",
                  icon: <Pencil className="h-3.5 w-3.5" />,
                  show: e.status === "PENDING",
                  onSelect: () => onEdit(e),
                },
                {
                  key: "delete",
                  label: "Delete",
                  icon: <Trash2 className="h-3.5 w-3.5" />,
                  variant: "destructive",
                  separatorBefore: true,
                  show: e.status === "PENDING",
                  onSelect: () => onDelete(e._id),
                },
              ]}
            />
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={expenses}
        keyExtractor={(e) => e._id}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}
        isLoading={isLoading}
        emptyTitle="No expenses found"
        emptyDescription="Try adjusting your search or filters"
        module="expenses"
      />

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
