import { useState } from "react";
import { ChevronDown, ChevronUp, Download, FileText, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { AppBadge, AppButton } from "@/components/common";
import { categoryBadge, categoryLabel } from "@/lib/categoryMeta";
import {
  canDownloadSlip,
  downloadSlip,
  formatDate,
  formatMoney,
  paymentLabel,
  slipUrl,
  statusBadgeClass,
} from "../helpers";
import type { PublicContribution } from "@/api/public/publicLookup.service";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="truncate font-medium text-foreground">{value}</p>
    </div>
  );
}

export function ContributionRow({
  contribution,
  festivalName,
  organizationName,
}: {
  contribution: PublicContribution;
  festivalName: string;
  organizationName: string;
}) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const isMoney = contribution.type === "MONEY";
  const displayValue = isMoney ? contribution.amount : contribution.estimatedValue;
  const slip = slipUrl(contribution.slipPath);
  const showSlipActions = canDownloadSlip(contribution);

  async function handleDownloadSlip() {
    if (downloading || !slip) return;
    setDownloading(true);
    try {
      await downloadSlip(contribution);
      toast.success("Slip downloaded successfully");
    } catch {
      toast.error("Failed to download slip");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/25">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground">{contribution.contributionCode}</span>
            <AppBadge size="xs" className={statusBadgeClass(contribution.status)}>
              {contribution.status}
            </AppBadge>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{contribution.contributor?.name}</p>
        </div>

        <div className="shrink-0 text-right">
          <p
            className={`text-sm font-bold ${
              isMoney ? "text-primary" : "text-indigo-600 dark:text-indigo-400"
            }`}
          >
            {isMoney ? (
              <span className="inline-flex items-center gap-0.5">
                <IndianRupee className="h-3.5 w-3.5" />
                {formatMoney(displayValue)}
              </span>
            ) : (
              formatMoney(displayValue)
            )}
          </p>
          <p className="text-[11px] text-muted-foreground">{formatDate(contribution.date)}</p>
        </div>

        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="space-y-2.5 border-t border-border/50 px-3.5 py-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted-foreground">Recorded for</span>
            <span className="font-semibold text-foreground">{contribution.contributor?.name || "—"}</span>
            {contribution.contributor?.category && (
              <AppBadge size="xs" className={categoryBadge(contribution.contributor.category)}>
                {categoryLabel(contribution.contributor.category)}
              </AppBadge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-3">
            <Detail label="Type" value={isMoney ? "Money" : "Item"} />
            <Detail label="Payment" value={paymentLabel(contribution.paymentMode)} />
            <Detail label="Date" value={formatDate(contribution.date)} />
            {!isMoney && <Detail label="Item name" value={contribution.itemName || "—"} />}
            {!isMoney && <Detail label="Quantity" value={contribution.quantity ? String(contribution.quantity) : "—"} />}
            {!isMoney && <Detail label="Estimated value" value={formatMoney(contribution.estimatedValue)} />}
            <Detail label="Festival" value={festivalName} />
            <Detail label="Organization" value={organizationName} />
          </div>

          {showSlipActions && (
            <div className="flex flex-wrap justify-end gap-2">
              <AppButton
                type="button"
                variant="outline"
                leftIcon={<FileText className="h-3.5 w-3.5" />}
                className="h-8 rounded-full text-xs"
                onClick={() => window.open(slip!, "_blank", "noopener,noreferrer")}
              >
                View Slip
              </AppButton>
              <AppButton
                type="button"
                variant="outline"
                loading={downloading}
                leftIcon={<Download className="h-3.5 w-3.5" />}
                className="h-8 rounded-full text-xs"
                onClick={handleDownloadSlip}
              >
                Download Slip
              </AppButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}