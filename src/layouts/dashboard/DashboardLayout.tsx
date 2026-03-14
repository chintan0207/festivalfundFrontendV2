import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import MobileBottomNav from "./MobileBottomNav";
import FloatingActionButton from "./FloatingActionButton";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>

        <MobileBottomNav />

        <FloatingActionButton />
      </div>
    </div>
  );
};

export default DashboardLayout;
