/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckCircle, Clock, Wallet, Package } from "lucide-react";
import { KPICard, KPIGrid } from "@/components/common/KPICard";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivals } from "@/api/festival/useFestivals";

interface ContributionKPIsProps {
  themeGradient?: string;
  isLoading?: boolean;
}

const fmt = (value: number) => (value ? `₹${value.toLocaleString("en-IN")}` : "₹0");

const emptyStats = {
  totalCollected: 0,
  pendingAmount: 0,
  itemCount: 0,
};

export function ContributionKPIs({ themeGradient: _, isLoading }: ContributionKPIsProps) {
  const { activeFestivalId } = useFestivalApiStore();
  const { data } = useFestivals();
  const festivals = data?.festivals ?? [];

  const activeFest =
    festivals.find((f) => f._id === activeFestivalId) ?? festivals[0] ?? null;
  const stats = activeFest?.stats || emptyStats;

  const deposited = stats.totalCollected;
  const pending = stats.pendingAmount;
  return (
    <KPIGrid columns={4}>
      <KPICard
        label="Deposited"
        value={fmt(deposited)}
        icon={<CheckCircle className="h-5 w-5" />}
        accent="emerald"
        subtext="Confirmed receipts"
        isLoading={isLoading}
      />
      <KPICard
        label="Pending"
        value={fmt(pending)}
        icon={<Clock className="h-5 w-5" />}
        accent="rose"
        subtext="Awaiting deposit"
        isLoading={isLoading}
      />
      <KPICard
        label="Total Raised"
        value={fmt(deposited + pending)}
        icon={<Wallet className="h-5 w-5" />}
        accent="blue"
        subtext="All contributions"
        isLoading={isLoading}
      />
      <KPICard
        label="Item Contributions"
        value={stats.itemCount || 0}
        icon={<Package className="h-5 w-5" />}
        accent="amber"
        subtext="In-kind donations"
        isLoading={isLoading}
      />
    </KPIGrid>
  );
}
