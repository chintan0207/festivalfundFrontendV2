import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicy from "@/pages/privacy-policy/privacy-policy";

export const Route = createFileRoute("/_marketing/privacy-policy")({
  component: PrivacyPolicy,
});
