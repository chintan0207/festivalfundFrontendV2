import { createFileRoute } from "@tanstack/react-router";
import SuperAdminAuditPage from "@/pages/superAdmin/SuperAdminAuditPage";

export const Route = createFileRoute("/super-admin/audit-logs")({
  component: SuperAdminAuditPage,
});
