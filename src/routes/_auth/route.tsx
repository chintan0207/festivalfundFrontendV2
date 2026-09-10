import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/api/auth/auth.store";

import { GlobalRoleEnum } from "@/lib/constants";

export const Route = createFileRoute("/_auth")({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (isAuthenticated) {
      if (user?.role === GlobalRoleEnum.SUPER_ADMIN) {
        throw redirect({ to: "/super-admin/dashboard" as any });
      }
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => <Outlet />,
});
