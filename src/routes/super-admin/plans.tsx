import { createFileRoute } from "@tanstack/react-router";
import SuperAdminPlansPage from "@/pages/superAdmin/SuperAdminPlansPage";

export const Route = createFileRoute("/super-admin/plans")({
  component: SuperAdminPlansPage,
});
