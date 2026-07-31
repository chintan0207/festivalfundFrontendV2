import { Users } from "lucide-react";
import { KPICard, KPIGrid } from "@/components/common/KPICard";
import type { Contributor } from "@/types/Types";

interface ContributorKPIsProps {
  total: number;
  contributors: Contributor[];
}

export function ContributorKPIs({ total, contributors }: ContributorKPIsProps) {
  const parentsCount = contributors.filter((c) => c.category === "PARENT").length;
  const boysCount = contributors.filter((c) => c.category === "BOY").length;
  const girlsCount = contributors.filter((c) => c.category === "GIRL").length;

  return (
    <KPIGrid columns={4}>
      <KPICard
        label="Total Donors"
        value={total}
        icon={<Users className="h-5 w-5" />}
        accent="emerald"
        subtext="Registered donors"
      />
      <KPICard
        label="Parents"
        value={parentsCount}
        icon={<Users className="h-5 w-5" />}
        accent="emerald"
        subtext="Head of families"
      />
      <KPICard
        label="Boys & Youth"
        value={boysCount}
        icon={<Users className="h-5 w-5" />}
        accent="blue"
        subtext="Youth team members"
      />
      <KPICard
        label="Girls & Youth"
        value={girlsCount}
        icon={<Users className="h-5 w-5" />}
        accent="rose"
        subtext="Cultural performers"
      />
    </KPIGrid>
  );
}
