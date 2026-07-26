import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/api/auth/auth.store";
import { useLogout } from "@/api/hooks/useAuth";
import { useFestivalStore } from "@/store/festivalStore";
import { AppButton } from "@/components/common/AppButton";
import { AppLogo } from "@/components/common/AppLogo";
import {
  moduleIconColors,
  moduleBadgeColors,
} from "@/theme/colors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar as SidebarRoot,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Receipt,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";

export const Sidebar = () => {
  const { user } = useAuthStore();
  const logout = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  const { festivals } = useFestivalStore();

  const navSections = [
    {
      group: "Workspace",
      items: [
        {
          title: "Festivals",
          icon: CalendarDays,
          href: "/dashboard/festivals",
          module: "festivals",
          badge: festivals.filter((f) => f.status === "ACTIVE").length || undefined,
        },
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
          module: "dashboard",
        },
        {
          title: "Contributors",
          icon: Users,
          href: "/dashboard/contributors",
          module: "contributors",
        },
        {
          title: "Contributions",
          icon: Wallet,
          href: "/dashboard/contributions",
          module: "contributions",
        },
        {
          title: "Expenses",
          icon: Receipt,
          href: "/dashboard/expenses",
          module: "expenses",
        },
        {
          title: "Reports & Analytics",
          icon: BarChart3,
          href: "/dashboard/reports",
          module: "reports",
        },
      ],
    },
    {
      group: "System",
      items: [
        {
          title: "Settings",
          icon: Settings,
          href: "/dashboard/settings",
          module: "settings",
        },
      ],
    },
  ];

  return (
    <SidebarRoot collapsible="icon" className="border-r border-border bg-card text-card-foreground">
      {/* BRAND HEADER */}
      <SidebarHeader className="h-14 px-3 border-b border-border/80 flex items-center group-data-[collapsible=icon]:justify-center">
        <AppLogo size="md" />
      </SidebarHeader>

      {/* SECTIONED NAVIGATION MENU */}
      <SidebarContent className="px-2 py-3 space-y-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:space-y-2">
        {navSections.map((sec) => (
          <SidebarGroup
            key={sec.group}
            className="py-0 group-data-[collapsible=icon]:p-0"
          >
            <SidebarGroupLabel className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1 group-data-[collapsible=icon]:hidden">
              {sec.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === "/dashboard"
                      ? location.pathname === "/dashboard"
                      : location.pathname.startsWith(item.href);
                  const iconColorClass =
                    moduleIconColors[item.module] || moduleIconColors.default;
                  const badgeColorClass =
                    moduleBadgeColors[item.module] || moduleBadgeColors.default;

                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 overflow-hidden
                        group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto`}
                      >
                        <Link
                          to={item.href}
                          className="flex items-center gap-3 w-full justify-center"
                        >
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-all duration-200 ${iconColorClass}
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                          {item.badge !== undefined && (
                            <Badge
                              className={`ml-auto text-2xs px-2 py-0.5 rounded-full font-bold group-data-[collapsible=icon]:hidden ${
                                active
                                  ? badgeColorClass
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* FOOTER USER PROFILE */}
      <SidebarFooter className="p-3 border-t border-border/80 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <AppButton
              variant={"ghost"}
              className="w-full h-auto py-2 px-2.5 flex items-center gap-2.5 rounded-xl hover:bg-muted cursor-pointer
              group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center"
            >
              <div className="h-8 w-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0 ring-2 ring-primary/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="flex flex-col text-left min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user?.name || "Rajesh Patel"}
                </span>
                <span className="text-2xs text-muted-foreground truncate">
                  {user?.email || "admin@festivalfund.org"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 group-data-[collapsible=icon]:hidden" />
            </AppButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="end"
            className="w-56 p-2 rounded-xl shadow-xl"
          >
            <DropdownMenuLabel className="text-xs font-semibold text-foreground px-2 py-1">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => navigate({ to: "/dashboard/settings" })}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-2 text-xs"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => logout()}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-2 text-xs text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </SidebarRoot>
  );
};

export default Sidebar;
