import {
  Wallet,
  ArrowDownLeft,
  Clock,
  XCircle,
  ReceiptText,
  Target,
} from "lucide-react";
import { AppCard } from "@/components/common/AppCard";
import type { DashboardData } from "@/api/dashboard/dashboard.service";
import { formatINR } from "../lib/dashboardFormat";

interface DashboardCollectionStatusProps {
  data: DashboardData;
}

function StatusRow({
  icon,
  colorClass,
  label,
  amount,
  count,
}: {
  icon: React.ReactNode;
  colorClass: string;
  label: string;
  amount: number;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-foreground tabular-nums leading-tight">
          {formatINR(amount)}
        </p>
      </div>
      <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
        {count} record{count === 1 ? "" : "s"}
      </span>
    </div>
  );
}

export function DashboardCollectionStatus({ data }: DashboardCollectionStatusProps) {
  const { festival, stats } = data;
  const st = data.contributions.statusCounts;
  const exp = data.expenses.statusCounts;

  const deposited = st.DEPOSITED.total || 0;
  const pending = st.PENDING.total || 0;
  const cancelled = st.CANCELLED.total || 0;
  const total = deposited + pending + cancelled;

  const depositedPct = total > 0 ? Math.round((deposited / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;

  const target = festival.targetAmount || 0;
  const collected = stats.totalCollected || 0;
  const progressPct =
    target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;

  return (
    <AppCard
      icon={<Wallet className="h-4 w-4" />}
      title="Collection Status"
      subtitle="Where money stands right now"
      compact
      className="flex h-full flex-col"
    >
      <div className="space-y-3">
        {/* Target / collected / percentage */}
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Target className="h-3.5 w-3.5" />
              {target > 0 ? "Collection Progress" : "Total Collected"}
            </span>
            <span className="tabular-nums font-bold text-foreground">
              {formatINR(collected)}
            </span>
          </div>
          {target > 0 ? (
            <>
              <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="tabular-nums">Target {formatINR(target)}</span>
                <span className="tabular-nums font-semibold text-foreground">
                  {progressPct}%
                </span>
              </div>
            </>
          ) : (
            <p className="text-[10px] text-muted-foreground">
              No target set for this festival.
            </p>
          )}
        </div>

        <StatusRow
          icon={<ArrowDownLeft className="h-3.5 w-3.5" />}
          colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          label="Deposited (available)"
          amount={deposited}
          count={st.DEPOSITED.count}
        />
        <StatusRow
          icon={<Clock className="h-3.5 w-3.5" />}
          colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          label="Pending (receivable)"
          amount={pending}
          count={st.PENDING.count}
        />
        <StatusRow
          icon={<XCircle className="h-3.5 w-3.5" />}
          colorClass="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          label="Cancelled"
          amount={cancelled}
          count={st.CANCELLED.count}
        />

        {total > 0 && (
          <div className="h-2 w-full rounded-full overflow-hidden flex bg-muted/60">
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${depositedPct}%` }}
              title={`Deposited ${depositedPct}%`}
            />
            <div
              className="h-full bg-amber-500 transition-all duration-700"
              style={{ width: `${pendingPct}%` }}
              title={`Pending ${pendingPct}%`}
            />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 space-y-3">
        <StatusRow
          icon={<ReceiptText className="h-3.5 w-3.5" />}
          colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          label="Pending expenses (payable)"
          amount={exp.PENDING.total || 0}
          count={exp.PENDING.count}
        />
      </div>
    </AppCard>
  );
}