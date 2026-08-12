import { createFileRoute } from "@tanstack/react-router";
import FestivalsPage from "@/pages/festivals/FestivalsPage";

export const Route = createFileRoute("/dashboard/festivals/")({
  component: FestivalsPage,
});
