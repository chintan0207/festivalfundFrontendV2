import { Banknote } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { chartCategoryColor } from "@/theme/colors";
import { useContributionApiStore } from "@/api/contribution/contribution.store";
import { contributionPaymentLabel } from "@/pages/contributions/lib/contributionMeta";
import type { DashboardData } from "@/api/dashboard/dashboard.service";
import { DonutChart, type DonutDatum } from "./charts/DonutChart";

interface DashboardPaymentChannelsProps {
  data: DashboardData;
}

export function DashboardPaymentChannels({ data }: DashboardPaymentChannelsProps) {
  const navigate = useNavigate();

  const rows: DonutDatum[] = data.contributions.byPaymentMode.map((row) => ({
    label: contributionPaymentLabel(row.paymentMode),
    value: row.total,
    count: row.count,
    color: chartCategoryColor(row.paymentMode),
  }));

  const handleChannelClick = (datum: DonutDatum) => {
    const mode = data.contributions.byPaymentMode.find(
      (row) => contributionPaymentLabel(row.paymentMode) === datum.label,
    )?.paymentMode;
    if (!mode) return;
    useContributionApiStore.getState().setPaymentMode(mode);
    navigate({ to: "/dashboard/contributions" });
  };

  return (
    <AppCard
      icon={<Banknote className="h-4 w-4" />}
      title="Payment Channels"
      subtitle="Money collections by mode"
      compact
      className="flex h-full flex-col"
    >
      {rows.length === 0 ? (
        <EmptyState
          icon={Banknote}
          title="No collections yet"
          description="Deposited money contributions will appear here by payment mode."
        />
      ) : (
        <DonutChart
          data={rows}
          centerLabel="Collected"
          height={180}
          onSliceClick={handleChannelClick}
        />
      )}
      {rows.length > 0 && (
        <p className="mt-auto pt-3 text-[10px] text-muted-foreground">
          Click a channel to open filtered contributions.
        </p>
      )}
    </AppCard>
  );
}