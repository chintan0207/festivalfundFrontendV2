import { useEffect } from "react";
import { Outlet, useLocation } from "@tanstack/react-router";
import { useCurrentUser } from "@/api/auth/useAuth";
import { useAuthStore } from "@/api/auth/auth.store";
import { useOrganization } from "@/api/organization/useOrganization";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileBottomNav from "./MobileBottomNav";
import FloatingActionButton from "./FloatingActionButton";

import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

/** Closes the mobile sidebar drawer whenever the route changes (taps, nested
 *  items, programmatic navigation, back/forward). No-op on desktop since the
 *  desktop sidebar uses the separate `open` (expand/collapse) state. */
const SidebarBehavior = () => {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [location.pathname, setOpenMobile]);

  return null;
};

const DashboardLayout = () => {
  useCurrentUser();
  const organizationId = useAuthStore((s) => s.user?.organizationId);
  useOrganization(organizationId || "");

  return (
    <TooltipProvider>
      <SidebarProvider>
        <SidebarBehavior />

        <Sidebar />

        <SidebarInset className="flex flex-col min-h-screen">
          <Topbar />

          <main className="flex-1 overflow-auto p-1 md:p-6 bg-muted/30">
            <Outlet />
          </main>

          <div className="md:hidden">
            <MobileBottomNav />
          </div>

          <FloatingActionButton />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
