import { cn } from "@/lib/utils";

export const PRESET_AMOUNTS = [101, 201, 251, 501, 1001] as const;

interface AmountQuickPickProps {
  value: number | string | undefined | null;
  onChange: (amount: number) => void;
  disabled?: boolean;
  className?: string;
}

export function AmountQuickPick({
  value,
  onChange,
  disabled,
  className,
}: AmountQuickPickProps) {
  const numericValue =
    typeof value === "number"
      ? value
      : value !== undefined && value !== null && value !== ""
        ? parseFloat(String(value))
        : null;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="block text-xs font-semibold text-foreground">
        Quick Amount Presets
      </label>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {PRESET_AMOUNTS.map((preset) => {
          const isSelected = numericValue === preset;
          return (
            <button
              key={preset}
              type="button"
              disabled={disabled}
              onClick={() => onChange(preset)}
              aria-pressed={isSelected}
              className={cn(
                "relative rounded-xl border text-center py-2 px-1 sm:px-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-[0.97] flex items-center justify-center min-h-[40px] select-none shrink-0",
                isSelected
                  ? "border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md font-bold ring-1 ring-violet-500/30"
                  : "border-border/80 bg-background/60 text-foreground hover:bg-muted/60 hover:border-border",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <span className="truncate">₹{preset.toLocaleString("en-IN")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

