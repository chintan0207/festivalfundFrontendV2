/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckCircle, Clock, Wallet, Package } from "lucide-react";
import { KPICard, KPIGrid } from "@/components/common/KPICard";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivals } from "@/api/festival/useFestivals";

interface ContributionKPIsProps {
  themeGradient?: string;
}

const fmt = (value: number) => (value ? `₹${value.toLocaleString("en-IN")}` : "₹0");

const emptyStats = {
  totalCollected: 0,
  pendingAmount: 0,
  itemCount: 0,
};

export function ContributionKPIs(_: ContributionKPIsProps) {
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
        // gradient={themeGradient}
        subtext="Confirmed receipts"
      />
      <KPICard
        label="Pending"
        value={fmt(pending)}
        icon={<Clock className="h-5 w-5" />}
        accent="rose"
        // gradient={themeGradient}
        subtext="Awaiting deposit"
      />
      <KPICard
        label="Total Raised"
        value={fmt(deposited + pending)}
        icon={<Wallet className="h-5 w-5" />}
        accent="blue"
        // gradient={themeGradient}
        subtext="All contributions"
      />
      <KPICard
        label="Item Contributions"
        value={stats.itemCount || 0}
        icon={<Package className="h-5 w-5" />}
        accent="amber"
        // gradient={themeGradient}
        subtext="In-kind donations"
      />
    </KPIGrid>
  );
}
