import { createFileRoute } from "@tanstack/react-router";
import Contributors from "@/pages/contributors/contributors";

export const Route = createFileRoute("/dashboard/contributors/")({
  component: Contributors,
});
