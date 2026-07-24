import { createFileRoute } from "@tanstack/react-router";
import ResetPassword from "@/pages/reset-password/reset-password";

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPassword,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string | undefined,
  }),
});