import { createFileRoute } from "@tanstack/react-router";
import SuperAdminUsersPage from "@/pages/superAdmin/SuperAdminUsersPage";

export const Route = createFileRoute("/super-admin/users")({
  component: SuperAdminUsersPage,
});
