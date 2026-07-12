import { createFileRoute } from "@tanstack/react-router";
import Support from "@/pages/support/support";

export const Route = createFileRoute("/_marketing/support")({
  component: Support,
});
