import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import { useAuthStore } from "@/api/auth/auth.store";
import { GlobalRoleEnum } from "@/lib/constants";
import { FestivalFormPage } from "@/pages/festivals/festival-form-page";

export const Route = createFileRoute("/dashboard/festivals/$festivalId/edit")({
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (user?.role === GlobalRoleEnum.ORG_VIEWER) {
      throw redirect({ to: "/dashboard/festivals" });
    }
  },
  component: EditFestivalRoute,
});

function EditFestivalRoute() {
  const { festivalId } = useParams({
    from: "/dashboard/festivals/$festivalId/edit",
  });
  return <FestivalFormPage festivalId={festivalId} />;
}