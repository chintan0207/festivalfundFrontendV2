import { Fragment, type ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AppButton } from "./AppButton";

export interface RowAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  /** Renders with destructive styling. */
  variant?: "default" | "destructive";
  /** Hide the action entirely when false. */
  show?: boolean;
  /** Render a separator above this action. */
  separatorBefore?: boolean;
  disabled?: boolean;
}

export interface RowActionsMenuProps {
  actions: RowAction[];
  align?: "start" | "end";
  title?: string;
  className?: string;
}

/** Compact "more actions" dropdown used in tables and list cards. */
export function RowActionsMenu({
  actions,
  align = "end",
  title = "More actions",
  className,
}: RowActionsMenuProps) {
  const visible = actions.filter((a) => a.show !== false);

  if (visible.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AppButton
          type="button"
          variant="ghost"
          title={title}
          aria-label={title}
          className={cn(
            "h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            className,
          )}
        >
          <MoreVertical className="h-4 w-4" />
        </AppButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-44 rounded-xl p-1.5">
        {visible.map((action) => (
          <Fragment key={action.key}>
            {action.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              variant={action.variant}
              disabled={action.disabled}
              onSelect={action.onSelect}
              className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}