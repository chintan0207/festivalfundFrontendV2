import { createFileRoute } from "@tanstack/react-router";
import { FestivalFormPage } from "@/pages/festivals/festival-form-page";

export const Route = createFileRoute("/dashboard/festivals/new")({
  component: FestivalFormPage,
});