import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function AppLogo({
  size = "md",
  className,
  showText = true,
}: AppLogoProps) {
  const sizeMap = {
    sm: { badge: "h-7 w-7 rounded-lg text-sm", text: "text-base" },
    md: { badge: "h-9 w-9 rounded-xl text-lg", text: "text-lg" },
    lg: { badge: "h-11 w-11 rounded-2xl text-2xl", text: "text-2xl" },
  };

  const currentSize = sizeMap[size];

  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2.5 hover:opacity-90 transition-opacity select-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:gap-0",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center bg-gradient-to-br from-primary to-emerald-500 text-primary-foreground font-bold shadow-sm",
          currentSize.badge
        )}
      >
        F
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight text-foreground leading-tight group-data-[collapsible=icon]:hidden",
            currentSize.text
          )}
        >
          FestivalFund
        </span>
      )}
    </Link>
  );
}
