import { createFileRoute } from "@tanstack/react-router";
import SuperAdminSettingsPage from "@/pages/superAdmin/SuperAdminSettingsPage";

export const Route = createFileRoute("/super-admin/settings")({
  component: SuperAdminSettingsPage,
});
