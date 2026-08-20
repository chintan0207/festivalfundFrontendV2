import { Building2, Calendar, ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppCardButton } from "@/components/common/AppCardButton";
import type { Expense } from "@/types/Types";

export function ExpenseLinkedCards({
  expense,
  onFestivalClick,
}: {
  expense: Expense;
  onFestivalClick?: () => void;
}) {
  const festival =
    typeof expense.festivalId === "object" ? expense.festivalId : undefined;
  const vendorName = expense.vendorName;
  const invoiceNumber = expense.invoiceNumber;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Vendor */}
      <AppCardButton disabled className="hover:border-border/80">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Vendor
        </p>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-r from-rose-500 to-red-600 shrink-0">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground truncate">{vendorName || "—"}</p>
            {invoiceNumber && (
              <p className="font-mono text-[11px] text-muted-foreground">
                {invoiceNumber}
              </p>
            )}
          </div>
        </div>
        {invoiceNumber && (
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
            <FileText className="h-3 w-3 shrink-0" />
            <span className="truncate">Invoice / Voucher {invoiceNumber}</span>
          </div>
        )}
      </AppCardButton>

      {/* Festival */}
      <AppCardButton
        onClick={onFestivalClick}
        disabled={!onFestivalClick || !festival}
        className={cn(onFestivalClick && festival && "hover:border-pink-500/40")}
      >
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Festival
        </p>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-r from-pink-500 to-rose-600 shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground truncate">{festival?.name || "—"}</p>
            {festival?.year && (
              <p className="text-[11px] text-muted-foreground">{festival.year}</p>
            )}
          </div>
        </div>
        {onFestivalClick && festival && (
          <div className="flex items-center gap-0.5 mt-2 text-[11px] font-semibold text-pink-500">
            View festival <ChevronRight className="h-3 w-3" />
          </div>
        )}
      </AppCardButton>
    </div>
  );
}
