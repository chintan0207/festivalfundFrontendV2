import { cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";

export function ContributionsSectionHeading({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  const theme = getModuleTheme("contributors");

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <h2 className="text-sm font-bold text-foreground">Contributions</h2>
      <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-semibold", theme.badgeColor)}>
        {count}
      </span>
    </div>
  );
}
