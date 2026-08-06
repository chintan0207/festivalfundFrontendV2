import { Pencil, Trash2 } from "lucide-react";
import { useParams, useRouter } from "@tanstack/react-router";
import { useContributor } from "@/api/contributor/useContributors";
import { useContributions } from "@/api/contribution/useContributions";
import { getModuleTheme } from "@/theme/colors";
import { Skeleton } from "@/components/ui/skeleton";
import { AppButton } from "@/components/common/AppButton";
import { PageHeader } from "@/components/common/PageHeader";
import { contributionTotal } from "@/lib/contributionFormat";
import { ContributorDetailHeader } from "./components/detail/ContributorDetailHeader";
import { ContributionsSectionHeading } from "./components/detail/ContributionsSectionHeading";
import { ContributorContributions } from "./components/detail/ContributorContributions";
import { ContributorContributionCards } from "./components/detail/ContributorContributionCards";
import { ContributorDialogs } from "./components/dialogs/ContributorDialogs";
import { useContributorDialogs } from "./useContributorDialogs";
import type { Contribution, ContributionListItem, Contributor } from "@/types/Types";

const dummyContributor: Contributor = {
  _id: "dummy-001",
  organizationId: "org-1",
  contributorCode: "CTR-0042",
  name: "Ramesh Sharma",
  phoneNumber: "+91 98765 43210",
  email: "ramesh.sharma@example.com",
  address: "12, Navrangpura, Ahmedabad - 380009",
  category: "PARENT",
  isActive: true,
  notes: "Regular donor since 2023. Prefers to donate during major festivals.",
  createdAt: "2023-03-05T10:00:00.000Z",
};

const dummyContributions: Contribution[] = [
  {
    _id: "con-dummy-1",
    organizationId: "org-1",
    contributorId: dummyContributor._id,
    festivalId: { _id: "fest-1", name: "Ganesh Chaturthi", year: 2026 } as never,
    type: "MONEY",
    status: "DEPOSITED",
    date: "2026-05-12T00:00:00.000Z",
    amount: 5000,
    contributionCode: "CON-001",
    paymentMode: "CASH",
    isBalanceApplied: false,
    isDeleted: false,
  },
  {
    _id: "con-dummy-2",
    organizationId: "org-1",
    contributorId: dummyContributor._id,
    festivalId: { _id: "fest-2", name: "Diwali", year: 2025 } as never,
    type: "MONEY",
    status: "DEPOSITED",
    date: "2025-11-05T00:00:00.000Z",
    amount: 2000,
    contributionCode: "CON-002",
    paymentMode: "CASH",
    isBalanceApplied: false,
    isDeleted: false,
  },
  {
    _id: "con-dummy-3",
    organizationId: "org-1",
    contributorId: dummyContributor._id,
    festivalId: { _id: "fest-3", name: "Holi", year: 2026 } as never,
    type: "ITEM",
    status: "PENDING",
    date: "2026-03-20T00:00:00.000Z",
    estimatedValue: 1500,
    itemName: "Colors & Pichkari set",
    contributionCode: "CON-003",
    paymentMode: "CASH",
    isBalanceApplied: false,
    isDeleted: false,
  },
  {
    _id: "con-dummy-4",
    organizationId: "org-1",
    contributorId: dummyContributor._id,
    festivalId: { _id: "fest-4", name: "Navratri", year: 2026 } as never,
    type: "MONEY",
    status: "CANCELLED",
    date: "2026-04-10T00:00:00.000Z",
    amount: 3500,
    contributionCode: "CON-004",
    paymentMode: "ONLINE",
    isBalanceApplied: false,
    isDeleted: false,
  },
  {
    _id: "con-dummy-5",
    organizationId: "org-1",
    contributorId: dummyContributor._id,
    festivalId: { _id: "fest-5", name: "Diwali", year: 2024 } as never,
    type: "MONEY",
    status: "DEPOSITED",
    date: "2024-10-28T00:00:00.000Z",
    amount: 4000,
    contributionCode: "CON-005",
    paymentMode: "CASH",
    isBalanceApplied: false,
    isDeleted: false,
  },
  {
    _id: "con-dummy-6",
    organizationId: "org-1",
    contributorId: dummyContributor._id,
    festivalId: { _id: "fest-6", name: "Ganesh Chaturthi", year: 2025 } as never,
    type: "MONEY",
    status: "DEPOSITED",
    date: "2025-08-22T00:00:00.000Z",
    amount: 5000,
    contributionCode: "CON-006",
    paymentMode: "ONLINE",
    isBalanceApplied: false,
    isDeleted: false,
  },
];

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

  const contributions = contributionsData?.contributions || [];
  const isDummy = !contributor || contributions.length === 0;
  const activeContributor = contributor || dummyContributor;
  const displayContributions: ContributionListItem[] = isDummy
    ? (dummyContributions as unknown as ContributionListItem[])
    : contributions;

  const totalContributed = contributionTotal(displayContributions);

  const festivalIds = new Set(
    displayContributions
      .map((c) => {
        const legacy = (c as Partial<Contribution>).festivalId;
        if (typeof legacy === "string") return legacy;
        if (legacy && typeof legacy === "object") return legacy._id;
        return c.festival?._id;
      })
      .filter(Boolean),
  );

  const dates = displayContributions
    .map((c) => c.date)
    .filter(Boolean)
    .sort();

  const firstDate = dates[0] || "";
  const lastDate = dates[dates.length - 1] || "";

  if (loadingContributor && !isDummy) {
    return (
      <div className="space-y-5 pb-28 md:pb-10 max-w-[1400px] mx-auto px-1 sm:px-0">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-28 md:pb-10 max-w-[1400px] mx-auto px-1 sm:px-0">
      <PageHeader
        module="contributors"
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Contributors", to: "/dashboard/contributors" },
          { label: activeContributor.name },
        ]}
        actions={
          <>
            <AppButton
              variant="outline"
              leftIcon={<Pencil className="h-3.5 w-3.5" />}
              className="h-8 text-xs rounded-full"
              onClick={() => dialogs.openEdit(activeContributor)}
            >
              <span className="hidden sm:inline">Edit</span>
            </AppButton>
            <AppButton
              variant="outline"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              className="h-8 text-xs rounded-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950"
              onClick={() => dialogs.openDelete(activeContributor._id)}
            >
              <span className="hidden sm:inline">Delete</span>
            </AppButton>
          </>
        }
      />

      {/* Profile + Stats */}
      <ContributorDetailHeader
        contributor={activeContributor}
        totalContributed={totalContributed}
        festivalCount={festivalIds.size}
        firstDate={firstDate}
        lastDate={lastDate}
      />

      {/* Contributions - mobile cards */}
      <div className="md:hidden space-y-3">
        <ContributionsSectionHeading count={displayContributions.length} />
        <ContributorContributionCards
          contributions={displayContributions as Contribution[]}
          isLoading={loadingContributions}
        />
      </div>

      {/* Contributions - desktop table */}
      <div className="hidden md:block">
        <ContributorContributions
          contributions={displayContributions as Contribution[]}
          isLoading={loadingContributions}
          module="contributors"
        />
      </div>

      <ContributorDialogs {...dialogs.dialogsProps} />
    </div>
  );
}
