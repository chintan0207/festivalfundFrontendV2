import { useAuthStore } from "@/api/auth/auth.store";
import { useLogout } from "@/api/hooks/useAuth";
import { AppButton } from "@/components/common/AppButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar as SidebarRoot,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Users,
  Wallet,
  Receipt,
  BarChart3,
  Settings,
  ChevronDown,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const workspace = {
  name: "FestivalFund",
  role: "Admin Portal",
};

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Contributors",
    icon: Users,
    href: "/contributors",
  },
  {
    title: "Contributions",
    icon: Wallet,
    href: "/contributions",
  },
  {
    title: "Expenses",
    icon: Receipt,
    href: "/expenses",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

const Sidebar = () => {
  const { user } = useAuthStore();
  const logout = useLogout();
  const location = useLocation();

  return (
    <SidebarRoot collapsible="icon" className="border-dashed">
      {/* HEADER */}
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <AppButton
              variant={"ghost"}
              className="py-7 group-data-[collapsible=icon]:p-0"
            >
              {/* Logo */}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  {workspace.name.charAt(0)}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold">{workspace.name}</span>
                <span className="text-xs text-muted-foreground">{workspace.role}</span>
              </div>

              <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
            </AppButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <Link to="/">
              <DropdownMenuItem>Home</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Create Festival</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.href;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active} className="p-5 rounded-2xl">
                  <Link to={item.href}>
                    <Icon />

                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <AppButton
              variant={"ghost"}
              className="py-7 group-data-[collapsible=icon]:p-0"
            >
              {" "}
              <img src="https://github.com/shadcn.png" className="h-8 w-8 rounded-full" />
              <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
            </AppButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="right" align="end">
            <DropdownMenuItem>Upgrade to Pro</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>Account</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Notifications</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </SidebarRoot>
  );
};

export default Sidebar;
