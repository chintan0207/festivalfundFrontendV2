import { type ReactNode } from "react";
import {
  Search,
  X,
  ChevronDown,
  Check,
  RotateCcw,
  SlidersHorizontal,
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

  // Tabs
  tabs?: FilterTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;

  // Quick Select & Dropdown Filters
  quickFilters?: QuickFilterGroup[];

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
  tabs,
  activeTab,
  onTabChange,
  quickFilters = [],
  activeFilters = [],
  onResetAll,
  extraActions,
  className,
}: PageFilterToolbarProps) {
  const theme = getModuleTheme(module);

  // First filter group is displayed directly outside as primary quick filter
  const primaryFilter = quickFilters.length > 0 ? quickFilters[0] : null;
  // All filter groups (including Category, Year, Location, etc.) are available inside the "More" popover panel
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

  return (
    <div className={cn("space-y-3 pb-2", className)}>
      {/* TOP ROW: Search Bar -> Primary Dropdown -> "More" Popover */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 flex-wrap">
        {/* Left Side: Search Bar & Primary Filter */}
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {/* Search Input */}
          {onSearchChange && (
            <div className="relative flex-1 min-w-[220px] sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 pr-7 h-9 text-xs rounded-full bg-muted/40 hover:bg-muted/60 focus:bg-background border-border/80 shadow-2xs focus-visible:ring-1 focus-visible:ring-muted-foreground/30 transition-colors"
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

          {/* Primary Quick Select Dropdown (Outside More) */}
          {primaryFilter && (
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
                      : "border-border/80 bg-muted/40 hover:bg-muted/70 text-foreground"
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

          {/* MORE FILTERS POPOVER (Includes all filter groups: Category, Year, Location, etc.) */}
          {popoverFilters.length > 0 && (
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
                {/* Popover Header */}
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

                {/* All Filter Dropdowns inside More Popover */}
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
                                  : "border-border/80 bg-muted/40 hover:bg-muted/70 text-foreground"
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

        {/* Right Side: Extra Actions */}
        {extraActions && (
          <div className="flex items-center gap-2 shrink-0">{extraActions}</div>
        )}
      </div>

      {/* ACTIVE FILTER PILLS & RESET BUTTON ROW WITH MODULE THEME */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap pt-1 animate-in fade-in-50 duration-200">
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

          {onResetAll && (
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset filter</span>
            </button>
          )}
        </div>
      )}

      {/* STATUS NAVIGATION TABS ROW WITH MODULE THEME ACCENT */}
      {tabs && tabs.length > 0 && (
        <div className="border-b border-border/60 pb-1.5 pt-1">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange?.(tab.id)}
                  className={cn(
                    "relative pb-2 text-xs font-semibold transition-all whitespace-nowrap focus:outline-none flex items-center gap-1.5 cursor-pointer",
                    isActive
                      ? cn("font-bold text-foreground", theme.iconColor)
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded-full text-[10px] font-bold transition-colors",
                        isActive
                          ? cn(theme.badgeColor)
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      ({tab.count})
                    </span>
                  )}

                  {/* Active Tab Underline Indicator in Module Theme Gradient */}
                  {isActive && (
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 right-0 h-0.5 rounded-full animate-in fade-in-50 duration-200",
                        theme.gradient
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
