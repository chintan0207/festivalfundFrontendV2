import { CheckCircle, Clock, Wallet, Package } from "lucide-react";
import { KPICard, KPIGrid } from "@/components/common/KPICard";
import { contributionAmountValue } from "@/lib/contributionFormat";
import type { ContributionListItem } from "@/types/Types";

interface ContributionKPIsProps {
  contributions: ContributionListItem[];
}

const fmt = (value: number) =>
  value ? `₹${value.toLocaleString("en-IN")}` : "₹0";

export function ContributionKPIs({ contributions }: ContributionKPIsProps) {
  const deposited = contributions
    .filter((c) => c.status === "DEPOSITED")
    .reduce((sum, c) => sum + contributionAmountValue(c), 0);
  const pending = contributions
    .filter((c) => c.status === "PENDING")
    .reduce((sum, c) => sum + contributionAmountValue(c), 0);
  const itemCount = contributions.filter((c) => c.type === "ITEM").length;

  return (
    <KPIGrid columns={4}>
      <KPICard
        label="Total Raised"
        value={fmt(deposited + pending)}
        icon={<Wallet className="h-5 w-5" />}
        accent="violet"
        subtext="All contributions"
      />
      <KPICard
        label="Deposited"
        value={fmt(deposited)}
        icon={<CheckCircle className="h-5 w-5" />}
        accent="emerald"
        subtext="Confirmed receipts"
      />
      <KPICard
        label="Pending"
        value={fmt(pending)}
        icon={<Clock className="h-5 w-5" />}
        accent="amber"
        subtext="Awaiting deposit"
      />
      <KPICard
        label="Item Contributions"
        value={itemCount}
        icon={<Package className="h-5 w-5" />}
        accent="indigo"
        subtext="In-kind donations"
      />
    </KPIGrid>
  );
}
