import { createFileRoute } from "@tanstack/react-router";
import ContributionDetail from "@/pages/contributions/contribution-detail";

export const Route = createFileRoute("/dashboard/contributions/$contributionId")({
  component: ContributionDetail,
});
