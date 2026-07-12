import { createFileRoute } from "@tanstack/react-router";
import ThemePage from "@/theme/ThemePage";

export const Route = createFileRoute("/_marketing/theme")({
  component: ThemePage,
});
