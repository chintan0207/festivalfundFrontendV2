import { useLocation, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { getModuleTheme } from "@/theme/colors";
import { cn } from "@/lib/utils";

const FloatingActionButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let label = "New Entry";
  let targetRoute = "/dashboard/contributions";
  let moduleName = "dashboard";

  if (location.pathname === "/dashboard/contributions") {
    label = "Add Contribution";
    targetRoute = "/dashboard/contributions";
    moduleName = "contributions";
  } else if (location.pathname === "/dashboard/expenses") {
    label = "Add Expense";
    targetRoute = "/dashboard/expenses";
    moduleName = "expenses";
  } else if (location.pathname === "/dashboard/festivals") {
    label = "Create Festival";
    targetRoute = "/dashboard/festivals";
    moduleName = "festivals";
  } else if (location.pathname === "/dashboard/contributors") {
    label = "Add Contributor";
    targetRoute = "/dashboard/contributors";
    moduleName = "contributors";
  }

  const theme = getModuleTheme(moduleName);

  return (
    <button
      type="button"
      onClick={() => navigate({ to: targetRoute })}
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
