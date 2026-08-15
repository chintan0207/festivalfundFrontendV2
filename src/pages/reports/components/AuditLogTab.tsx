import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Loader2, ChevronDown, X, ShieldAlert } from "lucide-react";
import { useDashboardActivity } from "@/api/dashboard/useDashboardActivity";
import type { DashboardActivityEvent } from "@/api/dashboard/dashboard.service";
import { AppButton } from "@/components/common/AppButton";
import { Skeleton } from "@/components/ui/skeleton";
import { activityMeta } from "@/pages/dashboard/lib/activityMeta";
import {
  activityLinkFor,
  formatINR,
  formatDateTime,
} from "@/pages/dashboard/lib/dashboardFormat";

interface AuditLogTabProps {
  festivalId: string;
  onTotalChange?: (total: number) => void;
}

function AuditRow({ event }: { event: DashboardActivityEvent }) {
  const meta = activityMeta(event.type);
  const link = activityLinkFor(event);

  return (
    <Link
      to={link.to}
      params={link.params}
      className="flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-muted/40 transition-colors group"
    >
      <div
        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${meta.bubble}`}
      >
        <meta.Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs font-bold text-foreground leading-snug group-hover:underline">
            {event.title}
          </p>
          {event.code && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
              {event.code}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
          {event.subtitle}
        </p>
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
          {event.user ? `${event.user} · ` : ""}
          {formatDateTime(event.date)}
        </p>
      </div>

      {event.amount > 0 && (
        <span className="text-xs font-bold text-foreground tabular-nums shrink-0 pt-0.5">
          {formatINR(event.amount)}
        </span>
      )}
    </Link>
  );
}

export const AuditLogTab = ({ festivalId, onTotalChange }: AuditLogTabProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useDashboardActivity(festivalId);
  const [query, setQuery] = useState("");

  const events = useMemo(() => data?.pages.flatMap((p) => p.activity) ?? [], [data]);
  const total = data?.pages[0]?.activityTotal ?? 0;

  // Surface the total to the reports page header so its count matches the feed.
  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange, festivalId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      [e.title, e.subtitle, e.code, e.type, e.user].some((v) =>
        v?.toLowerCase().includes(q),
      ),
    );
  }, [events, query]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 overflow-hidden divide-y divide-border/60">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-3.5 flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card p-6 text-center">
        <ShieldAlert className="h-6 w-6 text-rose-500 mx-auto" />
        <p className="text-sm text-foreground mt-2">Failed to load the audit log.</p>
        <AppButton variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Retry
        </AppButton>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-2xs text-muted-foreground font-semibold">
          Showing {filtered.length} of {total} events
        </p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, code, user..."
            className="h-8 w-64 max-w-full rounded-lg border border-border/70 bg-card pl-8 pr-7 text-xs outline-none focus:border-primary/60 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs">
            {events.length === 0
              ? "No audit log entries recorded for this festival."
              : "No audit log entries match your search."}
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((evt) => (
              <AuditRow key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </div>

      {hasNextPage && (
        <AppButton
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          leftIcon={
            isFetchingNextPage ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )
          }
        >
          {isFetchingNextPage ? "Loading more..." : "Load more"}
        </AppButton>
      )}
    </div>
  );
};

export default AuditLogTab;