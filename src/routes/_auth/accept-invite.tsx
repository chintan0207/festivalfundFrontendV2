import { createFileRoute } from "@tanstack/react-router";
import AcceptInvitePage from "@/pages/accept-invite/accept-invite";

export const Route = createFileRoute("/_auth/accept-invite")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string | undefined,
  }),
  component: AcceptInviteRoute,
});

function AcceptInviteRoute() {
  const { token } = Route.useSearch();
  return <AcceptInvitePage token={token || ""} />;
}
