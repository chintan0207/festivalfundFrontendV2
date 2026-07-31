/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  useFestivals,
  useCreateFestival,
  useUpdateFestival,
  useSoftDeleteFestival,
} from "@/api/festival/useFestivals";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivalStore as useMockFestivalStore } from "@/store/festivalStore";
import { gradientColors, getModuleTheme } from "@/theme/colors";
import {
  AppButton,
  AppBadge,
  PageHeader,
  PageFilterToolbar,
} from "@/components/common";
import {
  FestivalFormModal,
  type FestivalFormValues,
} from "./components/FestivalFormModal";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Check,
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

export const FestivalsPage = () => {
  // Module theme colors derived from central theme dictionary
  const theme = getModuleTheme("festivals");

  // Real API hook
  const { data: apiFestivals, isLoading: isApiLoading } = useFestivals();
  const activeFestivalId = useFestivalApiStore((s) => s.activeFestivalId);
  const setActiveFestivalId = useFestivalApiStore((s) => s.setActiveFestivalId);

  // Mock store fallback
  const mockFestivals = useMockFestivalStore((s) => s.festivals);

  const rawList =
    apiFestivals && apiFestivals.length > 0 ? apiFestivals : mockFestivals;

  // Normalized items
  const festivals = rawList.map((item: any) => ({
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
      contributorsCount:
        item.stats?.contributorsCount || item.contributorsCount || 0,
    },
  }));

  const createMutation = useCreateFestival();
  const updateMutation = useUpdateFestival();
  const deleteMutation = useSoftDeleteFestival();

  const [filterTab, setFilterTab] = useState<
    "ACTIVE" | "UPCOMING" | "ARCHIVED" | "ALL"
  >("ACTIVE");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("ALL");

  // Sorting State
  const [activeSort, setActiveSort] = useState<
    "name" | "targetAmount" | "totalCollected" | "startDate"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFest, setEditingFest] = useState<any | null>(null);

  const handleOpenCreate = () => {
    setEditingFest(null);
    setIsModalOpen(true);
  };

  // Open the create modal from the mobile FAB
  useEffect(() => {
    const handler = () => {
      setEditingFest(null);
      setIsModalOpen(true);
    };
    window.addEventListener("ff:open-add-festivals", handler);
    return () => window.removeEventListener("ff:open-add-festivals", handler);
  }, []);

  const handleOpenEdit = (fest: any) => {
    setEditingFest(fest);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (values: FestivalFormValues) => {
    if (editingFest) {
      updateMutation.mutate(
        {
          festivalId: editingFest.id,
          payload: {
            name: values.name,
            year: Number(values.year),
            targetAmount: Number(values.targetAmount),
            status: values.status,
            category: values.category,
            location: values.location,
            description: values.description,
            startDate: values.startDate,
            endDate: values.endDate,
          },
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingFest(null);
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          name: values.name,
          year: Number(values.year),
          targetAmount: Number(values.targetAmount),
          status: values.status,
          category: values.category,
          location: values.location,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          openingBalance: 0,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingFest(null);
          },
        }
      );
    }
  };

  const handleSortChange = (sortId: string) => {
    if (activeSort === sortId) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setActiveSort(sortId as any);
      setSortDirection("asc");
    }
  };

  const filteredFestivals = festivals.filter((f) => {
    const matchesTab =
      filterTab === "ALL"
        ? true
        : filterTab === "ARCHIVED"
          ? f.status === "COMPLETED" || f.status === "ARCHIVED"
          : f.status === filterTab;

    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL"
        ? true
        : f.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesYear =
      selectedYear === "ALL" ? true : String(f.year) === selectedYear;

    const matchesLocation =
      selectedLocation === "ALL"
        ? true
        : f.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return (
      matchesTab &&
      matchesSearch &&
      matchesCategory &&
      matchesYear &&
      matchesLocation
    );
  });

  // Apply sorting
  const sortedFestivals = [...filteredFestivals].sort((a, b) => {
    let valA = a[activeSort as keyof typeof a];
    let valB = b[activeSort as keyof typeof b];

    if (activeSort === "totalCollected") {
      valA = a.stats?.totalCollected || 0;
      valB = b.stats?.totalCollected || 0;
    }

    if (typeof valA === "string") {
      return sortDirection === "asc"
        ? valA.localeCompare(valB as string)
        : (valB as string).localeCompare(valA);
    }
    return sortDirection === "asc"
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });

  const activeCount = festivals.filter((f) => f.status === "ACTIVE").length;
  const upcomingCount = festivals.filter((f) => f.status === "UPCOMING").length;
  const archivedCount = festivals.filter(
    (f) => f.status === "COMPLETED" || f.status === "ARCHIVED"
  ).length;

  const activeFilterPills = [];
  if (selectedCategory !== "ALL") {
    activeFilterPills.push({
      id: "category",
      label: `Category: ${selectedCategory}`,
      onRemove: () => setSelectedCategory("ALL"),
    });
  }
  if (selectedYear !== "ALL") {
    activeFilterPills.push({
      id: "year",
      label: `Year: ${selectedYear}`,
      onRemove: () => setSelectedYear("ALL"),
    });
  }
  if (selectedLocation !== "ALL") {
    activeFilterPills.push({
      id: "location",
      label: `Location: ${selectedLocation}`,
      onRemove: () => setSelectedLocation("ALL"),
    });
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
        badge={<AppBadge className={theme.badgeColor}>{festivals.length} total</AppBadge>}
        actions={
          <AppButton
            onClick={handleOpenCreate}
            leftIcon={<Plus className="h-4 w-4" />}
            gradient={theme.gradient}
          >
            Create Festival
          </AppButton>
        }
      />

      {/* CARD-BASED FILTER TOOLBAR WITH INLINE PILL TRACKS & SORTING */}
      <PageFilterToolbar
        module="festivals"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search festivals by title, location..."
        quickFilters={[
          {
            id: "year",
            label: "All Years",
            icon: <Calendar className="h-3.5 w-3.5 text-muted-foreground" />,
            value: selectedYear,
            options: [
              { value: "ALL", label: "All Years" },
              { value: "2026", label: "2026" },
              { value: "2025", label: "2025" },
              { value: "2024", label: "2024" },
            ],
            onChange: (val) => setSelectedYear(val),
          },
          {
            id: "location",
            label: "All Locations",
            icon: <MapPin className="h-3.5 w-3.5 text-muted-foreground" />,
            value: selectedLocation,
            options: [
              { value: "ALL", label: "All Locations" },
              { value: "Community Grounds", label: "Community Grounds" },
              { value: "Main Hall", label: "Main Hall" },
              { value: "Temple Complex", label: "Temple Complex" },
            ],
            onChange: (val) => setSelectedLocation(val),
          },
        ]}
        pillGroups={[
          {
            id: "status",
            label: "Status",
            icon: <Filter className="h-3.5 w-3.5 text-muted-foreground" />,
            value: filterTab,
            options: [
              { value: "ACTIVE", label: "Active", count: activeCount },
              { value: "UPCOMING", label: "Upcoming", count: upcomingCount },
              { value: "ARCHIVED", label: "Archived", count: archivedCount },
              { value: "ALL", label: "All", count: festivals.length },
            ],
            onChange: (val) => setFilterTab(val as any),
            variant: "module",
          },
          {
            id: "category",
            label: "Category",
            icon: <Tag className="h-3.5 w-3.5 text-muted-foreground" />,
            value: selectedCategory,
            options: [
              { value: "ALL", label: "All" },
              { value: "Religious & Cultural", label: "Religious & Cultural" },
              { value: "Social & Community", label: "Social & Community" },
              { value: "Youth & Sports", label: "Youth & Sports" },
            ],
            onChange: (val) => setSelectedCategory(val),
            variant: "emerald",
          },
        ]}
        sortOptions={[
          { id: "name", label: "Name" },
          { id: "targetAmount", label: "Budget" },
          { id: "totalCollected", label: "Collected" },
          { id: "startDate", label: "Date" },
        ]}
        activeSort={activeSort}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        activeFilters={activeFilterPills}
        onResetAll={() => {
          setSearchQuery("");
          setSelectedCategory("ALL");
          setSelectedYear("ALL");
          setSelectedLocation("ALL");
          setFilterTab("ACTIVE");
          setActiveSort("name");
          setSortDirection("asc");
        }}
      />

      {/* FESTIVAL CARDS GRID */}
      {isApiLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">
          Loading festivals...
        </div>
      ) : sortedFestivals.length === 0 ? (
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
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedYear("ALL");
                setSelectedLocation("ALL");
                setFilterTab("ALL");
              }}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              gradient={theme.gradient}
            >
              Clear Filters
            </AppButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sortedFestivals.map((fest: any, index: number) => {
            const cardGradient = gradientColors[index % gradientColors.length];
            const isSelected = activeFestivalId === fest.id;
            const collected = fest.stats?.totalCollected || 0;
            const target = fest.targetAmount || 500000;
            const progressPercent = Math.min(
              100,
              Math.round((collected / (target || 1)) * 100)
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
                    <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-border/40">
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

                      <div className="p-1.5 sm:p-2 rounded-lg bg-muted/30 border border-border/30 text-center space-y-0.5 min-w-0">
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
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setActiveFestivalId(fest.id)}
                    leftIcon={
                      isSelected ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      )
                    }
                    className="flex-1 text-xs"
                  >
                    {isSelected ? "Active Context" : "View Details"}
                  </AppButton>

                  <AppButton
                    size="icon"
                    variant="outline"
                    onClick={() => handleOpenEdit(fest)}
                    title="Edit Festival"
                    className="shrink-0"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </AppButton>

                  <AppButton
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${fest.name}?`)) {
                        deleteMutation.mutate(fest.id);
                      }
                    }}
                    className="text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 shrink-0"
                    title="Delete Festival"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </AppButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REACT-HOOK-FORM + ZOD FORM MODAL */}
      <FestivalFormModal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingFest(null);
        }}
        onSubmit={handleFormSubmit}
        initialValues={editingFest}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default FestivalsPage;
