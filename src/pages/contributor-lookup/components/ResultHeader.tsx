import { CheckCircle2, FileDown, RotateCcw, Users, Building2, CalendarDays, Receipt } from "lucide-react";
import { AppBadge, AppButton, AppCard } from "@/components/common";
import type { PublicLookupSummary } from "@/api/public/publicLookup.service";
import { formatMoney } from "../helpers";
import { StatChip } from "./StatChip";

export function ResultHeader({
  summary,
  maskedPhone,
  onNewSearch,
  onDownloadPdf,
  downloadingPdf,
}: {
  summary: PublicLookupSummary;
  maskedPhone?: string | null;
  onNewSearch: () => void;
  onDownloadPdf: () => void;
  downloadingPdf: boolean;
}) {
  return (
    <AppCard
      className="overflow-visible border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
      contentClassName="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 p-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </span>
          <h2 className="text-base font-bold text-foreground sm:text-lg">Verified contributor group</h2>
          {maskedPhone && (
            <AppBadge size="sm" variant="outline">
              {maskedPhone}
            </AppBadge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AppButton
            type="button"
            variant="outline"
            leftIcon={<FileDown className="h-3.5 w-3.5" />}
            className="h-8 rounded-full text-xs"
            loading={downloadingPdf}
            onClick={onDownloadPdf}
          >
            Download PDF
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            className="h-8 text-xs rounded-full"
            onClick={onNewSearch}
          >
            Change number
          </AppButton>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <StatChip label="People" value={summary.memberCount} className="col-span-2" />
        <StatChip label="Organizations" value={summary.organizationCount} />
        <StatChip label="Festivals" value={summary.festivalCount} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatChip label="Total Contributions" value={summary.totalContributions} />
        <StatChip
          label="Collected"
          value={formatMoney(summary.totalDeposited)}
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <StatChip
          label="Pending"
          value={formatMoney(summary.totalPending)}
          accent="text-amber-600 dark:text-amber-400"
        />
        <StatChip
          label="Cancelled"
          value={formatMoney(summary.totalCancelled)}
          accent="text-rose-600 dark:text-rose-400"
        />
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> {summary.memberCount} contributor record(s)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" /> {summary.organizationCount} organization(s)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" /> {summary.festivalCount} festival(s)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Receipt className="h-3.5 w-3.5" /> {summary.totalContributions} contribution(s)
        </span>
      </div>
    </AppCard>
  );
}