import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useParams, useRouter } from "@tanstack/react-router";
import { useContributor, useUpdateContributor, useSoftDeleteContributor } from "@/api/contributor/useContributors";
import { useContributions } from "@/api/contribution/useContributions";
import { getModuleTheme } from "@/theme/colors";
import { Skeleton } from "@/components/ui/skeleton";
import { AppButton } from "@/components/common/AppButton";
import { PageHeader } from "@/components/common/PageHeader";
import { ContributorDetailHeader } from "./components/ContributorDetailHeader";
import { ContributorContributions } from "./components/ContributorContributions";
import { ContributorContributionCards } from "./components/ContributorContributionCards";
import { ContributorDialogs, type ContributorFormValues } from "./components/ContributorDialogs";
import type { Contribution, Contributor } from "@/types/Types";

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
    type: "CASH",
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
    type: "CASH",
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
    type: "CASH",
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
    type: "CASH",
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
    type: "CASH",
    status: "DEPOSITED",
    date: "2025-08-22T00:00:00.000Z",
    amount: 5000,
    contributionCode: "CON-006",
    paymentMode: "ONLINE",
    isBalanceApplied: false,
    isDeleted: false,
  },
];

function toArray(data: unknown): Contribution[] {
  if (Array.isArray(data)) return data as Contribution[];
  if (data && typeof data === "object" && "docs" in data) return (data as { docs: Contribution[] }).docs || [];
  if (data && typeof data === "object" && "contributions" in data) return (data as { contributions: Contribution[] }).contributions || [];
  if (data && typeof data === "object" && "data" in data) return toArray((data as { data: unknown }).data);
  return [];
}

export default function ContributorDetailPage() {
  const { contributorId } = useParams({ from: "/dashboard/contributors/$contributorId" });
  const router = useRouter();
  const theme = getModuleTheme("contributors");

  const { data: contributor, isLoading: loadingContributor } = useContributor(contributorId);
  const { data: contributionsData, isLoading: loadingContributions } = useContributions({
    contributorId,
  });
  const updateMutation = useUpdateContributor();
  const deleteMutation = useSoftDeleteContributor();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const contributions = toArray(contributionsData);
  const isDummy = !contributor || contributions.length === 0;
  const activeContributor = contributor || dummyContributor;
  const displayContributions = isDummy ? dummyContributions : contributions;

  const editInitialValues: ContributorFormValues | undefined = {
    name: activeContributor.name,
    phoneNumber: activeContributor.phoneNumber || "",
    email: activeContributor.email || "",
    address: activeContributor.address || "",
    category: activeContributor.category,
  };

  const handleEditSubmit = (values: ContributorFormValues) => {
    updateMutation.mutate(
      { contributorId, payload: values },
      { onSuccess: () => { setIsEditOpen(false); router.history.back(); } },
    );
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(contributorId, {
      onSuccess: () => router.history.back(),
    });
  };

  const totalContributed = displayContributions.reduce((sum, c) => {
    if (c.type === "CASH" && c.amount) return sum + c.amount;
    if (c.type === "ITEM" && c.estimatedValue) return sum + c.estimatedValue;
    return sum;
  }, 0);

  const festivalIds = new Set(
    displayContributions
      .map((c) => (typeof c.festivalId === "object" ? c.festivalId._id : c.festivalId))
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
              onClick={() => setIsEditOpen(true)}
            >
              <span className="hidden sm:inline">Edit</span>
            </AppButton>
            <AppButton
              variant="outline"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              className="h-8 text-xs rounded-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950"
              onClick={() => setIsDeleteOpen(true)}
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
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">Contributions</h2>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            {displayContributions.length}
          </span>
        </div>
        <ContributorContributionCards
          contributions={displayContributions}
          isLoading={loadingContributions}
        />
      </div>

      {/* Contributions - desktop table */}
      <div className="hidden md:block">
        <ContributorContributions
          contributions={displayContributions}
          isLoading={loadingContributions}
          module="contributors"
        />
      </div>

      <ContributorDialogs
        isAddOpen={false}
        isEditOpen={isEditOpen}
        isDeleteOpen={isDeleteOpen}
        editInitialValues={editInitialValues}
        isPending={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
        themeGradient={theme.gradient}
        onAddClose={() => {}}
        onEditClose={() => setIsEditOpen(false)}
        onDeleteClose={() => setIsDeleteOpen(false)}
        onAddSubmit={() => {}}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
