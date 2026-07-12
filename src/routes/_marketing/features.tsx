import { createFileRoute } from "@tanstack/react-router";
import Features from "@/pages/features/features";

export const Route = createFileRoute("/_marketing/features")({
  component: Features,
});
