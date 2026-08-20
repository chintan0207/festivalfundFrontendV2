import { CalendarDays } from "lucide-react";
import { AppBadge } from "@/components/common";
import { formatDate, formatMoney, visibleContributions } from "../helpers";
import type { PublicFestivalGroup, PublicLookupPayload } from "@/api/public/publicLookup.service";
import { ContributionRow } from "./ContributionRow";
import { StatChip } from "./StatChip";

export function FestivalGroupSection({
  group,
  organizationName,
  lookupPayload,
}: {
  group: PublicFestivalGroup;
  organizationName: string;
  lookupPayload: PublicLookupPayload | null;
}) {
  const festivalName = group.festival?.name
    ? `${group.festival.name}${group.festival.year ? ` ${group.festival.year}` : ""}`
    : "Festival";
  const { list, hidden } = visibleContributions(group);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/40">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-4 py-3">
        <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm font-bold text-foreground">{festivalName}</p>
        {group.festival?.status && (
          <AppBadge size="xs" variant="outline">
            {group.festival.status}
          </AppBadge>
        )}
        <span className="ml-auto text-[11px] text-muted-foreground">
          {group.contributionCount} contribution{group.contributionCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="space-y-3 px-4 py-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <StatChip label="Contributions" value={group.contributionCount} />
          <StatChip
            label="Collected"
            value={formatMoney(group.totalDeposited)}
            accent="text-emerald-600 dark:text-emerald-400"
          />
          <StatChip
            label="Pending"
            value={formatMoney(group.totalPending)}
            accent="text-amber-600 dark:text-amber-400"
          />
          <StatChip
            label="Items"
            value={group.totalItems > 0 ? `${group.totalItems}${group.totalItemValue > 0 ? ` · ${formatMoney(group.totalItemValue)}` : ""}` : "—"}
          />
          <StatChip label="Latest" value={formatDate(group.latestContributionDate)} className="col-span-2 sm:col-span-1" />
        </div>

        {hidden > 0 && (
          <p className="text-[11px] text-muted-foreground">
            {hidden} cancelled contribution{hidden === 1 ? "" : "s"} not displayed.
          </p>
        )}

        {list.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
            No recorded contributions to display for this festival.
          </p>
        ) : (
          <div className="space-y-2">
            {list.map((contribution) => (
              <ContributionRow
                key={contribution.contributionId}
                contribution={contribution}
                festivalName={festivalName}
                organizationName={organizationName}
                lookupPayload={lookupPayload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}