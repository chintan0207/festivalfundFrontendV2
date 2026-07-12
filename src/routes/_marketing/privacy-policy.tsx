import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

export const Route = createFileRoute("/_marketing/privacy-policy")({
  component: PrivacyPolicy,
});
