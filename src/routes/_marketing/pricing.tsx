import { createFileRoute } from "@tanstack/react-router";
import Pricing from "@/pages/pricing/pricing";

export const Route = createFileRoute("/_marketing/pricing")({
  component: Pricing,
});
