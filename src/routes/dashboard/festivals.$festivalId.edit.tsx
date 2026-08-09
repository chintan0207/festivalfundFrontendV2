import { createFileRoute, useParams } from "@tanstack/react-router";
import { FestivalFormPage } from "@/pages/festivals/festival-form-page";

export const Route = createFileRoute("/dashboard/festivals/$festivalId/edit")({
  component: EditFestivalRoute,
});

function EditFestivalRoute() {
  const { festivalId } = useParams({
    from: "/dashboard/festivals/$festivalId/edit",
  });
  return <FestivalFormPage festivalId={festivalId} />;
}