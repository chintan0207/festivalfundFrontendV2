import { type ReactNode, useState } from "react";
import {
  Search,
  X,
  ChevronDown,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Filter,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { AppBadge } from "./AppBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getModuleTheme } from "@/theme/colors";
import { cn } from "@/lib/utils";

export interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

export interface QuickFilterOption {
  value: string;
  label: string;
}

export interface QuickFilterGroup {
  id: string;
  label: string;
  icon?: ReactNode;
  value: string;
  options: QuickFilterOption[];
  onChange: (value: string) => void;
}

export interface InlinePillOption {
  value: string;
  label: string;
  count?: number;
}

export interface InlinePillGroup {
  id: string;
  label: string;
  icon?: ReactNode;
  value: string;
  options: InlinePillOption[];
  onChange: (value: string) => void;
  variant?: "module" | "emerald" | "purple" | "blue" | "amber" | "rose";
}

export interface SortOption {
  id: string;
  label: string;
}

export interface ActiveFilterItem {
  id: string;
  label: string;
  onRemove: () => void;
}

export interface PageFilterToolbarProps {
  module?: string;

  // Search
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  searchRightActions?: ReactNode;
  minimal?: boolean;

  // Legacy Tabs (auto-converted to Pill Group if pillGroups not supplied)
  tabs?: FilterTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;

  // Inline Pill Groups (Status: [All] [Active], Category: [All] [Religious], etc.)
  pillGroups?: InlinePillGroup[];

  // Quick Select & Dropdown Filters
  quickFilters?: QuickFilterGroup[];

  // Sort Options (Matches exact reference screenshot layout)
  sortOptions?: SortOption[];
  activeSort?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (sortId: string) => void;

  // Active Filter Pills & Reset
  activeFilters?: ActiveFilterItem[];
  onResetAll?: () => void;

  // Custom Slots
  extraActions?: ReactNode;
  className?: string;
}

export function PageFilterToolbar({
  module = "festivals",
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  searchRightActions,
  minimal = false,
  tabs,
  activeTab,
  onTabChange,
  pillGroups,
  quickFilters = [],
  sortOptions,
  activeSort,
  sortDirection = "asc",
  onSortChange,
  activeFilters = [],
  onResetAll,
  extraActions,
  className,
}: PageFilterToolbarProps) {
  const theme = getModuleTheme(module);

  // Auto convert tabs to standard Status pill group if pillGroups not explicitly supplied
  const effectivePillGroups: InlinePillGroup[] = pillGroups
    ? pillGroups
    : tabs && onTabChange
      ? [
          {
            id: "status_tabs",
            label: "Status",
            icon: <Filter className="h-3.5 w-3.5 text-muted-foreground" />,
            value: activeTab || (tabs[0]?.id ?? "ALL"),
            options: tabs.map((t) => ({
              value: t.id,
              label: t.label,
              count: t.count,
            })),
            onChange: onTabChange,
            variant: "module",
          },
        ]
      : [];

  const popoverFilters = quickFilters;

  const isMobile = useIsMobile();
  const [moreOpen, setMoreOpen] = useState(false);

  // Staged (mobile-only) draft state — committed when Apply is pressed.
  const [draftQuick, setDraftQuick] = useState<Record<string, string>>({});
  const [draftPills, setDraftPills] = useState<Record<string, string>>({});
  const [draftSort, setDraftSort] = useState<string | undefined>(activeSort);
  const [draftOrder, setDraftOrder] = useState<"asc" | "desc">(sortDirection);

  const getDefaultValue = (options: { value: string }[]) =>
    options.find((o) => o.value === "ALL")?.value ?? options[0]?.value ?? "";

  const seedMobileDraft = () => {
    const q: Record<string, string> = {};
    popoverFilters.forEach((g) => (q[g.id] = g.value));
    setDraftQuick(q);
    const p: Record<string, string> = {};
    effectivePillGroups.forEach((g) => (p[g.id] = g.value));
    setDraftPills(p);
    setDraftSort(activeSort);
    setDraftOrder(sortDirection);
  };

  const handleMoreOpenChange = (open: boolean) => {
    if (open && isMobile) seedMobileDraft();
    setMoreOpen(open);
  };

  const commitSort = () => {
    if (!onSortChange || draftSort === undefined || draftSort === "") return;
    const fieldChanged = draftSort !== activeSort;
    const orderChanged = draftOrder !== sortDirection;
    if (!fieldChanged && !orderChanged) return;

    onSortChange(draftSort);
    // If the user only toggled direction on the already-active field, a single
    // `handleSort` call will toggle it correctly. If a new field was selected,
    // handleSort pins 'desc'; re-apply once more to honour a staged 'asc'.
    if (fieldChanged && draftOrder === "asc") {
      onSortChange(draftSort);
    }
  };

  const applyMobileDraft = () => {
    Object.entries(draftPills).forEach(([id, v]) => {
      const g = effectivePillGroups.find((grp) => grp.id === id);
      g?.onChange(v);
    });
    Object.entries(draftQuick).forEach(([id, v]) => {
      const g = popoverFilters.find((grp) => grp.id === id);
      g?.onChange(v);
    });
    commitSort();
    setMoreOpen(false);
  };

  const resetMobileDraft = () => {
    const q: Record<string, string> = {};
    popoverFilters.forEach((g) => (q[g.id] = getDefaultValue(g.options)));
    setDraftQuick(q);
    const p: Record<string, string> = {};
    effectivePillGroups.forEach((g) => (p[g.id] = getDefaultValue(g.options)));
    setDraftPills(p);
    setDraftSort(sortOptions?.[0]?.id ?? activeSort);
    setDraftOrder("desc");
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    activeFilters.length > 0 ||
    Boolean(
      onResetAll &&
        quickFilters.some(
          (q) => q.value && q.value !== "ALL" && q.value !== ""
        )
    );

  const getPillVariantStyles = (
    variant: InlinePillGroup["variant"] = "module",
    isSelected: boolean
  ) => {
    if (!isSelected) {
      return "border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground hover:bg-muted/60";
    }

    switch (variant) {
      case "emerald":
        return "bg-emerald-500 text-white font-bold shadow-xs border border-emerald-500/20";
      case "purple":
        return "bg-purple-600 text-white font-bold shadow-xs border border-purple-600/20";
      case "blue":
        return "bg-blue-600 text-white font-bold shadow-xs border border-blue-600/20";
      case "amber":
        return "bg-amber-500 text-white font-bold shadow-xs border border-amber-500/20";
      case "rose":
        return "bg-rose-500 text-white font-bold shadow-xs border border-rose-500/20";
      case "module":
      default:
        return cn(theme.gradient, "text-white font-bold shadow-xs border-0");
    }
  };

  const renderPillOptions = (
    group: InlinePillGroup,
    valueOverride?: string,
    onSelectOverride?: (value: string) => void
  ) => {
    const value = valueOverride ?? group.value;
    const onSelect = onSelectOverride ?? group.onChange;

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {group.options.map((opt) => {
          const isSelected = value === opt.value;
          const variantClass = getPillVariantStyles(group.variant, isSelected);

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={cn(
                "h-7 px-3 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1 whitespace-nowrap active:scale-95",
                variantClass
              )}
            >
              <span>{opt.label}</span>
              {opt.count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5",
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {opt.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-3.5 px-2 sm:p-4 shadow-2xs space-y-3.5",
        className
      )}
    >
      {/* TOP ROW: Search Bar -> Primary Dropdown -> "More" Popover -> Sort & Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 flex-wrap">
        {/* Left Side: Search Bar & Primary Filter */}
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {/* Search Input */}
          {onSearchChange && (
            <div className="relative flex-1 min-w-0 sm:min-w-[220px] sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 pr-7 h-9 text-sm rounded-full bg-muted/30 hover:bg-muted/50 focus:bg-background border-border/80 shadow-2xs focus-visible:ring-1 focus-visible:ring-muted-foreground/30 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {searchRightActions}

          {/* MORE FILTERS POPOVER */}
          {!minimal &&
            (popoverFilters.length > 0 ||
              (isMobile &&
                (effectivePillGroups.length > 0 ||
                  (sortOptions ? sortOptions.length > 0 : false)))) && (
            <Popover
              open={moreOpen}
              onOpenChange={handleMoreOpenChange}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full sm:w-auto h-9 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-95 text-white",
                    theme.gradient
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-white" />
                  <span>More Filters</span>
                  <ChevronDown className="h-3.5 w-3.5 text-white/80" />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-80 max-w-[calc(100vw-1rem)] p-3.5 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl space-y-3"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
                  <h4 className="text-xs font-bold text-foreground tracking-tight">Filters</h4>
                  <div className="flex items-center gap-2">
                    {isMobile && (
                      <button
                        type="button"
                        onClick={applyMobileDraft}
                        className={cn(
                          "h-7 px-3 rounded-full text-xs font-bold text-white shadow-xs active:scale-95 transition-all cursor-pointer",
                          theme.gradient
                        )}
                      >
                        <span>Apply</span>
                      </button>
                    )}
                    {onResetAll && (
                      <button
                        type="button"
                        onClick={isMobile ? resetMobileDraft : onResetAll}
                        className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* SORT (mobile only — moved to the top) */}
                {!minimal && sortOptions && sortOptions.length > 0 && onSortChange && (
                  <div className="sm:hidden space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                      <span className="font-semibold text-muted-foreground">Sort by:</span>
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {sortOptions.map((s) => {
                          const isSelected = isMobile
                            ? draftSort === s.id
                            : activeSort === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                if (isMobile) {
                                  if (draftSort === s.id) {
                                    setDraftOrder((o) =>
                                      o === "asc" ? "desc" : "asc"
                                    );
                                  } else {
                                    setDraftSort(s.id);
                                    setDraftOrder("desc");
                                  }
                                } else {
                                  onSortChange(s.id);
                                }
                              }}
                              className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap",
                                isSelected
                                  ? cn("text-white font-bold shadow-2xs", theme.gradient)
                                  : "text-muted-foreground hover:text-foreground border border-border/60 bg-background/50"
                              )}
                            >
                              <span>{s.label}</span>
                              {isSelected &&
                                ((isMobile ? draftOrder : sortDirection) ===
                                "asc" ? (
                                  <ArrowUp className="h-3 w-3 text-white" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 text-white" />
                                ))}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* PILL GROUPS (mobile only — inline row is hidden on mobile) */}
                {effectivePillGroups.length > 0 && (
                  <div className="sm:hidden space-y-3">
                    {effectivePillGroups.map((group) => (
                      <div key={group.id} className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                          {group.icon || <Filter className="h-3.5 w-3.5 text-muted-foreground" />}
                          <span className="text-xs">{group.label}:</span>
                        </div>
                        {isMobile
                          ? renderPillOptions(
                              group,
                              draftPills[group.id] ?? group.value,
                              (v) =>
                                setDraftPills((prev) => ({ ...prev, [group.id]: v }))
                            )
                          : renderPillOptions(group)}
                      </div>
                    ))}
                  </div>
                )}

                {/* QUICK FILTERS (dropdowns) — shown on all sizes */}
                <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar pr-0.5">
                  {popoverFilters.map((group) => {
                    const activeValue = isMobile
                      ? draftQuick[group.id] ?? group.value
                      : group.value;
                    const selectedOpt = group.options.find(
                      (o) => o.value === activeValue
                    );
                    const selectedLabel = selectedOpt
                      ? selectedOpt.label
                      : group.label;

                    return (
                      <div key={group.id} className="space-y-1">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 block">
                          {group.label}
                        </span>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "w-full h-9 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shadow-2xs",
                                activeValue && activeValue !== "ALL"
                                  ? cn(theme.badgeColor, "font-bold")
                                  : "border-border/80 bg-muted/30 hover:bg-muted/60 text-foreground"
                              )}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {group.icon}
                                <span className="truncate">{selectedLabel}</span>
                              </div>
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-2" />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="start"
                            className="w-72 rounded-2xl p-1.5 shadow-xl border-border/80 z-[60]"
                          >
                            <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                              {group.label}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-1" />
                            {group.options.map((opt) => {
                              const isSelected = opt.value === activeValue;
                              return (
                                <DropdownMenuItem
                                  key={opt.value}
                                  onClick={() =>
                                    isMobile
                                      ? setDraftQuick((prev) => ({
                                          ...prev,
                                          [group.id]: opt.value,
                                        }))
                                      : group.onChange(opt.value)
                                  }
                                  className={cn(
                                    "text-xs font-medium px-2.5 py-1.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors",
                                    isSelected
                                      ? cn(theme.badgeColor, "font-bold")
                                      : "text-foreground hover:bg-muted/60"
                                  )}
                                >
                                  <span>{opt.label}</span>
                                  {isSelected && (
                                    <Check className={cn("h-3.5 w-3.5", theme.iconColor)} />
                                  )}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>

                {/* MOBILE: CLEAR (staged, full-width) */}
                {isMobile && (
                  <div className="sm:hidden pt-2.5 border-t border-border/50 space-y-2.5">
                    <button
                      type="button"
                      onClick={resetMobileDraft}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Clear all active filters"
                    >
                      <RotateCcw className="h-3 w-3 text-white" />
                      <span>Clear All</span>
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Right Side: Sort Selector & Clear Button (hidden on mobile, shown at sm+) */}
        {!minimal && (
          <div className="hidden sm:flex items-center gap-2 shrink-0 flex-wrap">
          {/* SORT BY SELECTOR (Matches exact reference screenshot layout) */}
          {sortOptions && sortOptions.length > 0 && onSortChange && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-semibold text-muted-foreground hidden sm:inline">Sort by:</span>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {sortOptions.map((s) => {
                  const isSelected = activeSort === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSortChange(s.id)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap",
                        isSelected
                          ? cn("text-white font-bold shadow-2xs", theme.gradient)
                          : "text-muted-foreground hover:text-foreground border border-border/60 bg-background/50"
                      )}
                    >
                      <span>{s.label}</span>
                      {isSelected &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-white" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-white" />
                        ))}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reset / Clear Button */}
          {hasActiveFilters && onResetAll && (
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Clear all active filters"
            >
              <RotateCcw className="h-3 w-3 text-white" />
              <span>Clear</span>
            </button>
          )}

          {extraActions}
        </div>
        )}
      </div>

      {/* SECOND ROW: INLINE PILL FILTER GROUPS (hidden on mobile, shown at sm+) */}
      {!minimal && effectivePillGroups.length > 0 && (
        <div className="hidden sm:block pt-2.5 border-t border-border/50 space-y-2.5">
          {effectivePillGroups.map((group) => (
            <div
              key={group.id}
              className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs"
            >
              {/* Group Title with Funnel Icon */}
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold shrink-0 min-w-[75px]">
                {group.icon || <Filter className="h-3.5 w-3.5 text-muted-foreground" />}
                <span>{group.label}:</span>
              </div>

              {/* Horizontal Pill Track */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-wrap">
                {group.options.map((opt) => {
                  const isSelected = group.value === opt.value;
                  const variantClass = getPillVariantStyles(
                    group.variant,
                    isSelected
                  );

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => group.onChange(opt.value)}
                      className={cn(
                        "h-7 px-3 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1 whitespace-nowrap active:scale-95",
                        variantClass
                      )}
                    >
                      <span>{opt.label}</span>
                      {opt.count !== undefined && (
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5",
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {opt.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* THIRD ROW: ACTIVE FILTER DISMISSIBLE TAGS */}
      {!minimal && (searchQuery || activeFilters.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/40">
          <span className="text-[11px] font-semibold text-muted-foreground">Active:</span>
          {searchQuery && (
            <AppBadge
              size="sm"
              variant="outline"
              className={cn("rounded-full gap-1.5 py-0.5 px-3", theme.badgeColor)}
            >
              <span>Search: "{searchQuery}"</span>
              <button
                type="button"
                onClick={() => onSearchChange?.("")}
                className="hover:text-rose-500 transition-colors ml-0.5 cursor-pointer"
                title="Remove search"
              >
                <X className="h-3 w-3" />
              </button>
            </AppBadge>
          )}

          {activeFilters.map((af) => (
            <AppBadge
              key={af.id}
              size="sm"
              variant="outline"
              className={cn("rounded-full gap-1.5 py-0.5 px-3", theme.badgeColor)}
            >
              <span>{af.label}</span>
              <button
                type="button"
                onClick={af.onRemove}
                className="hover:text-rose-500 transition-colors ml-0.5 cursor-pointer"
                title="Remove filter"
              >
                <X className="h-3 w-3" />
              </button>
            </AppBadge>
          ))}
        </div>
      )}
    </div>
  );
}
