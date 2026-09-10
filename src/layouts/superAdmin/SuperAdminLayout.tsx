import { useEffect } from "react";
import { Outlet, useLocation } from "@tanstack/react-router";
import { useCurrentUser } from "@/api/auth/useAuth";
import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminHeader from "./SuperAdminHeader";

import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const SidebarBehavior = () => {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [location.pathname, setOpenMobile]);

  return null;
};

export const SuperAdminLayout = () => {
  useCurrentUser();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <SidebarBehavior />

        <SuperAdminSidebar />

        <SidebarInset className="flex flex-col min-h-screen">
          <SuperAdminHeader />

          <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 bg-muted/30">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default SuperAdminLayout;
