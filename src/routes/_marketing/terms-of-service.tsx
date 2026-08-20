import { createFileRoute } from "@tanstack/react-router";
import TermsOfService from "@/pages/terms-of-service/terms-of-service";

export const Route = createFileRoute("/_marketing/terms-of-service")({
  component: TermsOfService,
});
