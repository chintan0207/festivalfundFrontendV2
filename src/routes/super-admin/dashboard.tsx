import { createFileRoute } from "@tanstack/react-router";
import SuperAdminDashboardPage from "@/pages/superAdmin/SuperAdminDashboardPage";

export const Route = createFileRoute("/super-admin/dashboard")({
  component: SuperAdminDashboardPage,
});
