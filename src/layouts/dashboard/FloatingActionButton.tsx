import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Plus, HandCoins, Receipt, CalendarPlus, UserPlus } from "lucide-react";
import { moduleGradientColors } from "@/theme/colors";
import { cn } from "@/lib/utils";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";

const MODULE_ROUTES = [
  "/dashboard/contributors",
  "/dashboard/contributions",
  "/dashboard/expenses",
  "/dashboard/festivals",
];

type QuickAction = {
  label: string;
  icon: typeof Plus;
  to: string;
  event: string;
  gradient: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Add Contribution",
    icon: HandCoins,
    to: "/dashboard/contributions",
    event: "ff:open-add-contributions",
    gradient: moduleGradientColors.contributions,
  },
  {
    label: "Add Expense",
    icon: Receipt,
    to: "/dashboard/expenses",
    event: "ff:open-add-expenses",
    gradient: moduleGradientColors.expenses,
  },
  {
    label: "Add Festival",
    icon: CalendarPlus,
    to: "/dashboard/festivals",
    event: "ff:open-add-festivals",
    gradient: moduleGradientColors.festivals,
  },
  {
    label: "Add Contributor",
    icon: UserPlus,
    to: "/dashboard/contributors",
    event: "ff:open-add-contributors",
    gradient: moduleGradientColors.contributors,
  },
];

const FloatingActionButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = useIsOrgAdmin();
  const [open, setOpen] = useState(false);

  const moduleRoute = MODULE_ROUTES.find(
    (route) => location.pathname === route,
  );
  const isModuleDetail = MODULE_ROUTES.some((route) =>
    location.pathname.startsWith(`${route}/`),
  );

  // On module list pages the header holds the primary add button: hide the FAB
  // once the header (which holds the add button) is scrolled out of view.
  const [headerInView, setHeaderInView] = useState(true);
  const [prevPath, setPrevPath] = useState(location.pathname);

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setHeaderInView(true);
    setOpen(false);
  }

  useEffect(() => {
    if (!moduleRoute) return;
    const target = document.querySelector<HTMLElement>("[data-fab-observe]");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [moduleRoute, location.pathname]);

  if (!isAdmin) return null;
  if (isModuleDetail) return null;
  if (moduleRoute && headerInView) return null;

  const handleAction = (action: QuickAction) => {
    setOpen(false);
    // The add-dialogs are opened by their page's own listener; navigate first,
    // then let the freshly-mounted page open the dialog.
    navigate({ to: action.to } as never);
    window.setTimeout(() => {
      window.dispatchEvent(new Event(action.event));
    }, 300);
  };

  return (
    <>
      {/* Transparent click-catcher behind the FAB so tapping anywhere closes it */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/5 md:hidden"
        />
      )}

      <div className="fixed z-50 bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] right-4 flex flex-col items-end md:hidden">
        {open && (
          <div className="flex flex-col items-end gap-2 mb-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.event}
                  type="button"
                  onClick={() => handleAction(action)}
                  className="flex items-center gap-2 rounded-full bg-card/95 backdrop-blur border border-border/80 shadow-lg pl-1.5 pr-4 h-10 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center text-white shrink-0",
                      action.gradient,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {action.label}
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          aria-label={open ? "Close quick actions" : "Quick actions"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl active:scale-95 transition-all cursor-pointer border-0",
            moduleGradientColors.dashboard,
          )}
        >
          <Plus
            className={cn(
              "h-6 w-6 transition-transform duration-200",
              open && "rotate-45",
            )}
          />
        </button>
      </div>
    </>
  );
};

export default FloatingActionButton;