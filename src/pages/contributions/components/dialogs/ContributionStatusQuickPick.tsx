import { Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContributionStatusOption {
  value: "PENDING" | "DEPOSITED";
  label: string;
  description: string;
  Icon: typeof Clock;
  gradient: string;
}

const STATUS_OPTIONS: ContributionStatusOption[] = [
  {
    value: "PENDING",
    label: "Pending",
    description: "Pledged / awaiting deposit",
    Icon: Clock,
    gradient: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
  },
  {
    value: "DEPOSITED",
    label: "Deposited",
    description: "Received & deposited to fund",
    Icon: CheckCircle2,
    gradient: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
  },
];

interface ContributionStatusQuickPickProps {
  value: string;
  onChange: (value: "PENDING" | "DEPOSITED") => void;
  disabled?: boolean;
  className?: string;
}

export function ContributionStatusQuickPick({
  value,
  onChange,
  disabled,
  className,
}: ContributionStatusQuickPickProps) {
  return (
    <div className={cn("grid grid-cols-1 min-[380px]:grid-cols-2 gap-2", className)}>
      {STATUS_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        const Icon = opt.Icon;

        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            aria-pressed={isSelected}
            className={cn(
              "relative rounded-xl border text-left transition-all duration-200 cursor-pointer active:scale-[0.98] p-2.5 flex items-start gap-2.5",
              isSelected
                ? cn("border-0 text-white shadow-md", opt.gradient)
                : "border-border/80 bg-background/60 hover:bg-muted/60 hover:border-border",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <span
              className={cn(
                "h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs mt-0.5",
                isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>

            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block text-xs font-bold leading-tight",
                  isSelected ? "text-white" : "text-foreground",
                )}
              >
                {opt.label}
              </span>
              <span
                className={cn(
                  "block text-[10px] leading-snug mt-0.5 line-clamp-1",
                  isSelected ? "text-white/85" : "text-muted-foreground",
                )}
              >
                {opt.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
