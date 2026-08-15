/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Outlet, useMatches, useRouter } from "@tanstack/react-router";
import { useFestivals, useSoftDeleteFestival } from "@/api/festival/useFestivals";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivalStore as useMockFestivalStore } from "@/store/festivalStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import { gradientColors, getModuleTheme } from "@/theme/colors";
import {
  AppButton,
  AppBadge,
  ConfirmDialog,
  PageHeader,
  PageFilterToolbar,
  RowActionsMenu,
  DataTablePagination,
} from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";
import { festivalCategoryOptions } from "./lib/festivalMeta";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Tag,
  MapPin,
  Filter,
} from "lucide-react";

const formatCurrencyShort = (amount: number = 0) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, "")}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatCleanDate = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatEventDateRange = (startDate?: string, endDate?: string) => {
  const start = formatCleanDate(startDate);
  const end = formatCleanDate(endDate);
  if (start && end) return `${start} – ${end}`;
  return start || end || "Dates TBD";
};

const calculateDaysLeft = (endDateStr?: string) => {
  if (!endDateStr) return 0;
  const target = new Date(endDateStr).getTime();
  const now = new Date().getTime();
  if (isNaN(target)) return 0;
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const normalizeFestival = (item: any) => ({
  id: item._id || item.id,
  name: item.name,
  year: item.year || 2026,
  status: (item.status || "ACTIVE").toUpperCase(),
  targetAmount: item.targetAmount || 500000,
  category: item.category || "Religious & Cultural",
  location: item.location || "Community Grounds",
  description: item.description || `${item.name} celebration and events.`,
  startDate: item.startDate || "2026-09-07",
  endDate: item.endDate || "2026-09-17",
  stats: {
    openingBalance: item.stats?.openingBalance || 0,
    totalCollected: item.stats?.totalCollected || 0,
    pendingAmount: item.stats?.pendingAmount || 0,
    totalExpenses: item.stats?.totalExpenses || 0,
    currentBalance: item.stats?.currentBalance || 0,
    contributorsCount: item.stats?.contributorsCount || item.contributorsCount || 0,
  },
});

export const FestivalsPage = () => {
  const router = useRouter();
  const matches = useMatches();

  const theme = getModuleTheme("festivals");

  // List-state lives in the store (mirrors contributors/contributions)
  const page = useFestivalApiStore((s) => s.page);
  const limit = useFestivalApiStore((s) => s.limit);
  const search = useFestivalApiStore((s) => s.search);
  const sortField = useFestivalApiStore((s) => s.sortField);
  const sortOrder = useFestivalApiStore((s) => s.sortOrder);
  const status = useFestivalApiStore((s) => s.status);
  const category = useFestivalApiStore((s) => s.category);
  const year = useFestivalApiStore((s) => s.year);
  const location = useFestivalApiStore((s) => s.location);
  const total = useFestivalApiStore((s) => s.total);
  const totalPages = useFestivalApiStore((s) => s.totalPages);
  const statusCounts = useFestivalApiStore((s) => s.statusCounts);
  const facets = useFestivalApiStore((s) => s.facets);
  const setPage = useFestivalApiStore((s) => s.setPage);
  const setLimit = useFestivalApiStore((s) => s.setLimit);
  const setSearch = useFestivalApiStore((s) => s.setSearch);
  const setSortField = useFestivalApiStore((s) => s.setSortField);
  const setSortOrder = useFestivalApiStore((s) => s.setSortOrder);
  const setStatus = useFestivalApiStore((s) => s.setStatus);
  const setCategory = useFestivalApiStore((s) => s.setCategory);
  const setYear = useFestivalApiStore((s) => s.setYear);
  const setLocation = useFestivalApiStore((s) => s.setLocation);
  const resetFilters = useFestivalApiStore((s) => s.resetFilters);

  const activeFestivalId = useFestivalApiStore((s) => s.activeFestivalId);

  // Debounced local search → store (resets page)
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const mockFestivals = useMockFestivalStore((s) => s.festivals);

  const queryParams = {
    page,
    limit,
    search: search || undefined,
    sortField,
    sortOrder,
    ...(status && status !== "ALL" ? { status } : {}),
    ...(category ? { category } : {}),
    ...(year && year !== "ALL" ? { year } : {}),
    ...(location && location !== "ALL" ? { location } : {}),
  };

  const { data, isLoading } = useFestivals(queryParams);
  const deleteMutation = useSoftDeleteFestival();

  // Mock fallback: only when the server never returned data (dev mode)
  const serverFetched = data !== undefined;
  const showMock = !serverFetched && !isLoading && mockFestivals.length > 0;

  const festivals = (serverFetched ? data?.festivals ?? [] : showMock ? mockFestivals : [])
    .filter((item: any) => !item?.isDeleted)
    .map(normalizeFestival);

  const counts = statusCounts;
  const facetData = facets;

  const activeCount = counts.ACTIVE || 0;
  const upcomingCount = counts.UPCOMING || 0;
  const archivedCount = (counts.COMPLETED || 0) + (counts.ARCHIVED || 0);

  const yearOptions = [
    { value: "ALL", label: "All Years" },
    ...(facetData.years && facetData.years.length
      ? facetData.years.map((y) => ({ value: String(y), label: String(y) }))
      : [
          { value: "2026", label: "2026" },
          { value: "2025", label: "2025" },
          { value: "2024", label: "2024" },
        ]),
  ];

  const locationOptions = [
    { value: "ALL", label: "All Locations" },
    ...(facetData.locations && facetData.locations.length
      ? facetData.locations.map((loc) => ({ value: loc, label: loc }))
      : [
          { value: "Community Grounds", label: "Community Grounds" },
          { value: "Main Hall", label: "Main Hall" },
          { value: "Temple Complex", label: "Temple Complex" },
        ]),
  ];

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const isAdmin = useIsOrgAdmin();

  // Open the create page from the mobile FAB
  useEffect(() => {
    if (!isAdmin) return;
    const handler = () => {
      router.navigate({ to: "/dashboard/festivals/new" });
    };
    window.addEventListener("ff:open-add-festivals", handler);
    return () => window.removeEventListener("ff:open-add-festivals", handler);
  }, [router, isAdmin]);

  const handleSortChange = (sortId: string) => {
    if (sortField === sortId) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(sortId);
      setSortOrder("desc");
    }
  };

  const handleResetAll = () => {
    resetFilters();
    setLocalSearch("");
  };

  const activeFilterPills = [];
  if (category) {
    activeFilterPills.push({
      id: "category",
      label: `Category: ${category}`,
      onRemove: () => setCategory(""),
    });
  }
  if (year && year !== "ALL") {
    activeFilterPills.push({
      id: "year",
      label: `Year: ${year}`,
      onRemove: () => setYear(""),
    });
  }
  if (location && location !== "ALL") {
    activeFilterPills.push({
      id: "location",
      label: `Location: ${location}`,
      onRemove: () => setLocation(""),
    });
  }

  if (
    matches.some((m) =>
      m.routeId === "/dashboard/festivals/new" ||
      m.routeId === "/dashboard/festivals/$festivalId" ||
      m.routeId === "/dashboard/festivals/$festivalId/edit",
    )
  ) {
    return <Outlet />;
  }

  return (
    <div className="space-y-5 pb-28 md:pb-10 max-w-[1400px] mx-auto px-1 sm:px-0">
      {/* PAGE HEADER USING CENTRAL MODULE THEME */}
      <PageHeader
        module="festivals"
        title="Festivals"
        description="Manage all your festivals with budgets, timelines, and progress tracking."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Festivals", to: "/dashboard/festivals" },
        ]}
        badge={<AppBadge className={theme.badgeColor}>{serverFetched ? total : festivals.length} total</AppBadge>}
        actions={
          isAdmin && (
            <AppButton
              onClick={() => router.navigate({ to: "/dashboard/festivals/new" })}
              leftIcon={<Plus className="h-4 w-4" />}
              gradient={theme.gradient}
            >
              Create Festival
            </AppButton>
          )
        }
      />

      {/* CARD-BASED FILTER TOOLBAR WITH INLINE PILL TRACKS & SORTING */}
      <PageFilterToolbar
        module="festivals"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        searchPlaceholder="Search festivals by title, location..."
        quickFilters={[
          {
            id: "year",
            label: yearOptions.find((o) => o.value === year)?.label || "All Years",
            icon: <Calendar className="h-3.5 w-3.5 text-muted-foreground" />,
            value: year || "ALL",
            options: yearOptions,
            onChange: (val) => setYear(val),
          },
          {
            id: "location",
            label:
              locationOptions.find((o) => o.value === location)?.label || "All Locations",
            icon: <MapPin className="h-3.5 w-3.5 text-muted-foreground" />,
            value: location || "ALL",
            options: locationOptions,
            onChange: (val) => setLocation(val),
          },
        ]}
        pillGroups={[
          {
            id: "status",
            label: "Status",
            icon: <Filter className="h-3.5 w-3.5 text-muted-foreground" />,
            value: status || "ALL",
            options: [
              { value: "ACTIVE", label: "Active", count: activeCount },
              { value: "UPCOMING", label: "Upcoming", count: upcomingCount },
              { value: "ARCHIVED", label: "Archived", count: archivedCount },
              { value: "ALL", label: "All", count: counts.total ?? 0 },
            ],
            onChange: (val) => setStatus(val),
            variant: "module",
          },
          {
            id: "category",
            label: "Category",
            icon: <Tag className="h-3.5 w-3.5 text-muted-foreground" />,
            value: category || "ALL",
            options: [
              { value: "ALL", label: "All" },
              ...festivalCategoryOptions,
            ],
            onChange: (val) => setCategory(val === "ALL" ? "" : val),
            variant: "emerald",
          },
        ]}
        sortOptions={[
          { id: "name", label: "Name" },
          { id: "targetAmount", label: "Budget" },
          { id: "totalCollected", label: "Collected" },
          { id: "startDate", label: "Date" },
        ]}
        activeSort={sortField}
        sortDirection={sortOrder}
        onSortChange={handleSortChange}
        activeFilters={activeFilterPills}
        onResetAll={handleResetAll}
      />

      {/* FESTIVAL CARDS GRID */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          aria-hidden="true"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-card border border-border/80 overflow-hidden"
            >
              <Skeleton className="h-24 w-full rounded-none" />
              <div className="p-3.5 sm:p-4 space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : festivals.length === 0 ? (
        <div className="py-14 px-4 text-center rounded-2xl bg-card border border-border/80 space-y-3 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground">
            <Calendar className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">No festivals found</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            No festivals match your current filter or search criteria.
          </p>
          <div className="pt-1 flex justify-center">
            <AppButton
              onClick={handleResetAll}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              gradient={theme.gradient}
            >
              Clear Filters
            </AppButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {festivals.map((fest: any, index: number) => {
            const cardGradient = gradientColors[index % gradientColors.length];
            const isSelected = activeFestivalId === fest.id;
            const collected = fest.stats?.totalCollected || 0;
            const target = fest.targetAmount || 500000;
            const progressPercent = Math.min(
              100,
              Math.round((collected / (target || 1)) * 100),
            );
            const daysLeft = calculateDaysLeft(fest.endDate);
            const formattedDates = formatEventDateRange(fest.startDate, fest.endDate);

            return (
              <div
                key={fest.id}
                className={`group rounded-2xl bg-card border overflow-hidden shadow-2xs hover:shadow-card transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/70 hover:border-primary/40"
                }`}
              >
                <div>
                  {/* Banner Header Area with Central Theme Gradient Colors */}
                  <div
                    className={`relative h-24 p-3.5 ${cardGradient} flex flex-col justify-between text-white shadow-inner`}
                  >
                    {/* Status Badge */}
                    <div className="flex justify-end">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-slate-900 dark:bg-slate-900/90 dark:text-white backdrop-blur-md shadow-2xs">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            fest.status === "ACTIVE"
                              ? "bg-emerald-500"
                              : fest.status === "UPCOMING"
                                ? "bg-amber-500"
                                : "bg-slate-400"
                          }`}
                        />
                        <span>
                          {fest.status === "ACTIVE"
                            ? "Active"
                            : fest.status === "UPCOMING"
                              ? "Upcoming"
                              : "Completed"}
                        </span>
                      </span>
                    </div>

                    {/* Dates Pill on Banner */}
                    <div className="inline-flex items-center gap-1.5 self-start backdrop-blur-sm bg-black/30 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-medium border border-white/10 max-w-[80%] truncate">
                      <Calendar className="h-3 w-3 text-white/80 shrink-0" />
                      <span className="truncate">{formattedDates}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 sm:p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors capitalize">
                        {fest.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {fest.description}
                      </p>
                    </div>

                    {/* Collection Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-semibold text-muted-foreground">
                          Collection Progress
                        </span>
                        <span className="font-bold text-foreground">
                          {formatCurrencyShort(collected)}{" "}
                          <span className="text-muted-foreground font-normal">
                            / {formatCurrencyShort(target)}
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* 3 Metric Chips Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1.5 border-t border-border/40">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-muted/30 border border-border/30 text-center space-y-0.5 min-w-0">
                        <span className="text-[9px] font-semibold text-muted-foreground block truncate">
                          Contributors
                        </span>
                        <span className="text-xs font-bold text-foreground block tracking-tight truncate">
                          {fest.stats.contributorsCount || 0}
                        </span>
                      </div>

                      <div className="p-1.5 sm:p-2 rounded-lg bg-muted/30 border border-border/30 text-center space-y-0.5 min-w-0">
                        <span className="text-[9px] font-semibold text-muted-foreground block truncate">
                          Expenses
                        </span>
                        <span className="text-xs font-bold text-foreground block tracking-tight truncate">
                          {formatCurrencyShort(fest.stats.totalExpenses)}
                        </span>
                      </div>

                      <div className="p-1.5 sm:p-2 rounded-lg bg-muted/30 border border-border/30 text-center space-y-0.5 min-w-0 col-span-2 sm:col-span-1">
                        <span className="text-[9px] font-semibold text-muted-foreground block truncate">
                          Days Left
                        </span>
                        <span className="text-xs font-bold text-foreground block tracking-tight truncate">
                          {daysLeft}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3.5 sm:p-4 pt-0 flex items-center gap-1.5">
                  <AppButton
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.navigate({
                        to: "/dashboard/festivals/$festivalId",
                        params: { festivalId: fest.id },
                      })
                    }
                    leftIcon={<Eye className="h-3.5 w-3.5 text-muted-foreground" />}
                    className="flex-1 text-xs"
                  >
                    View Details
                  </AppButton>

                  <RowActionsMenu
                    title="Festival actions"
                    actions={[
                      {
                        key: "edit",
                        label: "Edit Festival",
                        icon: <Edit className="h-3.5 w-3.5" />,
                        show: isAdmin,
                        onSelect: () =>
                          router.navigate({
                            to: "/dashboard/festivals/$festivalId/edit",
                            params: { festivalId: fest.id },
                          }),
                      },
                      {
                        key: "delete",
                        label: "Delete Festival",
                        icon: <Trash2 className="h-3.5 w-3.5" />,
                        variant: "destructive",
                        separatorBefore: true,
                        show: isAdmin,
                        onSelect: () => setDeleteTarget(fest),
                      },
                    ]}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {serverFetched && !isLoading && festivals.length > 0 && (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          module="festivals"
        />
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Festival"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? It will be marked as deleted and can be restored later.`
            : undefined
        }
        confirmLabel="Delete Festival"
        variant="danger"
        icon={<Trash2 className="h-4 w-4" />}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id, {
              onSettled: () => setDeleteTarget(null),
            });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default FestivalsPage;