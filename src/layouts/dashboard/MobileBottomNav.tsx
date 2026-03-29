import { Link } from "react-router-dom";
import { LayoutDashboard, Users, Wallet, Receipt } from "lucide-react";

const items = [
  { icon: LayoutDashboard, href: "/dashboard" },
  { icon: Users, href: "/dashboard/contributors" },
  { icon: Wallet, href: "/dashboard/contributions" },
  { icon: Receipt, href: "/dashboard/expenses" },
];

const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background flex justify-around py-2 md:hidden">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link key={item.href} to={item.href}>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </Link>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
