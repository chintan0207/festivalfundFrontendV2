import { createFileRoute } from "@tanstack/react-router";
import SuperAdminOrganizationsPage from "@/pages/superAdmin/SuperAdminOrganizationsPage";

export const Route = createFileRoute("/super-admin/organizations")({
  component: SuperAdminOrganizationsPage,
});
