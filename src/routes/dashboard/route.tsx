import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/api/auth/auth.store";
import { GlobalRoleEnum } from "@/lib/constants";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
    if (
      user?.role !== GlobalRoleEnum.ORG_ADMIN &&
      user?.role !== GlobalRoleEnum.ORG_VIEWER
    ) {
      throw redirect({ to: "/" });
    }
  },
  component: DashboardLayout,
});
