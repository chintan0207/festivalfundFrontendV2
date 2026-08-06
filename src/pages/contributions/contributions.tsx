import { useEffect, useState, useCallback } from "react";
import { Plus, List, LayoutGrid } from "lucide-react";
import { Outlet, useNavigate, useMatches } from "@tanstack/react-router";
import { useContributionApiStore } from "@/api/contribution/contribution.store";
import { useContributions } from "@/api/contribution/useContributions";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useDebounce } from "@/hooks/useDebounce";
import { getModuleTheme } from "@/theme/colors";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilterToolbar } from "@/components/common/PageFilterToolbar";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { AppButton } from "@/components/common/AppButton";
import { AppBadge } from "@/components/common/AppBadge";
import { ContributionTable } from "./components/list/ContributionTable";
import { ContributionMobileCards } from "./components/list/ContributionMobileCards";
import { ContributionKPIs } from "./components/list/ContributionKPIs";
import { ContributionDialogs } from "./components/dialogs/ContributionDialogs";
import { useContributionDialogs } from "./useContributionDialogs";
import {
  contributionCategoryLabel,
  contributionStatusLabel,
  contributionTypeLabel,
} from "./lib/contributionMeta";
import type { ContributionListItem } from "@/types/Types";

export default function ContributionsPage() {
  const theme = getModuleTheme("contributions");
  // Store
  const page = useContributionApiStore((s) => s.page);
  const limit = useContributionApiStore((s) => s.limit);
  const search = useContributionApiStore((s) => s.search);
  const sortField = useContributionApiStore((s) => s.sortField);
  const sortOrder = useContributionApiStore((s) => s.sortOrder);
  const status = useContributionApiStore((s) => s.status);
  const category = useContributionApiStore((s) => s.category);
  const type = useContributionApiStore((s) => s.type);
  const total = useContributionApiStore((s) => s.total);
  const totalPages = useContributionApiStore((s) => s.totalPages);
  const contributions = useContributionApiStore((s) => s.contributions);
  const setPage = useContributionApiStore((s) => s.setPage);
  const setLimit = useContributionApiStore((s) => s.setLimit);
  const setSearch = useContributionApiStore((s) => s.setSearch);
  const setSortField = useContributionApiStore((s) => s.setSortField);
  const setSortOrder = useContributionApiStore((s) => s.setSortOrder);
  const setStatus = useContributionApiStore((s) => s.setStatus);
  const setCategory = useContributionApiStore((s) => s.setCategory);
  const setType = useContributionApiStore((s) => s.setType);
  const resetFilters = useContributionApiStore((s) => s.resetFilters);

  // Festivals (for filter)
  const { isAllFestivals, activeFestivalId } = useFestivalApiStore();
  const festivalId = isAllFestivals || !activeFestivalId ? "" : activeFestivalId;

  // Local UI
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 400);
  const [minimalView, setMinimalView] = useState(false);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const navigate = useNavigate();
  const matches = useMatches();

  const dialogs = useContributionDialogs({ themeGradient: theme.gradient });
  const { openAdd } = dialogs;

  // Open the add dialog from the mobile FAB
  useEffect(() => {
    const handler = () => openAdd();
    window.addEventListener("ff:open-add-contributions", handler);
    return () => window.removeEventListener("ff:open-add-contributions", handler);
  }, [openAdd]);

  const handleRowClick = useCallback(
    (contribution: ContributionListItem) => {
      navigate({
        to: "/dashboard/contributions/$contributionId",
        params: { contributionId: contribution._id },
      });
    },
    [navigate],
  );

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
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(type ? { type } : {}),
    ...(festivalId ? { festivalId } : {}),
  };

  const { isLoading } = useContributions(queryParams);

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
  if (status) {
    activeFilters.push({
      id: "status",
      label: `Status: ${contributionStatusLabel(status)}`,
      onRemove: () => setStatus(""),
    });
  }
  if (category) {
    activeFilters.push({
      id: "category",
      label: `Category: ${contributionCategoryLabel(category)}`,
      onRemove: () => setCategory(""),
    });
  }
  if (type) {
    activeFilters.push({
      id: "type",
      label: `Type: ${contributionTypeLabel(type)}`,
      onRemove: () => setType(""),
    });
  }

  if (matches.some((m) => m.routeId === "/dashboard/contributions/$contributionId")) {
    return <Outlet />;
  }

  return (
    <div className="space-y-5 pb-40 md:pb-12 max-w-[1400px] mx-auto px-1 sm:px-0">
      <PageHeader
        module="contributions"
        title="Contributions"
        description="Track donor contributions, receipts, and festival balances"
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Contributions", to: "/dashboard/contributions" },
        ]}
        badge={<AppBadge className={theme.badgeColor}>{total} total</AppBadge>}
        actions={
          <AppButton
            onClick={dialogs.openAdd}
            leftIcon={<Plus className="h-4 w-4" />}
            gradient={theme.gradient}
          >
            Add Contribution
          </AppButton>
        }
      />

      <ContributionKPIs contributions={contributions} />

      <PageFilterToolbar
        module="contributions"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        searchPlaceholder="Search by code, name, phone, or item..."
        quickFilters={[
          {
            id: "status",
            label: "Status",
            value: status || "ALL",
            options: [
              { value: "ALL", label: "All Statuses" },
              { value: "DEPOSITED", label: "Deposited" },
              { value: "PENDING", label: "Pending" },
              { value: "CANCELLED", label: "Cancelled" },
            ],
            onChange: (val) => setStatus(val === "ALL" ? "" : val),
          },
          {
            id: "category",
            label: "Category",
            value: category || "ALL",
            options: [
              { value: "ALL", label: "All Categories" },
              { value: "PARENT", label: "Parents" },
              { value: "BOY", label: "Boys" },
              { value: "GIRL", label: "Girls" },
            ],
            onChange: (val) => setCategory(val === "ALL" ? "" : val),
          },
          {
            id: "type",
            label: "Type",
            value: type || "ALL",
            options: [
              { value: "ALL", label: "All Types" },
              { value: "MONEY", label: "Cash" },
              { value: "ITEM", label: "Item" },
            ],
            onChange: (val) => setType(val === "ALL" ? "" : val),
          },
        ]}
        sortOptions={[
          { id: "createdAt", label: "Created" },
          { id: "name", label: "Name" },
          { id: "date", label: "Date" },
          { id: "amount", label: "Amount" },
        ]}
        activeSort={sortField}
        sortDirection={sortOrder}
        onSortChange={handleSort}
        activeFilters={activeFilters}
        onResetAll={handleResetAll}
        minimal={minimalView}
        searchRightActions={
          <button
            type="button"
            onClick={() => setMinimalView((v) => !v)}
            title={minimalView ? "Show full cards" : "Compact list view"}
            className="md:hidden h-9 px-2.5 rounded-full border border-border/80 bg-muted/30 hover:bg-muted/60 text-foreground text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
          >
            {minimalView ? (
              <LayoutGrid className="h-3.5 w-3.5" />
            ) : (
              <List className="h-3.5 w-3.5" />
            )}
            <span>{minimalView ? "Cards" : "Compact"}</span>
          </button>
        }
      />

      {/* Mobile cards */}
      <ContributionMobileCards
        contributions={contributions}
        isLoading={isLoading}
        minimal={minimalView}
        onEdit={dialogs.openEdit}
        onDelete={dialogs.openDelete}
        onRowClick={handleRowClick}
      />

      {/* Desktop table */}
      <div className="hidden md:block">
        <ContributionTable
          contributions={contributions}
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
        module="contributions"
      />

      <ContributionDialogs {...dialogs.dialogsProps} />
    </div>
  );
}
