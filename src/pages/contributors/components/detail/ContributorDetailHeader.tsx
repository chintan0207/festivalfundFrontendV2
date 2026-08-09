import { Phone, Mail, MapPin, FileText } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { AppBadge } from "@/components/common/AppBadge";
import { DetailStatsRow } from "@/components/common/DetailStatsRow";
import { categoryAvatarGradient, categoryBadge, categoryLabel } from "@/lib/categoryMeta";
import type { Contributor } from "@/types/Types";

export function ContributorDetailHeader({
  contributor,
  totalContributed,
  festivalCount,
  firstDate,
  lastDate,
}: {
  contributor: Contributor;
  totalContributed: number;
  festivalCount: number;
  firstDate: string;
  lastDate: string;
}) {
  const avatarGradient = categoryAvatarGradient(contributor.category);

  const fmt = (d: string) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="rounded-2xl bg-card border border-border/80 shadow-sm overflow-hidden">
      {/* Profile section */}
      <div className="p-3.5 sm:p-6 space-y-3 sm:space-y-4">
        {/* Avatar + Name row */}
        <div className="sm:flex sm:flex-row items-start gap-3 sm:gap-5">
          {/* Avatar (same position for mobile + desktop) */}
          <div className="flex items-start gap-3 mb-2 sm:mb-0 sm:block">
            <div
              className={cn(
                "w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shrink-0 shadow-md",
                avatarGradient,
              )}
            >
              {initials(contributor.name)}
            </div>

            {/* Name + badges next to avatar on mobile, above on desktop */}
            <div className="sm:hidden flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h1 className="text-base font-bold text-foreground truncate">{contributor.name}</h1>
                <AppBadge size="xs" className={categoryBadge(contributor.category)}>
                  {categoryLabel(contributor.category)}
                </AppBadge>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{contributor.contributorCode}</p>
            </div>
          </div>

          {/* Desktop: name + badges (next to avatar) */}
          <div className="hidden sm:block flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-lg font-bold text-foreground truncate">{contributor.name}</h1>
              <AppBadge size="xs" className={categoryBadge(contributor.category)}>
                {categoryLabel(contributor.category)}
              </AppBadge>
            </div>

            <p className="text-xs text-muted-foreground font-mono">{contributor.contributorCode}</p>
          </div>
        </div>

        {/* Contact info + notes (full width below) */}
        <div className="w-full space-y-1.5">
          <div className="flex flex-col sm:flex-row flex-wrap gap-y-1 sm:gap-x-6 text-[11px] sm:text-xs text-muted-foreground">
            {contributor.phoneNumber && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 shrink-0" />
                <span className="truncate">{contributor.phoneNumber}</span>
              </span>
            )}
            {contributor.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{contributor.email}</span>
              </span>
            )}
            {contributor.address && (
              <span className="flex items-start gap-1.5 min-w-0">
                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                <span className="break-words">{contributor.address}</span>
              </span>
            )}
          </div>

          {contributor.notes && (
            <div className="flex items-start gap-1.5 text-[11px] sm:text-xs text-muted-foreground bg-muted/40 rounded-xl p-2 sm:p-2.5">
              <FileText className="h-3 w-3 mt-0.5 shrink-0" />
              <span>{contributor.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <DetailStatsRow
        stats={[
          {
            label: "Total",
            labelSm: "Total Contributed",
            value: `₹${totalContributed.toLocaleString("en-IN")}`,
          },
          { label: "Festivals", value: String(festivalCount) },
          { label: "First", labelSm: "First Contribution", value: fmt(firstDate) },
          { label: "Latest", value: fmt(lastDate) },
        ]}
      />
    </div>
  );
}