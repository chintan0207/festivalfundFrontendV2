import { createFileRoute } from "@tanstack/react-router";
import TermsOfService from "@/pages/TermsOfService";

export const Route = createFileRoute("/_marketing/terms-of-service")({
  component: TermsOfService,
});
