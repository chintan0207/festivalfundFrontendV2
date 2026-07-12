import { createFileRoute } from "@tanstack/react-router";
import Contributions from "@/features/contributions/pages/Contributions";

export const Route = createFileRoute("/dashboard/contributions")({
  component: Contributions,
});
