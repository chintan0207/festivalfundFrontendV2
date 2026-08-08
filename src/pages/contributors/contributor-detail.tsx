import { useCallback } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { useParams, useRouter } from "@tanstack/react-router";
import { useContributor } from "@/api/contributor/useContributors";
import { useContributions } from "@/api/contribution/useContributions";
import { getModuleTheme } from "@/theme/colors";
import { Skeleton } from "@/components/ui/skeleton";
import { AppButton } from "@/components/common/AppButton";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { contributionTotal } from "@/lib/contributionFormat";
import { ContributorDetailHeader } from "./components/detail/ContributorDetailHeader";
import { ContributionsSectionHeading } from "./components/detail/ContributionsSectionHeading";
import { ContributorContributions } from "./components/detail/ContributorContributions";
import { ContributorContributionCards } from "./components/detail/ContributorContributionCards";
import { ContributorDialogs } from "./components/dialogs/ContributorDialogs";
import { useContributorDialogs } from "./useContributorDialogs";
import type { Contribution, ContributionListItem } from "@/types/Types";

export default function ContributorDetailPage() {
  const { contributorId } = useParams({ from: "/dashboard/contributors/$contributorId" });
  const router = useRouter();
  const theme = getModuleTheme("contributors");

  const { data: contributor, isLoading: loadingContributor } = useContributor(contributorId);
  const { data: contributionsData, isLoading: loadingContributions } = useContributions({
    contributorId,
  });

  const dialogs = useContributorDialogs({
    themeGradient: theme.gradient,
    onEdited: () => router.history.back(),
    onDeleted: () => router.history.back(),
  });

  const contributions = (contributionsData?.contributions || []) as ContributionListItem[];

  const totalContributed = contributionTotal(contributions);

  const festivalIds = new Set(
    contributions
      .map((c) => {
        const legacy = (c as Partial<Contribution>).festivalId;
        if (typeof legacy === "string") return legacy;
        if (legacy && typeof legacy === "object") return legacy._id;
        return c.festival?._id;
      })
      .filter(Boolean),
  );

  const dates = contributions
    .map((c) => c.date)
    .filter(Boolean)
    .sort();

  const firstDate = dates[0] || "";
  const lastDate = dates[dates.length - 1] || "";

  const handleContributionClick = useCallback(
    (contribution: Contribution) => {
      router.navigate({
        to: "/dashboard/contributions/$contributionId",
        params: { contributionId: contribution._id },
      });
    },
    [router],
  );

  if (loadingContributor && !contributor) {
    return (
      <div className="space-y-5 pb-28 md:pb-10 max-w-[1400px] mx-auto px-1 sm:px-0">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!contributor) {
    return (
      <div className="space-y-5 pb-28 md:pb-10 max-w-[1400px] mx-auto px-1 sm:px-0">
        <EmptyState
          icon={Search}
          title="Contributor not found"
          description="This contributor may have been deleted or the link is invalid."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-28 md:pb-10 max-w-[1400px] mx-auto px-1 sm:px-0">
      <PageHeader
        module="contributors"
        title=""
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Contributors", to: "/dashboard/contributors" },
          { label: contributor.name },
        ]}
        actions={
          <>
            <AppButton
              variant="outline"
              leftIcon={<Pencil className="h-3.5 w-3.5" />}
              className="h-8 text-xs rounded-full"
              onClick={() => dialogs.openEdit(contributor)}
            >
              <span className="hidden sm:inline">Edit</span>
            </AppButton>
            <AppButton
              variant="outline"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              className="h-8 text-xs rounded-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950"
              onClick={() => dialogs.openDelete(contributor._id)}
            >
              <span className="hidden sm:inline">Delete</span>
            </AppButton>
          </>
        }
      />

      {/* Profile + Stats */}
      <ContributorDetailHeader
        contributor={contributor}
        totalContributed={totalContributed}
        festivalCount={festivalIds.size}
        firstDate={firstDate}
        lastDate={lastDate}
      />

      {/* Contributions - mobile cards */}
      <div className="md:hidden space-y-3">
        <ContributionsSectionHeading count={contributions.length} />
        <ContributorContributionCards
          contributions={contributions as Contribution[]}
          isLoading={loadingContributions}
          onRowClick={handleContributionClick}
        />
      </div>

      {/* Contributions - desktop table */}
      <div className="hidden md:block">
        <ContributorContributions
          contributions={contributions as Contribution[]}
          isLoading={loadingContributions}
          onRowClick={handleContributionClick}
          module="contributors"
        />
      </div>

      <ContributorDialogs {...dialogs.dialogsProps} />
    </div>
  );
}