import { createFileRoute } from "@tanstack/react-router";
import SuperAdminFestivalsPage from "@/pages/superAdmin/SuperAdminFestivalsPage";

export const Route = createFileRoute("/super-admin/festivals")({
  component: SuperAdminFestivalsPage,
});
