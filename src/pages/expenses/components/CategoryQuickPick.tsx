import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";

export interface CategoryQuickPickOption {
  value: string;
  label: string;
  description?: string;
  Icon?: LucideIcon;
  /** Distinct gradient applied to this chip when selected. Falls back to the module gradient. */
  gradient?: string;
}

interface CategoryQuickPickProps {
  value: string;
  onChange: (value: string) => void;
  options: CategoryQuickPickOption[];
  /** Module gradient applied to the selected chip. Defaults to the expenses gradient. */
  gradient?: string;
  className?: string;
}

/**
 * Radio-style category quick-select chips.
 * Selected chip fills with the module gradient so the user can
 * pick a category directly without opening a dropdown.
 */
export function CategoryQuickPick({
  value,
  onChange,
  options,
  gradient,
  className,
}: CategoryQuickPickProps) {
  const theme = getModuleTheme("expenses");

  return (
    <div className={cn("grid grid-cols-1 min-[380px]:grid-cols-2 gap-2", className)}>
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const Icon = opt.Icon;
        const activeGradient = opt.gradient ?? gradient ?? theme.gradient;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isSelected}
            className={cn(
              "relative rounded-xl border text-left transition-all duration-200 cursor-pointer active:scale-[0.98] p-2.5 flex items-start gap-2.5",
              isSelected
                ? cn(
                    "border-0 text-white shadow-md",
                    activeGradient,
                  )
                : "border-border/80 bg-background/60 hover:bg-muted/60 hover:border-border",
            )}
          >
            {Icon && (
              <span
                className={cn(
                  "h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs",
                  isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block text-xs font-bold leading-tight",
                  isSelected ? "text-white" : "text-foreground",
                )}
              >
                {opt.label}
              </span>
              {opt.description && (
                <span
                  className={cn(
                    "block text-[10px] leading-snug mt-0.5",
                    isSelected ? "text-white/85" : "text-muted-foreground",
                  )}
                >
                  {opt.description}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}