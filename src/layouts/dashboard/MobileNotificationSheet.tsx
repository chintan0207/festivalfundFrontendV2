import { useState } from "react";
import { Bell, Check, Inbox, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/api/notification/useNotifications";
import type { AppNotification } from "@/api/notification/notification.service";
import { activityMeta } from "@/pages/dashboard/lib/activityMeta";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function MobileNotificationSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: notificationsData, isLoading } = useNotifications({ limit: 20 });
  const { data: unreadCount = 0 } = useUnreadCount();

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = notificationsData?.docs ?? [];

  const handleNotificationClick = (item: AppNotification) => {
    if (!item.isRead) {
      markReadMutation.mutate(item._id);
    }
    setIsOpen(false);

    if (item.link) {
      navigate({ to: item.link });
    } else {
      navigate({ to: "/dashboard/reports", search: { tab: "audit" } });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open notifications"
        className="relative h-9 w-9 rounded-xl border border-border/70 bg-card flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-transform md:hidden"
      >
        <Bell className="h-4 w-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1 tabular-nums animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full sm:max-w-md h-full flex flex-col p-0 gap-0 border-l border-border/80 shadow-2xl bg-background md:hidden"
        >
          {/* Header styled like Task/Note ResponsiveFormDrawer */}
          <SheetHeader className="p-4 border-b border-border/60 shrink-0 text-left relative overflow-hidden flex flex-row items-center justify-between gap-2 space-y-0 bg-muted/20">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-base font-bold text-foreground truncate">
                    Notifications
                  </SheetTitle>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[11px] font-bold shrink-0">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-xs font-semibold text-primary flex items-center gap-1 active:opacity-70 px-2 py-1.5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </SheetHeader>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 overscroll-contain">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 px-4 text-center flex flex-col items-center justify-center my-auto">
                <div className="h-12 w-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mb-3 shadow-xs">
                  <Inbox className="h-6 w-6 opacity-70" />
                </div>
                <h4 className="text-sm font-bold text-foreground">No notifications yet</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-[250px] leading-relaxed">
                  We&apos;ll notify you when important activity occurs in your organization.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const meta = activityMeta(item.type || item.module);
                return (
                  <div
                    key={item._id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3.5 rounded-2xl border transition-all active:scale-[0.99] cursor-pointer flex items-start gap-3 ${
                      !item.isRead
                        ? "bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-2xs"
                        : "bg-card border-border/40 hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${meta.bubble}`}
                    >
                      <meta.Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">
                          {item.title}
                        </h4>
                        {!item.isRead && (
                          <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 ml-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-snug">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-muted-foreground/70 mt-1.5 block">
                        {item.actorName ? `${item.actorName} · ` : ""}
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
