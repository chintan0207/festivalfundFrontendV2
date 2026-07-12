import { createFileRoute } from "@tanstack/react-router";
import Contributions from "@/pages/contributions/contributions";

export const Route = createFileRoute("/dashboard/contributions")({
  component: Contributions,
});
