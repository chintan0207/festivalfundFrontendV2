import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { getModuleTheme } from "@/theme/colors";
import { cn } from "@/lib/utils";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";

const MODULE_ROUTES = [
  "/dashboard/contributors",
  "/dashboard/contributions",
  "/dashboard/expenses",
  "/dashboard/festivals",
];

const FAB_LABELS: Record<string, string> = {
  "/dashboard/contributors": "Add Contributor",
  "/dashboard/contributions": "Add Contribution",
  "/dashboard/expenses": "Add Expense",
  "/dashboard/festivals": "Create Festival",
};

const FloatingActionButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = useIsOrgAdmin();

  if (!isAdmin) return null;

  const moduleRoute = MODULE_ROUTES.find(
    (route) => location.pathname === route,
  );
  const isModuleDetail = MODULE_ROUTES.some((route) =>
    location.pathname.startsWith(`${route}/`),
  );

  // On module list pages the FAB mirrors the header add button: show it only
  // once the header (which holds the add button) is scrolled out of view.
  const [headerInView, setHeaderInView] = useState(true);
  const [prevPath, setPrevPath] = useState(location.pathname);

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setHeaderInView(true);
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

  if (isModuleDetail) return null;
  if (moduleRoute && headerInView) return null;

  const moduleName = moduleRoute ? moduleRoute.split("/").pop()! : "dashboard";
  const label = moduleRoute ? FAB_LABELS[moduleRoute] : "New Entry";

  const handleClick = () => {
    if (moduleRoute) {
      window.dispatchEvent(new CustomEvent(`ff:open-add-${moduleName}`));
    } else {
      navigate({ to: "/dashboard/contributions" });
    }
  };

  const theme = getModuleTheme(moduleName);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "fixed bottom-20 right-4 z-30 h-10 px-4 inline-flex items-center gap-1.5 text-white font-semibold text-xs rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition-all md:hidden border-0 cursor-pointer",
        theme.gradient
      )}
    >
      <Plus className="h-4 w-4 text-white" />
      <span>{label}</span>
    </button>
  );
};

export default FloatingActionButton;
