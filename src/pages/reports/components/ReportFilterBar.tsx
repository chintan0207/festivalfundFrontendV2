import { useState } from "react";
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Festival, Contributor } from "@/lib/data/mockData";

export interface ReportFilterState {
  festivalId: string | "ALL";
  datePreset: "ALL" | "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "CUSTOM";
  startDate: string;
  endDate: string;
  status: "ALL" | "DEPOSITED" | "PENDING" | "REJECTED";
  category: "ALL" | "FOOD" | "DECORATION" | "SERVICES" | "CULTURAL" | "OTHER";
  contributorId: string | "ALL";
  searchQuery: string;
  minAmount: string;
  maxAmount: string;
}

interface ReportFilterBarProps {
  filters: ReportFilterState;
  onFilterChange: (updates: Partial<ReportFilterState>) => void;
  onResetFilters: () => void;
  festivals: Festival[];
  contributors: Contributor[];
}

export const ReportFilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
  festivals,
  contributors,
}: ReportFilterBarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFilterCount = [
    filters.festivalId !== "fest-1" && filters.festivalId !== "ALL",
    filters.datePreset !== "ALL",
    filters.status !== "ALL",
    filters.category !== "ALL",
    filters.contributorId !== "ALL",
    filters.searchQuery.trim() !== "",
    filters.minAmount !== "",
    filters.maxAmount !== "",
  ].filter(Boolean).length;

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-xs p-4 space-y-4">
      {/* TOP ROW: SEARCH & QUICK CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contributor, receipt #, voucher #, description..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Mobile Expand Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="sm:hidden px-3 py-2 rounded-xl border border-border bg-muted/40 text-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-extrabold">
                {activeFilterCount}
              </span>
            )}
            {isMobileOpen ? (
              <ChevronUp className="h-3.5 w-3.5 ml-0.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 ml-0.5" />
            )}
          </button>

          {/* Advanced toggle button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="hidden sm:inline-flex px-3 py-2 rounded-xl border border-border/80 bg-background hover:bg-muted text-foreground text-xs font-bold items-center gap-1.5 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            <span>{showAdvanced ? "Hide Filters" : "More Filters"}</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Reset button */}
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTER CONTROLS GRID - RESPONSIVE (Always visible on Desktop, collapsible on Mobile) */}
      <div
        className={`${
          isMobileOpen ? "block" : "hidden sm:block"
        } space-y-3 pt-2 border-t border-border/60 transition-all`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Festival Context */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              Festival Context
            </label>
            <select
              value={filters.festivalId}
              onChange={(e) => onFilterChange({ festivalId: e.target.value })}
              className="w-full py-2 px-3 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/50"
            >
              <option value="ALL">All Festivals</option>
              {festivals.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.year})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Date Presets */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              Date Range
            </label>
            <select
              value={filters.datePreset}
              onChange={(e) =>
                onFilterChange({
                  datePreset: e.target.value as ReportFilterState["datePreset"],
                })
              }
              className="w-full py-2 px-3 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/50"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="CUSTOM">Custom Date Range</option>
            </select>
          </div>

          {/* 3. Transaction Status */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              Payment Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                onFilterChange({
                  status: e.target.value as ReportFilterState["status"],
                })
              }
              className="w-full py-2 px-3 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/50"
            >
              <option value="ALL">All Statuses</option>
              <option value="DEPOSITED">Deposited / Verified</option>
              <option value="PENDING">Pending Collection</option>
              <option value="REJECTED">Rejected / Cancelled</option>
            </select>
          </div>

          {/* 4. Expense Category */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                onFilterChange({
                  category: e.target.value as ReportFilterState["category"],
                })
              }
              className="w-full py-2 px-3 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/50"
            >
              <option value="ALL">All Categories</option>
              <option value="FOOD">Food & Prasad</option>
              <option value="DECORATION">Stage & Lighting Décor</option>
              <option value="SERVICES">Sound & Hired Services</option>
              <option value="CULTURAL">Cultural Programs</option>
              <option value="OTHER">Other / Admin</option>
            </select>
          </div>
        </div>

        {/* ADVANCED FILTER PANEL (CUSTOM DATES, CONTRIBUTOR SELECT, MIN/MAX AMOUNT) */}
        {(showAdvanced || filters.datePreset === "CUSTOM") && (
          <div className="pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-muted/20 p-3 rounded-xl">
            {/* Custom Start Date */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange({ startDate: e.target.value })}
                className="w-full py-1.5 px-2.5 rounded-lg border border-input bg-background text-foreground text-xs"
              />
            </div>

            {/* Custom End Date */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange({ endDate: e.target.value })}
                className="w-full py-1.5 px-2.5 rounded-lg border border-input bg-background text-foreground text-xs"
              />
            </div>

            {/* Specific Contributor */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                Specific Contributor
              </label>
              <select
                value={filters.contributorId}
                onChange={(e) => onFilterChange({ contributorId: e.target.value })}
                className="w-full py-1.5 px-2.5 rounded-lg border border-input bg-background text-foreground text-xs"
              >
                <option value="ALL">All Contributors</option>
                {contributors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.contributorCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Min / Max Amount */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                Amount Range (₹)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={filters.minAmount}
                  onChange={(e) => onFilterChange({ minAmount: e.target.value })}
                  className="w-1/2 py-1 px-2 rounded-lg border border-input bg-background text-xs"
                />
                <span className="text-muted-foreground text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={filters.maxAmount}
                  onChange={(e) => onFilterChange({ maxAmount: e.target.value })}
                  className="w-1/2 py-1 px-2 rounded-lg border border-input bg-background text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFilterBar;
