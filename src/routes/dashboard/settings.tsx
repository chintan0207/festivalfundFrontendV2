import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/api/auth/auth.store";
import { GlobalRoleEnum } from "@/lib/constants";
import Settings from "@/pages/settings/settings";

export const Route = createFileRoute("/dashboard/settings")({
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (user?.role === GlobalRoleEnum.ORG_VIEWER) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: Settings,
});
