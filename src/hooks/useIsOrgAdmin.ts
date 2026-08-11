import { useAuthStore } from "@/api/auth/auth.store";
import { GlobalRoleEnum } from "@/lib/constants";

/**
 * True when the current user can perform write operations in the org workspace
 * (org admins and super admins). ORG_VIEWER is read-only.
 */
export const useIsOrgAdmin = () => {
  const user = useAuthStore((s) => s.user);
  return (
    user?.role === GlobalRoleEnum.ORG_ADMIN || user?.role === GlobalRoleEnum.SUPER_ADMIN
  );
};
