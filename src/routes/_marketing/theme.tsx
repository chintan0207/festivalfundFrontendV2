import { createFileRoute } from "@tanstack/react-router";
import ThemePage from "@/pages/theme/theme";

export const Route = createFileRoute("/_marketing/theme")({
  component: ThemePage,
});
