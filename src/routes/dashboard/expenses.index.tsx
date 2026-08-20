import { createFileRoute } from "@tanstack/react-router";
import Expenses from "@/pages/expenses/expenses";

export const Route = createFileRoute("/dashboard/expenses/")({
  component: Expenses,
});
