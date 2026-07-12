import { createFileRoute } from "@tanstack/react-router";
import Expenses from "@/features/expenses/pages/Expenses";

export const Route = createFileRoute("/dashboard/expenses")({
  component: Expenses,
});
