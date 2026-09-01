import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Loader2, Plus, Search, UserRound } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useContributors } from "@/api/contributor/useContributors";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { Contributor } from "@/types/Types";

export interface ContributorSearchPickerProps {
  mode: "existing" | "new";
  value: string;
  onChange: (contributorId: string) => void;
  onChangeMode: (mode: "existing" | "new") => void;
  label?: string;
  error?: string;
}

export function ContributorSearchPicker({
  mode,
  value,
  onChange,
  onChangeMode,
  label,
  error,
}: ContributorSearchPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Contributor | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [panelPos, setPanelPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isKeyboardNavRef = useRef(false);

  const debouncedQuery = useDebounce(query.trim(), 250);

  const { data, isFetching, isPending } = useContributors(
    debouncedQuery
      ? { search: debouncedQuery, limit: 50, isActive: "true" }
      : { limit: 8, isActive: "true" },
    { keepPreviousData: true },
  );

  const suggestions = useMemo(() => data?.contributors ?? [], [data]);

  const hasQuery = query.trim().length > 0;

  // Clamp active index to a valid range for the current suggestion list
  // (+1 virtual slot for the "New contributor" footer when querying)
  const footerCount = hasQuery ? 1 : 0;
  const safeActiveIndex =
    activeIndex >= 0 && activeIndex < suggestions.length + footerCount ? activeIndex : -1;

  const showLoading = isPending || (isFetching && suggestions.length === 0);
  const showEmpty = !showLoading && suggestions.length === 0 && !hasQuery;
  const showNoResults = !showLoading && suggestions.length === 0 && hasQuery;

  // Anchor the portal panel to the input cell, clamped inside the viewport.
  const updatePanelPos = () => {
    const cell = cellRef.current;
    if (!cell) return;
    const rect = cell.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(rect.width, vw - 16);
    const left = Math.min(Math.max(rect.left, 8), Math.max(8, vw - width - 8));
    // Flip upward when there isn't enough room below the input.
    const estimatedHeight = 300;
    const top =
      rect.bottom + 6 + estimatedHeight > vh && rect.top - estimatedHeight > 8
        ? Math.max(8, rect.top - estimatedHeight - 6)
        : rect.bottom + 6;
    setPanelPos({ top, left, width });
  };

  // Close on outside click / Escape (include the portaled panel)
  useEffect(() => {
    if (!open) return;
    updatePanelPos();
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (!target) return;
      if (containerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleScroll = (e: Event) => {
      // Ignore scroll events originating from inside the panel itself
      if (panelRef.current?.contains(e.target as Node)) return;
      updatePanelPos();
    };
    const handleResize = () => updatePanelPos();
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  // Keep highlighted item in view ONLY on keyboard navigation (prevent scrollbar locking on hover/scroll)
  useEffect(() => {
    if (!isKeyboardNavRef.current) return;
    isKeyboardNavRef.current = false;
    if (safeActiveIndex < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${safeActiveIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [safeActiveIndex]);

  const handleSelect = (contributor: Contributor) => {
    setSelected(contributor);
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
    onChange(contributor._id);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery("");
    onChange("");
    setActiveIndex(-1);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      setOpen(true);
    });
  };

  const handleNewContributor = () => {
    setOpen(false);
    onChangeMode("new");
  };

  const handleSearchAgain = () => {
    onChangeMode("existing");
    onChange("");
    setQuery("");
    setSelected(null);
    setActiveIndex(-1);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      setOpen(true);
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const lastIndex = suggestions.length + footerCount - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      isKeyboardNavRef.current = true;
      setActiveIndex((i) => {
        const base = i >= 0 && i < suggestions.length + footerCount ? i : -1;
        return Math.min(base + 1, lastIndex);
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      isKeyboardNavRef.current = true;
      setActiveIndex((i) => {
        const base =
          i >= 0 && i < suggestions.length + footerCount
            ? i
            : suggestions.length + footerCount;
        return Math.max(base - 1, 0);
      });
    } else if (e.key === "Enter") {
      if (safeActiveIndex === suggestions.length && footerCount > 0) {
        e.preventDefault();
        handleNewContributor();
      } else if (safeActiveIndex >= 0 && suggestions[safeActiveIndex]) {
        e.preventDefault();
        handleSelect(suggestions[safeActiveIndex]);
      } else if (hasQuery && suggestions.length === 0 && !isFetching && !isPending) {
        e.preventDefault();
        handleNewContributor();
      }
    }
  };

  return (
    <div ref={containerRef} className="space-y-1.5 sm:space-y-2 w-full">
      {label && (
        <Label className="text-xs sm:text-sm font-semibold text-foreground">
          {label}
        </Label>
      )}

      {mode === "new" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 px-3.5 py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="h-8 w-8 shrink-0 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <UserRound className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground leading-tight">
                  Adding new contributor
                </p>
                <p className="text-2xs text-muted-foreground leading-tight truncate">
                  Fill the details below to save along with this contribution
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSearchAgain}
              className="shrink-0 flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs transition-all hover:bg-muted/60 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Search again
            </button>
          </div>
        </div>
      ) : selected && value ? (
        <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 px-3.5 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="h-8 w-8 shrink-0 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs ring-2 ring-primary/20">
              {selected.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight truncate">
                {selected.name}
              </p>
              <p className="text-2xs text-muted-foreground leading-tight truncate">
                {selected.contributorCode}
                {selected.phoneNumber ? ` · ${selected.phoneNumber}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleClear}
              title="Change contributor"
              className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs transition-all hover:bg-muted/60 cursor-pointer active:scale-95"
            >
              <Search className="h-3.5 w-3.5" />
              Change
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full" ref={cellRef}>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search contributor by name, phone, or code..."
            className={cn(
              "h-9 sm:h-10.5 w-full rounded-2xl border bg-background/90 pl-10 pr-10 text-sm shadow-sm transition-all",
              "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary focus:outline-none",
              open && "ring-2 ring-primary/30 border-primary",
              error &&
                "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive",
            )}
          />
          {isFetching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center pointer-events-none">
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          )}

          {open &&
            panelPos &&
            createPortal(
              <div
                ref={panelRef}
                style={{ top: panelPos.top, left: panelPos.left, width: panelPos.width }}
                className="fixed z-[60] pointer-events-auto rounded-2xl border border-border/80 bg-popover p-1.5 shadow-xl"
              >
                {showLoading && (
                  <p className="px-2.5 py-3 text-xs text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching...
                  </p>
                )}

                {showEmpty && (
                  <p className="px-2.5 py-3 text-xs text-muted-foreground text-center">
                    Type to search contributors
                  </p>
                )}

                {showNoResults && (
                  <div className="space-y-1.5">
                    <p className="px-2.5 py-2 text-xs text-muted-foreground text-center">
                      No contributor found for “{query.trim()}”
                    </p>
                    <button
                      type="button"
                      onClick={handleNewContributor}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-2.5 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      New contributor
                    </button>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div
                    ref={listRef}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    className="max-h-64 overflow-y-auto overscroll-contain touch-pan-y space-y-0.5 pr-0.5 [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent]"
                  >
                    {suggestions.map((c, index) => (
                      <button
                        key={c._id}
                        type="button"
                        data-index={index}
                        onClick={() => handleSelect(c)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          "w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors cursor-pointer",
                          safeActiveIndex === index
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent",
                        )}
                      >
                        <span className="h-7 w-7 shrink-0 rounded-full bg-muted text-muted-foreground font-bold flex items-center justify-center text-2xs">
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-foreground truncate">
                            {c.name}
                          </span>
                          <span className="block text-2xs text-muted-foreground truncate">
                            {c.contributorCode}
                            {c.phoneNumber ? ` · ${c.phoneNumber}` : ""}
                          </span>
                        </span>
                      </button>
                    ))}

                    {hasQuery && (
                      <button
                        type="button"
                        data-index={suggestions.length}
                        onClick={handleNewContributor}
                        onMouseEnter={() => setActiveIndex(suggestions.length)}
                        className={cn(
                          "w-full flex items-center gap-2.5 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-2.5 py-2 text-left transition-colors cursor-pointer",
                          safeActiveIndex === suggestions.length
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-primary/10",
                        )}
                      >
                        <Plus className="h-4 w-4 text-primary shrink-0" />
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold text-primary truncate">
                            New contributor{hasQuery ? ` “${query.trim()}”` : ""}
                          </span>
                        </span>
                      </button>
                    )}

                    {suggestions.length >= 50 && (
                      <p className="px-2.5 py-2 text-2xs text-muted-foreground text-center">
                        Showing top {suggestions.length} matches — refine your search
                      </p>
                    )}
                  </div>
                )}
              </div>,
              document.body,
            )}
        </div>
      )}

      {error ? (
        <p className="text-[11px] sm:text-xs font-medium text-destructive leading-tight">
          {error}
        </p>
      ) : null}
    </div>
  );
}
