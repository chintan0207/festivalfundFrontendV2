import { AlertTriangle, RefreshCw } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { EmptyState } from "@/components/common/EmptyState";

interface DashboardErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function DashboardError({ message, onRetry }: DashboardErrorProps) {
  return (
    <div className="rounded-2xl bg-card border border-border/80 shadow-sm">
      <EmptyState
        icon={AlertTriangle}
        title="Couldn't load the dashboard"
        description={
          message ||
          "Something went wrong while fetching festival data. Try again in a moment."
        }
        action={
          onRetry && (
            <AppButton
              variant="outline"
              onClick={onRetry}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Retry
            </AppButton>
          )
        }
      />
    </div>
  );
}
