import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps {
  children: ReactNode;
  variant?: "list" | "detail";
  className?: string;
}

export function PageContainer({
  children,
  variant = "list",
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "space-y-5 max-w-[1400px] mx-auto px-1 sm:px-0",
        variant === "list" ? "pb-40 md:pb-12" : "pb-28 md:pb-10",
        className,
      )}
    >
      {children}
    </div>
  );
}