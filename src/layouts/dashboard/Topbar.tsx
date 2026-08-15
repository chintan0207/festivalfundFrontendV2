import { useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivals } from "@/api/festival/useFestivals";
import { useAuthStore } from "@/api/auth/auth.store";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Calendar,
  Check,
} from "lucide-react";
import { NotificationBell } from "./NotificationBell";

const Topbar = () => {
  const { user, organization } = useAuthStore();
  const { data } = useFestivals();
  const festivals = data?.festivals ?? [];
  const { activeFestivalId, setActiveFestivalId } = useFestivalApiStore();

  const activeFest = festivals.find((f) => f._id === activeFestivalId);

  // Single festival selection: fall back to the first festival whenever no
  // (or a stale) festival is active, so the app never operates in an "All
  // Festivals" combined mode.
  useEffect(() => {
    const list = data?.festivals ?? [];
    if (list.length === 0) return;
    if (!list.some((f) => f._id === activeFestivalId)) {
      setActiveFestivalId(list[0]._id);
    }
  }, [data, activeFestivalId, setActiveFestivalId]);

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center px-4 justify-between gap-3">
      <div className="flex items-center gap-3">

        {/* Sidebar Trigger (Always visible to expand/collapse sidebar) */}
        <SidebarTrigger className="hover:bg-muted text-muted-foreground" />

        {/* Active Festival Selector Badge Header */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors cursor-pointer">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary truncate max-w-[150px] sm:max-w-[220px]">
                {activeFest?.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-primary/70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60 p-2 shadow-xl rounded-xl">
            <DropdownMenuLabel className="text-2xs font-semibold text-muted-foreground uppercase px-2 py-1">
              Select Active Festival
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            {festivals.map((f) => (
              <DropdownMenuItem
                key={f._id}
                onClick={() => setActiveFestivalId(f._id)}
                className={`flex items-center justify-between cursor-pointer rounded-lg px-2.5 py-2 text-xs ${
                  activeFestivalId === f._id ? "bg-primary/10 text-primary font-semibold" : ""
                }`}
              >
                <div className="flex flex-col">
                  <span>{f.name}</span>
                  <span className="text-2xs text-muted-foreground">{f.year}</span>
                </div>
                {activeFestivalId === f._id && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFest && (
          <Badge
            variant="outline"
            className={`hidden sm:inline-flex text-2xs font-medium border ${
              activeFest.status === "ACTIVE"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
            }`}
          >
            {activeFest.status}
          </Badge>
        )}
      </div>

      {/* RIGHT ACTION ITEMS: NOTIFICATIONS, THEME TOGGLE & PROFILE */}
      <div className="flex items-center gap-2">
        {/* Notifications bell driven by recent festival activity */}
        <NotificationBell />

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* User Profile Summary */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="relative h-8 w-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs ring-2 ring-primary/30 overflow-hidden">
            {organization?.logoUrl ? (
              <img
                src={organization.logoUrl}
                alt={organization.name || "org"}
                className="h-full w-full object-cover"
              />
            ) : user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              "R"
            )}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground leading-tight">
              {user?.name || "Org Admin"}
            </span>
            <span className="text-2xs text-muted-foreground">{organization?.name || "Org Admin"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
