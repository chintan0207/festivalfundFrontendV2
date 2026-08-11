import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/api/auth/auth.store";
import { GlobalRoleEnum } from "@/lib/constants";
import { FestivalFormPage } from "@/pages/festivals/festival-form-page";

export const Route = createFileRoute("/dashboard/festivals/new")({
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (user?.role === GlobalRoleEnum.ORG_VIEWER) {
      throw redirect({ to: "/dashboard/festivals" });
    }
  },
  component: FestivalFormPage,
});