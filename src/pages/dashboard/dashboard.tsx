import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivals } from "@/api/festival/useFestivals";
import { useDashboard } from "@/api/dashboard/useDashboard";
import { Link } from "@tanstack/react-router";
import { CalendarPlus } from "lucide-react";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { EmptyState } from "@/components/common/EmptyState";
import { getModuleTheme } from "@/theme/colors";
import { DashboardQuickActions } from "./components/DashboardQuickActions";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { DashboardError } from "./components/DashboardError";
import { DashboardKpis } from "./components/DashboardKpis";
import { DashboardOverview } from "./components/DashboardOverview";
import { DashboardPaymentChannels } from "./components/DashboardPaymentChannels";
import { DashboardContributorCategories } from "./components/DashboardContributorCategories";
import { DashboardFestivalSummary } from "./components/DashboardFestivalSummary";
import { DashboardRecentContributions } from "./components/DashboardRecentContributions";
import { DashboardRecentExpenses } from "./components/DashboardRecentExpenses";
import { DashboardActivityFeed } from "./components/DashboardActivityFeed";
import { DashboardCollectionStatus } from "./components/DashboardCollectionStatus";
import { DashboardTasks } from "./components/DashboardTasks";
import { DashboardNotes } from "./components/DashboardNotes";

const Dashboard = () => {
  const theme = getModuleTheme("dashboard");
  const { activeFestivalId } = useFestivalApiStore();

  const { data: festivalsData, isLoading: isLoadingFestivals } = useFestivals();
  const festivals = (festivalsData?.festivals ?? []).filter((f) => !f.isDeleted);
  const resolvedFestivalId =
    activeFestivalId && festivals.some((f) => f._id === activeFestivalId)
      ? activeFestivalId
      : festivals[0]?._id || "";

  const {
    data,
    isLoading: isLoadingDashboard,
    isFetching: isFetchingDashboard,
    isError,
    error,
    refetch,
  } = useDashboard(resolvedFestivalId);

  const title = data?.festival?.name
    ? `${data.festival.name} ${data.festival.year}`
    : "Festival Dashboard";

  return (
    <PageContainer variant="list">
      <PageHeader
        module="dashboard"
        title={title}
        description="Live overview of collections, expenses, contributors and recent activity."
        badge={
          data?.festival ? (
            <AppBadge size="sm" className={theme.badgeColor}>
              {data.festival.status}
            </AppBadge>
          ) : undefined
        }
        actions={<DashboardQuickActions />}
      />

      {isError ? (
        <DashboardError
          message={error instanceof Error ? error.message : undefined}
          onRetry={refetch}
        />
      ) : isLoadingFestivals || (resolvedFestivalId && isLoadingDashboard) ? (
        <DashboardSkeleton />
      ) : !resolvedFestivalId ? (
        <div className="rounded-2xl bg-card border border-border/80 shadow-sm">
          <EmptyState
            icon={CalendarPlus}
            title="No festival created yet"
            description="Create your first festival to start tracking contributions and expenses."
            action={
              <Link to="/dashboard/festivals/new">
                <AppButton leftIcon={<CalendarPlus className="h-4 w-4" />}>
                  Create Festival
                </AppButton>
              </Link>
            }
          />
        </div>
      ) : !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {/* KPI row */}
          <DashboardKpis data={data} isLoading={isLoadingDashboard || isFetchingDashboard} />

          {/* Row 2: festival summary / payment channels / contributor categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 items-stretch">
            <DashboardFestivalSummary data={data} />
            <DashboardPaymentChannels data={data} />
            <DashboardContributorCategories data={data} />
          </div>

          {/* Tasks & Notes Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
            <DashboardTasks data={data} limit={4} isWidget={true} />
            <DashboardNotes data={data} limit={4} isWidget={true} />
          </div>

          {/* Financial overview — full width */}
          <DashboardOverview data={data} />

          {/* Lower grid */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] gap-3 sm:gap-4 items-stretch">
            <div className="order-2 md:order-1 grid gap-3 sm:gap-4 min-h-0">
              <DashboardRecentExpenses data={data} limit={4} />
              <DashboardRecentContributions data={data} limit={4} />
              <DashboardCollectionStatus data={data} />
            </div>
            <div className="order-1 md:order-2 min-h-0">
              <DashboardActivityFeed data={data} />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;