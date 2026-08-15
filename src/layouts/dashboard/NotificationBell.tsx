import { useEffect, useMemo, useState } from "react";
import { Bell, ArrowRight, CheckCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useDashboard } from "@/api/dashboard/useDashboard";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { formatINR, formatDateTime, activityLinkFor } from "@/pages/dashboard/lib/dashboardFormat";
import { activityMeta } from "@/pages/dashboard/lib/activityMeta";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const seenKey = (festivalId: string) => `ff:notif-seen:${festivalId}`;

function readSeen(festivalId: string): number | null {
  try {
    const raw = window.localStorage.getItem(seenKey(festivalId));
    const t = raw ? Number(raw) : NaN;
    return Number.isFinite(t) ? t : null;
  } catch {
    return null;
  }
}

function writeSeen(festivalId: string, timestamp: number) {
  try {
    window.localStorage.setItem(seenKey(festivalId), String(timestamp));
  } catch {
    /* ignore storage errors */
  }
}

export function NotificationBell() {
  const navigate = useNavigate();
  const { activeFestivalId } = useFestivalApiStore();
  const festivalId = activeFestivalId || "";
  const { data } = useDashboard(festivalId);

  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<number | null>(() => readSeen(festivalId));

  // Re-read the marker when the festival changes so we never show stale badges.
  useEffect(() => {
    setSeen(readSeen(festivalId));
  }, [festivalId]);

  const events = useMemo(() => data?.activity ?? [], [data]);

  const unreadCount = useMemo(() => {
    if (!festivalId || seen == null) return events.length;
    return events.filter((e) => new Date(e.date).getTime() > seen).length;
  }, [events, seen, festivalId]);

  const markAllRead = () => {
    const now = Date.now();
    setSeen(now);
    writeSeen(festivalId, now);
  };

  const openEntity = (event: (typeof events)[number]) => {
    const link = activityLinkFor(event);
    navigate({ to: link.to, params: link.params });
    setOpen(false);
  };

  const openAuditLog = () => {
    markAllRead();
    navigate({ to: "/dashboard/reports", search: { tab: "audit" } });
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative h-9 w-9 rounded-xl border border-border/70 bg-card hover:bg-muted/60 transition-colors flex items-center justify-center cursor-pointer"
          onClick={() => {
            if (!open) markAllRead();
          }}
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1 tabular-nums">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-1.5 shadow-xl">
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Recent Activity
          </span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold text-rose-500">
              {unreadCount} new
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />

        <div className="max-h-[380px] overflow-y-auto">
          {events.length === 0 ? (
            <div className="px-2 py-8 text-center text-xs text-muted-foreground">
              No activity yet for this festival.
            </div>
          ) : (
            events.slice(0, 8).map((event) => {
              const meta = activityMeta(event.type);
              const isNew = seen == null || new Date(event.date).getTime() > seen;
              return (
                <DropdownMenuItem
                  key={event.id}
                  onClick={() => openEntity(event)}
                  className="cursor-pointer items-start gap-2.5 rounded-lg px-2 py-2 text-xs"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${meta.bubble}`}
                  >
                    <meta.Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground leading-snug line-clamp-2">
                      {event.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      {event.subtitle}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                      {event.user ? `${event.user} · ` : ""}
                      {formatDateTime(event.date)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {event.amount > 0 && (
                      <p className="text-xs font-bold text-foreground tabular-nums">
                        {formatINR(event.amount)}
                      </p>
                    )}
                    {isNew && (
                      <p className="text-[9px] font-bold text-rose-500 uppercase mt-1">
                        New
                      </p>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>

        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          onClick={openAuditLog}
          className="cursor-pointer justify-between rounded-lg px-2 py-2 text-xs font-semibold text-primary"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCheck className="h-3.5 w-3.5" />
            View all activity
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}