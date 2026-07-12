import { createFileRoute } from "@tanstack/react-router";
import Contributors from "@/features/contributors/pages/Contributors";

export const Route = createFileRoute("/dashboard/contributors")({
  component: Contributors,
});
