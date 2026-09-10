import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/api/auth/auth.store";
import { GlobalRoleEnum } from "@/lib/constants";
import SuperAdminLayout from "@/layouts/superAdmin/SuperAdminLayout";

export const Route = createFileRoute("/super-admin")({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
    if (user?.role !== GlobalRoleEnum.SUPER_ADMIN) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: SuperAdminLayout,
});
