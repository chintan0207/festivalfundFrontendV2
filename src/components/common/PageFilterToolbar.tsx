import { type ReactNode } from "react";
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

  const primaryFilter = quickFilters.length > 0 ? quickFilters[0] : null;
  const popoverFilters = quickFilters;

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

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-3.5 sm:p-4 shadow-2xs space-y-3.5",
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

          {/* Primary Quick Select Dropdown */}
          {!minimal && primaryFilter && (
            <DropdownMenu key={primaryFilter.id}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "h-9 px-3.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs focus:outline-none cursor-pointer",
                    primaryFilter.value &&
                      primaryFilter.value !== "ALL" &&
                      primaryFilter.value !== ""
                      ? cn(theme.badgeColor, "font-bold shadow-xs")
                      : "border-border/80 bg-muted/30 hover:bg-muted/60 text-foreground"
                  )}
                >
                  {primaryFilter.icon}
                  <span className="truncate max-w-[150px]">
                    {primaryFilter.options.find(
                      (o) => o.value === primaryFilter.value
                    )?.label || primaryFilter.label}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-70 shrink-0" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-52 rounded-2xl p-1.5 shadow-lg border-border/80"
              >
                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                  {primaryFilter.label}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                {primaryFilter.options.map((opt) => {
                  const isSelected = opt.value === primaryFilter.value;
                  return (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => primaryFilter.onChange(opt.value)}
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
          )}

          {/* MORE FILTERS POPOVER */}
          {!minimal && popoverFilters.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "h-9 px-4 rounded-full text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-95 text-white",
                    theme.gradient
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-white" />
                  <span>More</span>
                  <ChevronDown className="h-3.5 w-3.5 text-white/80" />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-80 p-3.5 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h4 className="text-xs font-bold text-foreground tracking-tight">Filters</h4>
                  {onResetAll && (
                    <button
                      type="button"
                      onClick={onResetAll}
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar pr-0.5">
                  {popoverFilters.map((group) => {
                    const selectedOpt = group.options.find(
                      (o) => o.value === group.value
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
                                group.value && group.value !== "ALL"
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
                              const isSelected = opt.value === group.value;
                              return (
                                <DropdownMenuItem
                                  key={opt.value}
                                  onClick={() => group.onChange(opt.value)}
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
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Right Side: Sort Selector & Clear Button */}
        {!minimal && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
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

      {/* SECOND ROW: INLINE PILL FILTER GROUPS (Status: [All] [Deposited], Category: [All] [Parents]...) */}
      {!minimal && effectivePillGroups.length > 0 && (
        <div className="pt-2.5 border-t border-border/50 space-y-2.5">
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
