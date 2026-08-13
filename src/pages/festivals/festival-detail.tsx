import { useState } from "react";
import { Outlet, useMatches, useParams, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Edit, MapPin, RotateCcw, Tag, Trash2 } from "lucide-react";
import {
  useFestival,
  useUpdateFestival,
  useSoftDeleteFestival,
  useRestoreFestival,
} from "@/api/festival/useFestivals";
import { getModuleTheme } from "@/theme/colors";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import { AppButton } from "@/components/common/AppButton";
import { PageHeader } from "@/components/common/PageHeader";
import { PageContainer } from "@/components/common/PageContainer";
import { DetailPageSkeleton } from "@/components/common/DetailPageSkeleton";
import { DetailStatsRow, type DetailStat } from "@/components/common/DetailStatsRow";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { StatusBadgeSelect } from "@/components/common/StatusBadgeSelect";
import { AppBadge } from "@/components/common/AppBadge";
import { cn } from "@/lib/utils";
import {
  festivalCategoryBadge,
  festivalStatusBadge,
  festivalStatusLabel,
  festivalStatusOptions,
  festivalStatusTransition,
} from "./lib/festivalMeta";
import type { FestivalStatus } from "@/types/Types";

const formatCurrencyShort = (amount: number = 0) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, "")}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatCleanDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export function FestivalDetailPage() {
  const { festivalId } = useParams({ from: "/dashboard/festivals/$festivalId" });
  const router = useRouter();
  const theme = getModuleTheme("festivals");
  const isAdmin = useIsOrgAdmin();

  const { data: festival, isLoading } = useFestival(festivalId);
  const updateMutation = useUpdateFestival();
  const deleteMutation = useSoftDeleteFestival();
  const restoreMutation = useRestoreFestival();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<FestivalStatus | null>(null);
  const matches = useMatches();

  if (
    matches.some((m) => m.routeId === "/dashboard/festivals/$festivalId/edit")
  ) {
    return <Outlet />;
  }

  if (isLoading || !festival) {
    return (
      <PageContainer variant="detail">
        <DetailPageSkeleton />
      </PageContainer>
    );
  }

  const status: FestivalStatus = festival.status;
  const isDeleted = festival.isDeleted;

  const dateRange =
    festival.startDate || festival.endDate
      ? `${formatCleanDate(festival.startDate)} – ${formatCleanDate(festival.endDate)}`
      : "Dates TBD";

  const stats: DetailStat[] = [
    { label: "Target Budget", value: formatCurrencyShort(festival.targetAmount ?? 0) },
    { label: "Opening Balance", value: formatCurrencyShort(festival.stats?.openingBalance ?? 0) },
    { label: "Total Collected", value: formatCurrencyShort(festival.stats?.totalCollected ?? 0) },
    { label: "Pending Amount", value: formatCurrencyShort(festival.stats?.pendingAmount ?? 0) },
    { label: "Total Expenses", value: formatCurrencyShort(festival.stats?.totalExpenses ?? 0) },
    { label: "Current Balance", value: formatCurrencyShort(festival.stats?.currentBalance ?? 0) },
    { label: "Contributors", value: festival.stats?.contributorsCount ?? 0 },
    { label: "Items", value: festival.stats?.itemCount ?? 0 },
  ];

  return (
    <PageContainer variant="detail">
      <PageHeader
        title=""
        module="festivals"
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Festivals", to: "/dashboard/festivals" },
          { label: festival.name },
        ]}
        actions={
          <>
            <AppButton
              variant="outline"
              size="icon"
              title="Back"
              className="h-8 w-8 rounded-full shrink-0"
              onClick={() => router.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </AppButton>
            {isAdmin && !isDeleted && (
              <AppButton
                variant="outline"
                leftIcon={<Edit className="h-3.5 w-3.5" />}
                className="h-8 text-xs rounded-full"
                onClick={() =>
                  router.navigate({
                    to: "/dashboard/festivals/$festivalId/edit",
                    params: { festivalId },
                  })
                }
              >
                <span className="hidden sm:inline">Edit</span>
              </AppButton>
            )}
            {isAdmin && isDeleted ? (
              <AppButton
                variant="outline"
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="h-8 text-xs rounded-full"
                onClick={() => setRestoreOpen(true)}
              >
                Restore
              </AppButton>
            ) : isAdmin ? (
              <AppButton
                variant="outline"
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                className="h-8 text-xs rounded-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950"
                onClick={() => setDeleteOpen(true)}
              >
                <span className="hidden sm:inline">Delete</span>
              </AppButton>
            ) : null}
          </>
        }
      />

      {/* Banner */}
      <div className="rounded-2xl bg-card border border-border/80 overflow-hidden">
        <div className="relative h-40 sm:h-52 w-full">
          {festival.bannerUrl ? (
            <img
              src={festival.bannerUrl}
              alt={`${festival.name} banner`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`h-full w-full ${theme.gradient}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-end justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                {festival.name}
              </h2>
              <p className="text-xs text-white/85 mt-0.5 capitalize">
                {festival.category} · {festival.year}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white border border-white/10">
              <Calendar className="h-3 w-3 text-white/80" />
              <span>{dateRange}</span>
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Status + context */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground font-semibold">
                Status
              </span>
              {isAdmin ? (
                <StatusBadgeSelect
                  status={status}
                  options={festivalStatusOptions}
                  transitions={festivalStatusTransition[status] ?? []}
                  badgeClass={festivalStatusBadge}
                  labelOf={festivalStatusLabel}
                  onRequestStatus={(next) => setStatusTarget(next as FestivalStatus)}
                  size="md"
                  disabled={isDeleted}
                />
              ) : (
                <AppBadge size="md" className={festivalStatusBadge(status)}>
                  {festivalStatusLabel(status)}
                </AppBadge>
              )}
            </div>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/60 font-medium text-muted-foreground",
                festivalCategoryBadge(festival.category),
              )}
            >
              <Tag className="h-3 w-3" />
              {festival.category}
            </span>
            {festival.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/60 font-medium text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {festival.location}
              </span>
            )}
          </div>

          {festival.description && (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {festival.description}
            </p>
          )}

          <DetailStatsRow stats={stats} />
        </div>
      </div>

      {/* Transitions */}
      <ConfirmDialog
        open={!!statusTarget}
        title={statusTarget ? `Mark as ${festivalStatusLabel(statusTarget)}` : "Update status"}
        description={`Change the festival status to "${statusTarget ? festivalStatusLabel(statusTarget) : ""}". You can change it again later if needed.`}
        confirmLabel="Update Status"
        loading={updateMutation.isPending}
        onConfirm={() => {
          if (statusTarget) {
            updateMutation.mutate(
              { festivalId, payload: { status: statusTarget } },
              { onSettled: () => setStatusTarget(null) },
            );
          }
        }}
        onCancel={() => setStatusTarget(null)}
      />

      {/* Delete */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Festival"
        description={`Are you sure you want to delete "${festival.name}"? It will be marked as deleted and can be restored later.`}
        confirmLabel="Delete Festival"
        variant="danger"
        icon={<Trash2 className="h-4 w-4" />}
        loading={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(festivalId, {
            onSuccess: () => router.navigate({ to: "/dashboard/festivals" }),
          })
        }
        onCancel={() => setDeleteOpen(false)}
      />

      {/* Restore */}
      <ConfirmDialog
        open={restoreOpen}
        title="Restore Festival"
        description={`Restore "${festival.name}" so it becomes active again?`}
        confirmLabel="Restore Festival"
        icon={<RotateCcw className="h-4 w-4" />}
        loading={restoreMutation.isPending}
        onConfirm={() =>
          restoreMutation.mutate(festivalId, {
            onSuccess: () => router.navigate({ to: "/dashboard/festivals" }),
          })
        }
        onCancel={() => setRestoreOpen(false)}
      />
    </PageContainer>
  );
}

export default FestivalDetailPage;