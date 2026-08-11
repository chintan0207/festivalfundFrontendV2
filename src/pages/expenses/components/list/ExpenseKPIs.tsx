import { Clock, CheckCircle, XCircle, Wallet } from "lucide-react";
import { KPICard, KPIGrid } from "@/components/common/KPICard";
import { useExpenseApiStore } from "@/api/expense/expense.store";

const fmt = (value: number) => (value ? `₹${value.toLocaleString("en-IN")}` : "₹0");

export function ExpenseKPIs() {
  const statusCounts = useExpenseApiStore((s) => s.statusCounts);
  const statusAmounts = useExpenseApiStore((s) => s.statusAmounts);

  return (
    <KPIGrid columns={4}>
      <KPICard
        label="Pending"
        value={fmt(statusAmounts?.PENDING ?? 0)}
        icon={<Clock className="h-5 w-5" />}
        accent="amber"
        subtext={`${statusCounts?.PENDING ?? 0} records awaiting payment`}
      />
      <KPICard
        label="Paid"
        value={fmt(statusAmounts?.PAID ?? 0)}
        icon={<CheckCircle className="h-5 w-5" />}
        accent="emerald"
        subtext="Counted in festival balance"
      />
      <KPICard
        label="Cancelled"
        value={statusCounts?.CANCELLED ?? 0}
        icon={<XCircle className="h-5 w-5" />}
        accent="rose"
        subtext="Voided expenses"
      />
      <KPICard
        label="Total Expenses"
        value={fmt(statusAmounts?.total ?? 0)}
        icon={<Wallet className="h-5 w-5" />}
        accent="blue"
        subtext="All recorded expenses"
      />
    </KPIGrid>
  );
}
