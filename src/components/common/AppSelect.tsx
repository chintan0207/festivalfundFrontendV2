import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface AppSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AppSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: AppSelectOption[];
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
}

export function AppSelect({
  value,
  onChange,
  options,
  label,
  error,
  hint,
  placeholder,
  disabled,
  className,
  containerClassName,
  id,
}: AppSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn("space-y-1.5 sm:space-y-2 w-full", containerClassName)}>
      {label && (
        <Label htmlFor={id} className="text-xs sm:text-sm font-semibold text-foreground">
          {label}
        </Label>
      )}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button
            type="button"
            id={id}
            disabled={disabled}
            className={cn(
              "flex items-center justify-between w-full h-10 sm:h-10.5 rounded-2xl border border-input bg-background/90 px-3.5 text-xs sm:text-sm shadow-sm transition-all cursor-pointer",
              "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              open && "ring-2 ring-primary/30 border-primary",
              error && "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive",
              !selected && placeholder && "text-muted-foreground",
              className,
            )}
          >
            <span className="truncate">{selected ? selected.label : placeholder || "Select..."}</span>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground shrink-0 ml-2 transition-transform", open && "rotate-180")} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[160px] rounded-xl p-1.5 shadow-lg border-border/80 z-50"
        >
          {options.length === 0 && (
            <p className="px-2 py-4 text-xs text-muted-foreground text-center">No options</p>
          )}
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <DropdownMenuItem
                key={opt.value}
                disabled={opt.disabled}
                onSelect={() => {
                  if (!opt.disabled) {
                    onChange?.(opt.value);
                    setOpen(false);
                  }
                }}
                className={cn(
                  "text-xs font-medium px-2.5 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors",
                  isSelected && "bg-accent font-bold text-accent-foreground",
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {error ? (
        <p className="text-[11px] sm:text-xs font-medium text-destructive leading-tight">{error}</p>
      ) : hint ? (
        <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">{hint}</p>
      ) : null}
    </div>
  );
}
