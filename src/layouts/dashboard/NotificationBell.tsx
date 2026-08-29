import { useState } from "react";
import { Bell, ArrowRight, CheckCheck, Inbox, Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/api/notification/useNotifications";
import type { AppNotification } from "@/api/notification/notification.service";
import { activityMeta } from "@/pages/dashboard/lib/activityMeta";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: notificationsData, isLoading } = useNotifications({ limit: 10 });
  const { data: unreadCount = 0 } = useUnreadCount();

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = notificationsData?.docs ?? [];

  const handleNotificationClick = (item: AppNotification) => {
    if (!item.isRead) {
      markReadMutation.mutate(item._id);
    }
    setOpen(false);

    if (item.link) {
      navigate({ to: item.link });
    } else {
      navigate({ to: "/dashboard/reports", search: { tab: "audit" } });
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllReadMutation.mutate();
  };

  const openAuditLog = () => {
    setOpen(false);
    navigate({ to: "/dashboard/reports", search: { tab: "audit" } });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative h-9 w-9 rounded-xl border border-border/70 bg-card hover:bg-muted/60 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1 tabular-nums animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-84 p-1.5 shadow-2xl rounded-2xl max-w-[calc(100vw-1rem)] border-border/80 bg-card/95 backdrop-blur-md">
        <DropdownMenuLabel className="flex items-center justify-between px-2.5 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Check className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />

        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40">
          {isLoading ? (
            <div className="px-2 py-8 text-center text-xs text-muted-foreground animate-pulse">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-2 py-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
              <Inbox className="h-8 w-8 opacity-40 text-muted-foreground" />
              <p>No notifications yet.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const meta = activityMeta(item.type || item.module);
              return (
                <DropdownMenuItem
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={`cursor-pointer items-start gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors ${
                    !item.isRead ? "bg-primary/5 dark:bg-primary/10 font-medium" : "hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${meta.bubble}`}
                  >
                    <meta.Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-1">
                      <p className="font-semibold text-foreground text-xs leading-snug line-clamp-1">
                        {item.title}
                      </p>
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {item.actorName ? `${item.actorName} · ` : ""}
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>

        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          onClick={openAuditLog}
          className="cursor-pointer justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCheck className="h-3.5 w-3.5" />
            View Organization Audit Log
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}