import { Users } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { chartCategoryColor } from "@/theme/colors";
import { categoryLabel } from "@/lib/categoryMeta";
import { useContributorApiStore } from "@/api/contributor/contributor.store";
import type { DashboardData } from "@/api/dashboard/dashboard.service";
import { HorizontalBarChart, type HBarDatum } from "./charts/HorizontalBarChart";

interface DashboardContributorCategoriesProps {
  data: DashboardData;
}

export function DashboardContributorCategories({
  data,
}: DashboardContributorCategoriesProps) {
  const navigate = useNavigate();

  const rows: HBarDatum[] = data.contributions.byContributorCategory.map((row) => ({
    name: categoryLabel(row.category),
    value: row.total,
    count: row.count,
    color: chartCategoryColor(row.category),
  }));

  const handleRowClick = (datum: HBarDatum) => {
    const category = data.contributions.byContributorCategory.find(
      (row) => categoryLabel(row.category) === datum.name,
    )?.category;
    if (!category) return;
    useContributorApiStore.getState().setCategory(category);
    navigate({ to: "/dashboard/contributors" });
  };

  return (
    <AppCard
      icon={<Users className="h-4 w-4" />}
      title="By Contributor Category"
      subtitle="Deposited amount by category"
      compact
      className="flex h-full flex-col"
    >
      {rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No category data yet"
          description="Deposited contributions grouped by contributor category will appear here."
        />
      ) : (
        <HorizontalBarChart data={rows} onRowClick={handleRowClick} />
      )}
      {rows.length > 0 && (
        <p className="mt-2 text-[10px] text-muted-foreground">
          Click a category to open the contributors list focused on it.
        </p>
      )}
    </AppCard>
  );
}