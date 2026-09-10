import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { AccountMenu } from "@/components/common/AccountMenu";
import { useAuthStore } from "@/api/auth/auth.store";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export const SuperAdminHeader = () => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center px-3 sm:px-4 justify-between gap-3 min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="hover:bg-muted text-muted-foreground shrink-0" />

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/20">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-primary">
            Platform Administration
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <ThemeToggle />

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <AccountMenu
            trigger={
              <button
                type="button"
                aria-label="Open account menu"
                className="relative h-8 w-8 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs ring-2 ring-primary/20 overflow-hidden cursor-pointer hover:ring-primary/40 transition-all shrink-0"
              >
                <ShieldAlert className="h-4 w-4" />
              </button>
            }
          />
          <div className="hidden sm:flex flex-col text-left min-w-0">
            <span className="text-xs font-semibold text-foreground leading-tight truncate">
              {user?.name || "Super Admin"}
            </span>
            <span className="text-2xs text-muted-foreground truncate">
              {user?.email || "Platform Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
