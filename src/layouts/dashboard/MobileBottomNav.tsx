import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, Wallet, Receipt, BarChart3 } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Festivals", icon: CalendarDays, href: "/dashboard/festivals" },
  { label: "Contributions", icon: Wallet, href: "/dashboard/contributions" },
  { label: "Expenses", icon: Receipt, href: "/dashboard/expenses" },
  { label: "Reports", icon: BarChart3, href: "/dashboard/reports" },
];

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-lg border-t border-border px-2 py-1.5 flex justify-around md:hidden shadow-lg safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all duration-150 min-w-[56px] ${
              active
                ? "text-primary font-semibold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
