import { Outlet } from "@tanstack/react-router";
import { useCurrentUser } from "@/api/auth/useAuth";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileBottomNav from "./MobileBottomNav";
import FloatingActionButton from "./FloatingActionButton";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const DashboardLayout = () => {
  useCurrentUser();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar />

        <SidebarInset className="flex flex-col min-h-screen">
          <Topbar />

          <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/30">
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
