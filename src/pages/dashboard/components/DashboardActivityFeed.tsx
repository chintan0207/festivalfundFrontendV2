import {
  Activity as ActivityIcon,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import type {
  DashboardActivityEvent,
  DashboardData,
} from "@/api/dashboard/dashboard.service";
import { formatINR, formatDateTime, activityLinkFor } from "../lib/dashboardFormat";
import { activityMeta } from "../lib/activityMeta";

function ActivityRow({ event }: { event: DashboardActivityEvent }) {
  const meta = activityMeta(event.type);
  const link = activityLinkFor(event);

  return (
    <Link
      to={link.to}
      params={link.params}
      className="flex gap-3 rounded-lg -mx-1.5 px-1.5 py-1.5 hover:bg-muted/40 transition-colors group"
    >
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${meta.bubble}`}
      >
        <meta.Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-xs font-semibold text-foreground leading-snug group-hover:underline">
          {event.title}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
          {event.subtitle}
        </p>
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
          {event.user ? `${event.user} · ` : ""}
          {formatDateTime(event.date)}
        </p>
      </div>

      {event.amount > 0 && (
        <span className="text-xs font-bold text-foreground tabular-nums shrink-0 pt-1">
          {formatINR(event.amount)}
        </span>
      )}
    </Link>
  );
}

export function DashboardActivityFeed({ data }: { data: DashboardData }) {
  const activity = data.activity;

  return (
    <AppCard
      icon={<ActivityIcon className="h-4 w-4" />}
      title="Recent Activity"
      subtitle="Latest contributions, expenses & status changes"
      compact
      contentClassName="flex flex-1 min-h-0 flex-col"
      className="flex h-full flex-col"
    >
      <div className="flex-1 min-h-0">
        {activity.length === 0 ? (
          <EmptyState
            icon={ActivityIcon}
            title="No activity yet"
            description="Record contributions or expenses to see them here."
          />
        ) : (
          <ul className="space-y-0.5">
            {activity.map((event) => (
              <ActivityRow key={event.id} event={event} />
            ))}
          </ul>
        )}
      </div>

      <Link
        to="/dashboard/reports"
        search={{ tab: "audit" }}
        className="mt-3 shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        View all activity <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </AppCard>
  );
}