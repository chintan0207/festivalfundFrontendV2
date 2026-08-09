import { createFileRoute } from "@tanstack/react-router";
import { FestivalDetailPage } from "@/pages/festivals/festival-detail";

export const Route = createFileRoute("/dashboard/festivals/$festivalId")({
  component: FestivalDetailPage,
});