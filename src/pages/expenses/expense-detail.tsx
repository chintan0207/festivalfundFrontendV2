import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useParams, useRouter } from "@tanstack/react-router";
import { useExpense, useUpdateExpenseStatus } from "@/api/expense/useExpenses";
import { getModuleTheme } from "@/theme/colors";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import { AppButton } from "@/components/common/AppButton";
import { PageHeader } from "@/components/common/PageHeader";
import { PageContainer } from "@/components/common/PageContainer";
import { DetailPageSkeleton } from "@/components/common/DetailPageSkeleton";
import { ExpenseDetailHeader } from "./components/detail/ExpenseDetailHeader";
import { ExpenseStatusHistory } from "./components/detail/ExpenseStatusHistory";
import { ExpenseLinkedCards } from "./components/detail/ExpenseLinkedCards";
import { ExpenseAttachments } from "./components/detail/ExpenseAttachments";
import { ExpenseStatusConfirmDialog } from "./components/ExpenseStatusConfirmDialog";
import { ExpenseDialogs } from "./components/dialogs/ExpenseDialogs";
import { useExpenseDialogs } from "./useExpenseDialogs";
import type { ExpenseStatus } from "@/types/Types";

export default function ExpenseDetailPage() {
  const { expenseId } = useParams({ from: "/dashboard/expenses/$expenseId" });
  const router = useRouter();
  const theme = getModuleTheme("expenses");
  const isAdmin = useIsOrgAdmin();

  const { data: expense, isLoading } = useExpense(expenseId);
  const updateStatus = useUpdateExpenseStatus();
  const [statusTarget, setStatusTarget] = useState<ExpenseStatus | null>(null);

  const dialogs = useExpenseDialogs({
    themeGradient: theme.gradient,
    onEdited: () => router.history.back(),
    onDeleted: () => router.history.back(),
  });

  if (isLoading || !expense) {
    return (
      <PageContainer variant="detail">
        <DetailPageSkeleton />
      </PageContainer>
    );
  }

  const festival =
    typeof expense.festivalId === "object" ? expense.festivalId : undefined;
  const isPending = expense.status === "PENDING";

  return (
    <PageContainer variant="detail">
      <PageHeader
        title=""
        module="expenses"
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Expenses", to: "/dashboard/expenses" },
          { label: expense.expenseCode },
        ]}
        actions={
          isAdmin && (
            <>
              {isPending && (
                <AppButton
                  variant="outline"
                  leftIcon={<Pencil className="h-3.5 w-3.5" />}
                  className="h-8 text-xs rounded-full"
                  onClick={() => dialogs.openEdit(expense)}
                >
                  <span className="hidden sm:inline">Edit</span>
                  <span className="sm:hidden">Edit</span>
                </AppButton>
              )}
              {isPending && (
                <AppButton
                  variant="outline"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  className="h-8 text-xs rounded-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950"
                  onClick={() => dialogs.openDelete(expense._id)}
                >
                  <span className="hidden sm:inline">Delete</span>
                  <span className="sm:hidden">Delete</span>
                </AppButton>
              )}
            </>
          )
        }
      />

      <ExpenseDetailHeader
        expense={expense}
        onRequestStatus={isAdmin ? setStatusTarget : undefined}
      />

      <ExpenseStatusHistory expense={expense} />

      <ExpenseLinkedCards
        expense={expense}
        onFestivalClick={
          festival?._id
            ? () =>
                router.navigate({
                  to: "/dashboard/festivals/$festivalId",
                  params: { festivalId: festival._id },
                })
            : undefined
        }
      />

      <ExpenseAttachments expense={expense} />

      <ExpenseStatusConfirmDialog
        open={!!statusTarget}
        expense={statusTarget ? expense : null}
        nextStatus={statusTarget ?? "PENDING"}
        loading={updateStatus.isPending}
        onConfirm={(reason) => {
          if (statusTarget) {
            updateStatus.mutate(
              { id: expense._id, status: statusTarget, reason },
              { onSettled: () => setStatusTarget(null) },
            );
          }
        }}
        onCancel={() => setStatusTarget(null)}
      />

      <ExpenseDialogs {...dialogs.dialogsProps} />
    </PageContainer>
  );
}
