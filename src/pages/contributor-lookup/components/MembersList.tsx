import { AppBadge, AppCard } from "@/components/common";
import { categoryAvatarGradient, categoryBadge, categoryLabel } from "@/lib/categoryMeta";
import { contributorInitials } from "@/lib/contributionFormat";
import type { PublicContributorMember } from "@/api/public/publicLookup.service";

export function MembersList({ members }: { members: PublicContributorMember[] }) {
  return (
    <AppCard
      title="Contributors linked to this number"
      subtitle={`${members.length} person record(s) found across organizations`}
      contentClassName="space-y-2"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-3"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${categoryAvatarGradient(member.category ?? undefined)}`}
            >
              {contributorInitials(member.name ?? "")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <AppBadge size="xs" className={categoryBadge(member.category ?? undefined)}>
                  {categoryLabel(member.category ?? undefined)}
                </AppBadge>
                <span className="truncate text-xs text-muted-foreground">
                  {member.organization?.name || "Organization"}
                </span>
              </div>
            </div>
            {member.phoneNumber && (
              <a
                href={`tel:${member.phoneNumber}`}
                className="shrink-0 rounded-lg border border-border/40 bg-background/70 px-2 py-1 font-mono text-[11px] text-muted-foreground hover:text-indigo-600 hover:border-indigo-500/40 transition-colors"
                title="Click to call"
              >
                📞 {member.phoneNumber}
              </a>
            )}
          </div>
        ))}
      </div>
    </AppCard>
  );
}