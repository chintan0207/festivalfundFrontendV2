import { createFileRoute } from "@tanstack/react-router";
import ContributorDetail from "@/pages/contributors/contributor-detail";

export const Route = createFileRoute("/dashboard/contributors/$contributorId")({
  component: ContributorDetail,
});
