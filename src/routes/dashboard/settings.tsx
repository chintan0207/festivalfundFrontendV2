import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/features/settings/pages/Settings";

export const Route = createFileRoute("/dashboard/settings")({
  component: Settings,
});
