import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, Wallet, Receipt, BarChart3 } from "lucide-react";
import { moduleGradientColors, moduleIconColors } from "@/theme/colors";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", module: "dashboard" },
  { label: "Festivals", icon: CalendarDays, href: "/dashboard/festivals", module: "festivals" },
  { label: "Contributions", icon: Wallet, href: "/dashboard/contributions", module: "contributions" },
  { label: "Expenses", icon: Receipt, href: "/dashboard/expenses", module: "expenses" },
  { label: "Reports", icon: BarChart3, href: "/dashboard/reports", module: "reports" },
];

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border px-2 py-1.5 flex justify-around md:hidden shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/dashboard"
            ? location.pathname === "/dashboard"
            : location.pathname.startsWith(item.href);

        const gradientClass =
          moduleGradientColors[item.module] || moduleGradientColors.default;
        const iconColorClass =
          moduleIconColors[item.module] || moduleIconColors.default;

        return (
          <Link
            key={item.href}
            to={item.href}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200 min-w-[58px]"
          >
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-all duration-200 ${
                active
                  ? `${gradientClass} text-white shadow-sm scale-110`
                  : `${iconColorClass} bg-muted/60`
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span
              className={`text-[10px] tracking-tight font-medium transition-colors ${
                active ? "text-foreground font-bold" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
