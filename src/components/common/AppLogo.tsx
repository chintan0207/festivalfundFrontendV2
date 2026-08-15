import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

export function AppLogo({
  size = "md",
  variant = "full",
  className,
}: AppLogoProps) {
  const sizeMap = {
    sm: { image: "h-9 w-9", text: "text-base" },
    md: { image: "h-12 w-12", text: "text-lg" },
    lg: { image: "h-14 w-14", text: "text-2xl" },
  };

  const currentSize = sizeMap[size];

  return (
    <Link
      to="/"
      aria-label="FestivalFund home"
      className={cn(
        "flex items-center gap-1 hover:opacity-90 transition-opacity select-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:gap-0",
        className
      )}
    >
      <img
        src="/festivalfundicon.png"
        alt=""
        className={cn(
          "shrink-0 object-contain group-data-[collapsible=icon]:shrink-0",
          currentSize.image
        )}
      />
      {variant === "full" && (
        <span
          className={cn(
            "font-bold tracking-tight leading-tight whitespace-nowrap gradient-text group-data-[collapsible=icon]:hidden",
            currentSize.text
          )}
        >
          FestivalFund
        </span>
      )}
    </Link>
  );
}