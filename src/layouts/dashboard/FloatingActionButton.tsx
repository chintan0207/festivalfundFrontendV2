import { useLocation, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

const FloatingActionButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let label = "New Entry";
  let targetRoute = "/dashboard/contributions";

  if (location.pathname === "/dashboard/contributions") {
    label = "Add Contribution";
    targetRoute = "/dashboard/contributions";
  } else if (location.pathname === "/dashboard/expenses") {
    label = "Add Expense";
    targetRoute = "/dashboard/expenses";
  } else if (location.pathname === "/dashboard/festivals") {
    label = "Create Festival";
    targetRoute = "/dashboard/festivals";
  } else if (location.pathname === "/dashboard/contributors") {
    label = "Add Contributor";
    targetRoute = "/dashboard/contributors";
  }

  return (
    <button
      onClick={() => navigate({ to: targetRoute })}
      className="fixed bottom-16 right-4 z-40 h-12 px-4 inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium text-xs rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition-all md:hidden border border-primary-foreground/20"
    >
      <Plus className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
};

export default FloatingActionButton;
