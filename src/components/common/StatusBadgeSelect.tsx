import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AppButton } from "./AppButton";

export interface StatusOption {
  value: string;
  label: string;
}

export interface StatusBadgeSelectProps {
  status: string;
  options: StatusOption[];
  /** Allowed next statuses. When empty (or no onRequestStatus) a plain badge renders. */
  transitions?: string[];
  badgeClass: (status: string) => string;
  labelOf: (status: string) => string;
  onRequestStatus?: (status: string) => void;
  disabled?: boolean;
  align?: "start" | "end";
  size?: "sm" | "md";
  className?: string;
}

/** Status pill that becomes a transition dropdown when options exist. */
export function StatusBadgeSelect({
  status,
  options,
  transitions,
  badgeClass,
  labelOf,
  onRequestStatus,
  disabled,
  align = "end",
  size = "sm",
  className,
}: StatusBadgeSelectProps) {
  const available = (transitions ?? []).filter((t) =>
    options.some((o) => o.value === t),
  );

  if (available.length === 0 || !onRequestStatus) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
          badgeClass(status),
          className,
        )}
      >
        {labelOf(status)}
      </span>
    );
  }

  const sizeClasses =
    size === "md"
      ? "h-auto px-3 py-1.5 text-[11px] sm:text-xs"
      : "h-auto px-2.5 py-1 text-[11px]";

  const triggerOptions = options.filter((o) => available.includes(o.value));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AppButton
          type="button"
          variant="ghost"
          disabled={disabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "rounded-full gap-1 hover:opacity-80 hover:bg-transparent disabled:opacity-60 disabled:cursor-not-allowed",
            sizeClasses,
            badgeClass(status),
            className,
          )}
        >
          {labelOf(status)}
          <ChevronDown className="h-3 w-3" />
        </AppButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-40 rounded-xl p-1.5">
        {triggerOptions.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            disabled={opt.value === status}
            onSelect={(event) => {
              event.stopPropagation();
              onRequestStatus(opt.value);
            }}
            className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", badgeClass(opt.value))} />
              {opt.label}
            </span>
            {opt.value === status && (
              <span className="ml-auto text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}