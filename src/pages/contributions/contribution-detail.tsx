import { useState } from "react";
import { Pencil, Trash2, FileDown } from "lucide-react";
import { useParams, useRouter } from "@tanstack/react-router";
import {
  useContribution,
  useDownloadContributionSlip,
  useUpdateContributionStatus,
} from "@/api/contribution/useContributions";
import { getModuleTheme } from "@/theme/colors";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import { AppButton } from "@/components/common/AppButton";
import { PageHeader } from "@/components/common/PageHeader";
import { PageContainer } from "@/components/common/PageContainer";
import { DetailPageSkeleton } from "@/components/common/DetailPageSkeleton";
import { PublicVerificationShare } from "@/components/common/PublicVerificationShare";
import { ContributionDetailHeader } from "./components/detail/ContributionDetailHeader";
import { ContributionLinkedCards } from "./components/detail/ContributionLinkedCards";
import { StatusConfirmDialog } from "./components/StatusConfirmDialog";
import { ContributionStatusHistory } from "./components/detail/ContributionStatusHistory";
import { ContributionDialogs } from "./components/dialogs/ContributionDialogs";
import { useContributionDialogs } from "./useContributionDialogs";
import type { ContributionStatus } from "@/types/Types";

export default function ContributionDetailPage() {
  const { contributionId } = useParams({
    from: "/dashboard/contributions/$contributionId",
  });
  const router = useRouter();
  const theme = getModuleTheme("contributions");
  const isAdmin = useIsOrgAdmin();

  const { data: contribution, isLoading } = useContribution(contributionId);
  const downloadSlip = useDownloadContributionSlip();
  const updateStatus = useUpdateContributionStatus();
  const [statusTarget, setStatusTarget] = useState<ContributionStatus | null>(null);

  const dialogs = useContributionDialogs({
    themeGradient: theme.gradient,
    onEdited: () => router.history.back(),
    onDeleted: () => router.history.back(),
  });

  if (isLoading || !contribution) {
    return (
      <PageContainer variant="detail">
        <DetailPageSkeleton />
      </PageContainer>
    );
  }

  const contributorId = contribution.contributor?._id;
  const status = contribution.status;
  const isDeposited = status === "DEPOSITED";

  return (
    <PageContainer variant="detail">
      <PageHeader
        title=""
        module="contributions"
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Contributions", to: "/dashboard/contributions" },
          { label: contribution.contributionCode },
        ]}
        actions={
          <>
            <PublicVerificationShare phone={contribution.contributor?.phoneNumber} />
            {isAdmin && (
              <>
                {isDeposited && (
                  <AppButton
                    variant="outline"
                    leftIcon={<FileDown className="h-3.5 w-3.5" />}
                    className="h-8 text-xs rounded-full"
                    onClick={() => downloadSlip.mutate(contribution._id)}
                    loading={downloadSlip.isPending}
                  >
                    <span className="hidden sm:inline">Download Slip</span>
                    <span className="sm:hidden">Slip</span>
                  </AppButton>
                )}
                {status === "PENDING" && (
                  <AppButton
                    variant="outline"
                    leftIcon={<Pencil className="h-3.5 w-3.5" />}
                    className="h-8 text-xs rounded-full"
                    onClick={() => dialogs.openEdit(contribution)}
                  >
                    <span className="hidden sm:inline">Edit</span>
                  </AppButton>
                )}
                {!isDeposited && (
                  <AppButton
                    variant="outline"
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                    className="h-8 text-xs rounded-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950"
                    onClick={() => dialogs.openDelete(contribution._id)}
                  >
                    <span className="hidden sm:inline">Delete</span>
                  </AppButton>
                )}
              </>
            )}
          </>
        }
      />

      <ContributionDetailHeader
        contribution={contribution}
        onRequestStatus={isAdmin ? setStatusTarget : undefined}
      />

      <ContributionStatusHistory contribution={contribution} />

      <ContributionLinkedCards
        contribution={contribution}
        onContributorClick={
          contributorId
            ? () =>
                router.navigate({
                  to: "/dashboard/contributors/$contributorId",
                  params: { contributorId },
                })
            : undefined
        }
      />

      <StatusConfirmDialog
        open={!!statusTarget}
        contribution={contribution}
        nextStatus={statusTarget ?? "PENDING"}
        loading={updateStatus.isPending}
        onConfirm={(reason) => {
          if (statusTarget) {
            updateStatus.mutate(
              { id: contribution._id, status: statusTarget, reason },
              { onSettled: () => setStatusTarget(null) },
            );
          }
        }}
        onCancel={() => setStatusTarget(null)}
      />

      <ContributionDialogs {...dialogs.dialogsProps} />
    </PageContainer>
  );
}
