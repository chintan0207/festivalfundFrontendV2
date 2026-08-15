import { type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Settings, User } from "lucide-react";
import { useAuthStore } from "@/api/auth/auth.store";
import { useLogout } from "@/api/auth/useAuth";
import { GlobalRoleEnum } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Shared account/profile menu used by both the sidebar footer and the topbar
 * avatar. Holds the same actions (My Account / Organization Settings / Log
 * out) so behaviour never drifts between the two entry points. Width is capped
 * to the viewport so the menu never renders off-screen on small screens; Radix
 * collision detection handles viewport-aware placement.
 */
export function AccountMenu({ trigger }: { trigger: ReactNode }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const logout = useLogout();

  const isAdmin = user?.role === GlobalRoleEnum.ORG_ADMIN;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={6}
        side="bottom"
        align="end"
        className="w-56 p-2 rounded-xl shadow-xl max-w-[calc(100vw-1rem)]"
      >
        <DropdownMenuLabel className="text-xs font-semibold text-foreground px-2 py-1">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={() => navigate({ to: "/dashboard/profile" })}
          className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-2 text-xs"
        >
          <User className="h-4 w-4" />
          <span>My Account</span>
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => navigate({ to: "/dashboard/settings" })}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-2 text-xs"
            >
              <Settings className="h-4 w-4" />
              <span>Organization Settings</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-2 text-xs text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}