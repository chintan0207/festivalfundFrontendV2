import { createFileRoute } from "@tanstack/react-router";
import Reports from "@/features/reports/pages/Reports";

export const Route = createFileRoute("/dashboard/reports")({
  component: Reports,
});
