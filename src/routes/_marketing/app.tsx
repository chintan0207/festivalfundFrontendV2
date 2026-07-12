import { createFileRoute } from "@tanstack/react-router";
import AppComponentsPage from "@/pages/app/app";

export const Route = createFileRoute("/_marketing/app")({
  component: AppComponentsPage,
});
