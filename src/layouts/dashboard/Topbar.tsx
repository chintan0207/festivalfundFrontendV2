import { SidebarTrigger } from "@/components/ui/sidebar";

import { Bell } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { ThemeToggle } from "@/theme/ThemeToggle";

const Topbar = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-dashed">
      <div className="flex h-16 items-center gap-4 px-4">
        <SidebarTrigger />

        <div className="flex-1">
          <h2 className="text-sm font-semibold lg:text-base">Festival Dashboard</h2>
        </div>

        <div className="flex items-center gap-2">
          <AppButton variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </AppButton>

          <AppButton variant="ghost" size="icon">
            <ThemeToggle />
          </AppButton>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
