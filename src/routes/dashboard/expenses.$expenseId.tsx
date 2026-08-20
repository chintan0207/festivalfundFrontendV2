import { createFileRoute } from "@tanstack/react-router";
import ExpenseDetail from "@/pages/expenses/expense-detail";

export const Route = createFileRoute("/dashboard/expenses/$expenseId")({
  component: ExpenseDetail,
});