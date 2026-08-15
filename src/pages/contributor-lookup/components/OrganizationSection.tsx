import { Building2 } from "lucide-react";
import { AppBadge, AppCard } from "@/components/common";
import { categoryBadge, categoryLabel } from "@/lib/categoryMeta";
import { contributorInitials } from "@/lib/contributionFormat";
import { formatMoney } from "../helpers";
import type { PublicContributorMember, PublicLookupPayload, PublicLookupRecord } from "@/api/public/publicLookup.service";
import { FestivalGroupSection } from "./FestivalGroupSection";
import { StatChip } from "./StatChip";

export function OrganizationSection({
  record,
  members,
  lookupPayload,
}: {
  record: PublicLookupRecord;
  members: PublicContributorMember[];
  lookupPayload: PublicLookupPayload | null;
}) {
  const orgMembers = members.filter((member) => member.organization?.id === record.organization.id);

  return (
    <AppCard
      title={record.organization.name}
      subtitle={`${record.totals.totalContributionCount} contributions · ${record.festivals.length} festival${
        record.festivals.length === 1 ? "" : "s"
      }`}
      icon={<Building2 className="h-4 w-4" />}
      contentClassName="space-y-3"
    >
      {orgMembers.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {orgMembers.map((member) => (
            <span
              key={member.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/40 px-2.5 py-1 text-xs"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold text-primary">
                {contributorInitials(member.name)}
              </span>
              {member.name}
              <AppBadge size="xs" className={categoryBadge(member.category ?? undefined)}>
                {categoryLabel(member.category ?? undefined)}
              </AppBadge>
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <StatChip label="Contributions" value={record.totals.totalContributionCount} />
        <StatChip
          label="Deposited"
          value={formatMoney(record.totals.totalDeposited)}
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <StatChip
          label="Pending"
          value={formatMoney(record.totals.totalPending)}
          accent="text-amber-600 dark:text-amber-400"
        />
        <StatChip
          label="Cancelled"
          value={formatMoney(record.totals.totalCancelled)}
          accent="text-rose-600 dark:text-rose-400"
        />
        <StatChip label="Items" value={record.totals.totalItems > 0 ? record.totals.totalItems : "—"} />
        <StatChip label="Items Value" value={formatMoney(record.totals.totalItemValue)} />
      </div>

      <div className="space-y-3">
        {record.festivals.map((festival) => (
          <FestivalGroupSection
            key={festival.festival.id || `${festival.festival.name}-${festival.contributionCount}`}
            group={festival}
            organizationName={record.organization.name}
            lookupPayload={lookupPayload}
          />
        ))}
      </div>
    </AppCard>
  );
}