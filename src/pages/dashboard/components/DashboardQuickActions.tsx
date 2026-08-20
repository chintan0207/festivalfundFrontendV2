import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Receipt, UserPlus, CalendarPlus } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";

function goAndOpen(navigate: ReturnType<typeof useNavigate>, to: string, event: string) {
  navigate({ to } as never);
  // The add-dialogs are opened by their page's own listener; navigate first,
  // then let the freshly-mounted page open the dialog.
  window.setTimeout(() => {
    window.dispatchEvent(new Event(event));
  }, 300);
}

export function DashboardQuickActions() {
  const navigate = useNavigate();
  const isAdmin = useIsOrgAdmin();

  const handleAdd = useCallback(
    (to: string, event: string) => goAndOpen(navigate, to, event),
    [navigate],
  );

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <AppButton
        variant="outline"
        onClick={() => navigate({ to: "/dashboard/festivals" } as never)}
        leftIcon={<CalendarPlus className="h-4 w-4" />}
      >
        Festivals
      </AppButton>

      {isAdmin && (
        <>
          <AppButton
            onClick={() =>
              handleAdd("/dashboard/contributions", "ff:open-add-contributions")
            }
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Contribution
          </AppButton>
          <AppButton
            onClick={() => handleAdd("/dashboard/expenses", "ff:open-add-expenses")}
            leftIcon={<Receipt className="h-4 w-4" />}
          >
            Add Expense
          </AppButton>
          <AppButton
            onClick={() =>
              handleAdd("/dashboard/contributors", "ff:open-add-contributors")
            }
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Add Contributor
          </AppButton>
        </>
      )}
    </div>
  );
}
