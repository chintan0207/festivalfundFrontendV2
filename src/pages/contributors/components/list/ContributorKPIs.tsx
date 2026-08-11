/* eslint-disable @typescript-eslint/no-unused-vars */
import { Users } from "lucide-react";
import { KPICard, KPIGrid } from "@/components/common/KPICard";
import { useContributorApiStore } from "@/api/contributor/contributor.store";

interface ContributorKPIsProps {
  themeGradient?: string;
}

export function ContributorKPIs(_: ContributorKPIsProps) {
  const categoryCounts = useContributorApiStore((s) => s.categoryCounts);

  return (
    <KPIGrid columns={4}>
      <KPICard
        label="Total Donors"
        value={categoryCounts.total}
        icon={<Users className="h-5 w-5" />}
        accent="cyan"
        // gradient={themeGradient}
        subtext="Registered donors"
      />
      <KPICard
        label="Parents"
        value={categoryCounts.PARENT}
        icon={<Users className="h-5 w-5" />}
        accent="emerald"
        // gradient={themeGradient}
        subtext="Head of families"
      />
      <KPICard
        label="Boys & Youth"
        value={categoryCounts.BOY}
        icon={<Users className="h-5 w-5" />}
        accent="blue"
        // gradient={themeGradient}
        subtext="Youth team members"
      />
      <KPICard
        label="Girls & Youth"
        value={categoryCounts.GIRL}
        icon={<Users className="h-5 w-5" />}
        accent="rose"
        // gradient={themeGradient}
        subtext="Cultural performers"
      />
    </KPIGrid>
  );
}
