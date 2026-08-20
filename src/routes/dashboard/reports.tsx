import { createFileRoute } from "@tanstack/react-router";
import Reports from "@/pages/reports/reports";

export type ReportsSearchParams = {
  tab?: "summary" | "contributions" | "expenses" | "contributors" | "analytics" | "audit";
};

export const Route = createFileRoute("/dashboard/reports")({
  validateSearch: (search: Record<string, unknown>): ReportsSearchParams => {
    const tab = search.tab;
    return {
      tab:
        typeof tab === "string" &&
        ["summary", "contributions", "expenses", "contributors", "analytics", "audit"].includes(tab)
          ? (tab as ReportsSearchParams["tab"])
          : undefined,
    };
  },
  component: ReportsRouteComponent,
});

function ReportsRouteComponent() {
  const { tab } = Route.useSearch();
  return <Reports initialTab={tab} />;
}