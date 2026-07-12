import { createFileRoute } from "@tanstack/react-router";
import AppComponentsPage from "@/theme/AppComponentsPage";

export const Route = createFileRoute("/_marketing/app")({
  component: AppComponentsPage,
});
