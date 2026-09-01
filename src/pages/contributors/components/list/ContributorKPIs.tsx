/* eslint-disable @typescript-eslint/no-unused-vars */
import { Users } from "lucide-react";
import { KPICard, KPIGrid } from "@/components/common/KPICard";
import { useContributorApiStore } from "@/api/contributor/contributor.store";

interface ContributorKPIsProps {
  themeGradient?: string;
  isLoading?: boolean;
}

export function ContributorKPIs({ themeGradient: _, isLoading }: ContributorKPIsProps) {
  const categoryCounts = useContributorApiStore((s) => s.categoryCounts);

  return (
    <KPIGrid columns={4}>
      <KPICard
        label="Total Donors"
        value={categoryCounts.total}
        icon={<Users className="h-5 w-5" />}
        accent="cyan"
        subtext="Registered donors"
        isLoading={isLoading}
      />
      <KPICard
        label="Parents"
        value={categoryCounts.PARENT}
        icon={<Users className="h-5 w-5" />}
        accent="emerald"
        subtext="Head of families"
        isLoading={isLoading}
      />
      <KPICard
        label="Boys & Youth"
        value={categoryCounts.BOY}
        icon={<Users className="h-5 w-5" />}
        accent="blue"
        subtext="Youth team members"
        isLoading={isLoading}
      />
      <KPICard
        label="Girls & Youth"
        value={categoryCounts.GIRL}
        icon={<Users className="h-5 w-5" />}
        accent="rose"
        subtext="Cultural performers"
        isLoading={isLoading}
      />
    </KPIGrid>
  );
}
