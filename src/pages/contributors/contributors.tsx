import { useEffect, useState, useCallback } from "react";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { Outlet, useNavigate, useMatches } from "@tanstack/react-router";
import { useContributorApiStore } from "@/api/contributor/contributor.store";
import { useContributors } from "@/api/contributor/useContributors";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useReportPdfExport } from "@/api/report/useReports";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import { getModuleTheme } from "@/theme/colors";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilterToolbar } from "@/components/common/PageFilterToolbar";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { PageContainer } from "@/components/common/PageContainer";
import { ViewToggleButton } from "@/components/common/ViewToggleButton";
import { AppButton } from "@/components/common/AppButton";
import { AppBadge } from "@/components/common/AppBadge";
import { ContributorTable } from "./components/list/ContributorTable";
import { ContributorMobileCards } from "./components/list/ContributorMobileCards";
// import { ContributorKPIs } from "./components/list/ContributorKPIs";
import { ContributorDialogs } from "./components/dialogs/ContributorDialogs";
import { useContributorDialogs } from "./useContributorDialogs";
import { categoryLabel } from "@/lib/categoryMeta";
import type { Contributor } from "@/types/Types";

export default function ContributorsPage() {
  const theme = getModuleTheme("contributors");
  // Store
  const page = useContributorApiStore((s) => s.page);
  const limit = useContributorApiStore((s) => s.limit);
  const search = useContributorApiStore((s) => s.search);
  const sortField = useContributorApiStore((s) => s.sortField);
  const sortOrder = useContributorApiStore((s) => s.sortOrder);
  const category = useContributorApiStore((s) => s.category);
  const isActive = useContributorApiStore((s) => s.isActive);
  const total = useContributorApiStore((s) => s.total);
  const totalPages = useContributorApiStore((s) => s.totalPages);
  const contributors = useContributorApiStore((s) => s.contributors);
  const categoryCounts = useContributorApiStore((s) => s.categoryCounts);
  const setPage = useContributorApiStore((s) => s.setPage);
  const setLimit = useContributorApiStore((s) => s.setLimit);
  const setSearch = useContributorApiStore((s) => s.setSearch);
  const setSortField = useContributorApiStore((s) => s.setSortField);
  const setSortOrder = useContributorApiStore((s) => s.setSortOrder);
  const setCategory = useContributorApiStore((s) => s.setCategory);
  const setIsActive = useContributorApiStore((s) => s.setIsActive);
  const resetFilters = useContributorApiStore((s) => s.resetFilters);

  // Local UI
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 400);
  const [minimalView, setMinimalView] = useState(false);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const navigate = useNavigate();
  const matches = useMatches();
  const isAdmin = useIsOrgAdmin();

  // Festivals (single source of truth is the top navbar selector)
  const { activeFestivalId, activeFestival } = useFestivalApiStore();

  const dialogs = useContributorDialogs({ themeGradient: theme.gradient });
  const { openAdd } = dialogs;

  const reportExport = useReportPdfExport();

  const handleExport = useCallback(() => {
    if (!activeFestivalId) {
      toast.error("No festival selected. Please select a festival first.");
      return;
    }

    const filenameSlug = (activeFestival?.name || "festival")
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    reportExport.mutate({
      type: "contributors",
      festivalId: activeFestivalId,
      params: {
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(category ? { contributorCategory: category } : {}),
        ...(isActive && isActive !== "true" ? { isActive: isActive === "true" } : {}),
        sortField,
        sortOrder,
      },
      fileName: `contributors-${filenameSlug}.pdf`,
    });
  }, [activeFestivalId, activeFestival, search, category, isActive, sortField, sortOrder, reportExport]);

  // Open the add dialog from the mobile FAB
  useEffect(() => {
    if (!isAdmin) return;
    const handler = () => openAdd();
    window.addEventListener("ff:open-add-contributors", handler);
    return () => window.removeEventListener("ff:open-add-contributors", handler);
  }, [openAdd, isAdmin]);

  const handleRowClick = useCallback((contributor: Contributor) => {
    navigate({ to: "/dashboard/contributors/$contributorId", params: { contributorId: contributor._id } });
  }, [navigate]);

  // Handle reset: clear both store and local state synchronously
  const handleResetAll = useCallback(() => {
    resetFilters();
    setLocalSearch("");
  }, [resetFilters]);

  // Query
  const queryParams = {
    page,
    limit,
    search: search || undefined,
    sortField,
    sortOrder,
    ...(category ? { category } : {}),
    ...(isActive ? { isActive } : {}),
  };

  const { isLoading } = useContributors(queryParams);

  // Handlers
  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("desc");
      }
    },
    [sortField, sortOrder, setSortField, setSortOrder],
  );

  // Active filters for toolbar
  const activeFilters = [];
  if (category) {
    activeFilters.push({
      id: "category",
      label: `Category: ${categoryLabel(category)}`,
      onRemove: () => setCategory(""),
    });
  }
  if (isActive && isActive !== "true") {
    activeFilters.push({
      id: "isActive",
      label: `Status: ${isActive === "true" ? "Active" : "Inactive"}`,
      onRemove: () => setIsActive("true"),
    });
  }

  if (matches.some((m) => m.routeId === "/dashboard/contributors/$contributorId")) {
    return <Outlet />;
  }

  return (
    <PageContainer variant="list">
      <PageHeader
        module="contributors"
        title="Contributors"
        description="Manage donor profiles across Parents, Boys, and Girls categories"
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Contributors", to: "/dashboard/contributors" },
        ]}
        badge={<AppBadge className={theme.badgeColor}>{total} total</AppBadge>}
        actions={
          <>
            <AppButton
              className={theme.iconColor}
              variant="outline"
              onClick={handleExport}
              loading={reportExport.isPending}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export PDF
            </AppButton>
            {isAdmin && (
              <AppButton
                onClick={dialogs.openAdd}
                leftIcon={<Plus className="h-4 w-4" />}
                gradient={theme.gradient}
              >
                Add Contributor
              </AppButton>
            )}
          </>
        }
      />

      {/* <ContributorKPIs themeGradient={theme.gradient} /> */}

      <PageFilterToolbar
        module="contributors"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        searchPlaceholder="Search by name, phone, email, or code..."
        pillGroups={[
          {
            id: "category",
            label: "Category",
            value: category || "ALL",
            options: [
              { value: "ALL", label: "All", count: categoryCounts.total ?? total },
              { value: "PARENT", label: "Parents", count: categoryCounts.PARENT ?? 0 },
              { value: "BOY", label: "Boys", count: categoryCounts.BOY ?? 0 },
              { value: "GIRL", label: "Girls", count: categoryCounts.GIRL ?? 0 },
            ],
            onChange: (val) => setCategory(val === "ALL" ? "" : val),
            variant: "module",
          },
          // {
          //   id: "status",
          //   label: "Status",
          //   value: isActive,
          //   options: [
          //     { value: "true", label: "Active" },
          //     { value: "false", label: "Inactive" },
          //     { value: "", label: "All" },
          //   ],
          //   onChange: (val) => setIsActive(val),
          //   variant: "module",
          // },
        ]}
        sortOptions={[
          { id: "createdAt", label: "Created" },
          { id: "name", label: "Name" },
          { id: "updatedAt", label: "Updated" },
        ]}
        activeSort={sortField}
        sortDirection={sortOrder}
        onSortChange={handleSort}
        activeFilters={activeFilters}
        onResetAll={handleResetAll}
        minimal={minimalView}
        searchRightActions={
          <ViewToggleButton
            minimal={minimalView}
            onToggle={() => setMinimalView((v) => !v)}
          />
        }
      />

      {/* Mobile cards */}
      <ContributorMobileCards
        contributors={contributors}
        isLoading={isLoading}
        minimal={minimalView}
        onEdit={dialogs.openEdit}
        onDelete={dialogs.openDelete}
        onRowClick={handleRowClick}
      />

      {/* Desktop table */}
      <div className="hidden md:block">
        <ContributorTable
          contributors={contributors}
          isLoading={isLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={dialogs.openEdit}
          onDelete={dialogs.openDelete}
          onRowClick={handleRowClick}
        />
      </div>

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        module="contributors"
      />

      <ContributorDialogs {...dialogs.dialogsProps} />
    </PageContainer>
  );
}
