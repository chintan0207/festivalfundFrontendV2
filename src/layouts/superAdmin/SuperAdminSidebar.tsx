import { Link, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/api/auth/auth.store";
import { AppLogo } from "@/components/common/AppLogo";
import { AppButton } from "@/components/common/AppButton";
import { AccountMenu } from "@/components/common/AccountMenu";
import {
  moduleIconColors,
  moduleFillColors,
} from "@/theme/colors";
import { cn } from "@/lib/utils";
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarDays,
  CreditCard,
  ShieldCheck,
  Settings,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";

export const SuperAdminSidebar = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  const navSections = [
    {
      group: "Overview",
      items: [
        {
          title: "Platform Dashboard",
          icon: LayoutDashboard,
          href: "/super-admin/dashboard",
          module: "dashboard",
        },
      ],
    },
    {
      group: "Governance",
      items: [
        {
          title: "Organizations",
          icon: Building2,
          href: "/super-admin/organizations",
          module: "organizations",
        },
        {
          title: "Users",
          icon: Users,
          href: "/super-admin/users",
          module: "users",
        },
        {
          title: "Festivals Monitor",
          icon: CalendarDays,
          href: "/super-admin/festivals",
          module: "festivals",
        },
      ],
    },
    {
      group: "Monetization & Security",
      items: [
        {
          title: "Plans & Subscriptions",
          icon: CreditCard,
          href: "/super-admin/plans",
          module: "billing",
        },
        {
          title: "Platform Audit Logs",
          icon: ShieldCheck,
          href: "/super-admin/audit-logs",
          module: "audit-logs",
        },
        {
          title: "Platform Settings",
          icon: Settings,
          href: "/super-admin/settings",
          module: "settings",
        },
      ],
    },
  ];

  return (
    <SidebarRoot collapsible="icon" className="border-r border-border bg-card text-card-foreground">
      {/* BRAND HEADER */}
      <SidebarHeader className="h-14 px-3 border-b border-border/80 flex items-center justify-between group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-2">
          <AppLogo size="md" />
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 group-data-[collapsible=icon]:hidden">
            Super Admin
          </span>
        </div>
      </SidebarHeader>

      {/* SECTIONED NAVIGATION MENU */}
      <SidebarContent className="px-2 py-3 space-y-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:space-y-2">
        {navSections.map((sec) => (
          <SidebarGroup key={sec.group} className="py-0 group-data-[collapsible=icon]:p-0">
            <SidebarGroupLabel className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1 group-data-[collapsible=icon]:hidden">
              {sec.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === "/super-admin/dashboard"
                      ? location.pathname === "/super-admin/dashboard" || location.pathname === "/super-admin"
                      : location.pathname.startsWith(item.href);

                  const iconColorClass = moduleIconColors[item.module] || moduleIconColors.default;
                  const activeFillClass = moduleFillColors[item.module] || moduleFillColors.default;

                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 overflow-hidden group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto",
                          active && activeFillClass,
                        )}
                      >
                        <Link
                          to={item.href as any}
                          onClick={() => setOpenMobile(false)}
                          className="flex items-center gap-3 w-full"
                        >
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-all duration-200 ${iconColorClass}`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
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
        <AccountMenu
          trigger={
            <AppButton
              variant="ghost"
              className="w-full h-auto py-2 px-2.5 flex items-center gap-2.5 rounded-xl hover:bg-muted cursor-pointer group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center"
            >
              <div className="h-8 w-8 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs shrink-0 ring-2 ring-primary/20 overflow-hidden">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user?.name || "Super Admin"}
                </span>
                <span className="text-2xs text-muted-foreground truncate">
                  {user?.email || "Platform Admin"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 group-data-[collapsible=icon]:hidden" />
            </AppButton>
          }
        />
      </SidebarFooter>
    </SidebarRoot>
  );
};

export default SuperAdminSidebar;
