import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppButton } from "./AppButton";

export interface ViewToggleButtonProps {
  minimal: boolean;
  onToggle: () => void;
  className?: string;
}

export function ViewToggleButton({
  minimal,
  onToggle,
  className,
}: ViewToggleButtonProps) {
  return (
    <AppButton
      type="button"
      variant="outline"
      onClick={onToggle}
      title={minimal ? "Show full cards" : "Compact list view"}
      className={cn(
        "md:hidden h-9 px-2.5 rounded-full text-xs shadow-2xs shrink-0 whitespace-nowrap",
        className,
      )}
      leftIcon={
        minimal ? (
          <LayoutGrid className="h-3.5 w-3.5" />
        ) : (
          <List className="h-3.5 w-3.5" />
        )
      }
    >
      <span>{minimal ? "Cards" : "Compact"}</span>
    </AppButton>
  );
}