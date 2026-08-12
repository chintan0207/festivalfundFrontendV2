import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Receipt,
  Users,
  CheckCircle,
  XCircle,
  Wallet,
  Package,
} from "lucide-react";
import { KPICard, KPIGrid } from "@/components/common/KPICard";

interface ReportKpiCardsProps {
  activeTab?: string;
  openingBalance: number;
  totalCollected: number;
  totalSpent: number;
  currentBalance: number;
  pendingAmount: number;
  transactionCount: number;
  contributorCount: number;
  itemContributionsCount?: number;
  pendingExpenseAmount?: number;
  paidExpenseAmount?: number;
  cancelledExpensesCount?: number;
  totalContributorsRegistered?: number;
  parentContributorsCount?: number;
  boyContributorsCount?: number;
  girlContributorsCount?: number;
}

export const ReportKpiCards = ({
  activeTab = "summary",
  openingBalance,
  totalCollected,
  totalSpent,
  currentBalance,
  pendingAmount,
  transactionCount,
  contributorCount,
  itemContributionsCount = 0,
  pendingExpenseAmount = 0,
  paidExpenseAmount = 0,
  cancelledExpensesCount = 0,
  totalContributorsRegistered = 0,
  parentContributorsCount = 0,
  boyContributorsCount = 0,
  girlContributorsCount = 0,
}: ReportKpiCardsProps) => {
  // 1. CONTRIBUTIONS TAB (EXACTLY MATCHES CONTRIBUTION KPIS ON CONTRIBUTIONS PAGE)
  if (activeTab === "contributions") {
    return (
      <KPIGrid columns={4}>
        <KPICard
          label="Deposited"
          value={`₹${totalCollected.toLocaleString("en-IN")}`}
          icon={<CheckCircle className="h-5 w-5" />}
          accent="emerald"
          subtext="Confirmed receipts"
        />
        <KPICard
          label="Pending"
          value={`₹${pendingAmount.toLocaleString("en-IN")}`}
          icon={<Clock className="h-5 w-5" />}
          accent="rose"
          subtext="Awaiting deposit"
        />
        <KPICard
          label="Total Raised"
          value={`₹${(totalCollected + pendingAmount).toLocaleString("en-IN")}`}
          icon={<Wallet className="h-5 w-5" />}
          accent="blue"
          subtext="All contributions"
        />
        <KPICard
          label="Item Contributions"
          value={itemContributionsCount}
          icon={<Package className="h-5 w-5" />}
          accent="amber"
          subtext="In-kind donations"
        />
      </KPIGrid>
    );
  }

  // 2. EXPENSES TAB (EXACTLY MATCHES EXPENSE KPIS ON EXPENSES PAGE)
  if (activeTab === "expenses") {
    return (
      <KPIGrid columns={4}>
        <KPICard
          label="Pending"
          value={`₹${pendingExpenseAmount.toLocaleString("en-IN")}`}
          icon={<Clock className="h-5 w-5" />}
          accent="amber"
          subtext="Records awaiting payment"
        />
        <KPICard
          label="Paid"
          value={`₹${paidExpenseAmount.toLocaleString("en-IN")}`}
          icon={<CheckCircle className="h-5 w-5" />}
          accent="emerald"
          subtext="Counted in festival balance"
        />
        <KPICard
          label="Cancelled"
          value={cancelledExpensesCount}
          icon={<XCircle className="h-5 w-5" />}
          accent="rose"
          subtext="Voided expenses"
        />
        <KPICard
          label="Total Expenses"
          value={`₹${totalSpent.toLocaleString("en-IN")}`}
          icon={<Wallet className="h-5 w-5" />}
          accent="blue"
          subtext="All recorded expenses"
        />
      </KPIGrid>
    );
  }

  // 3. CONTRIBUTORS TAB (EXACTLY MATCHES CONTRIBUTOR KPIS ON CONTRIBUTORS PAGE)
  if (activeTab === "contributors") {
    return (
      <KPIGrid columns={4}>
        <KPICard
          label="Total Donors"
          value={totalContributorsRegistered || contributorCount}
          icon={<Users className="h-5 w-5" />}
          accent="cyan"
          subtext="Registered donors"
        />
        <KPICard
          label="Parents"
          value={parentContributorsCount}
          icon={<Users className="h-5 w-5" />}
          accent="emerald"
          subtext="Head of families"
        />
        <KPICard
          label="Boys & Youth"
          value={boyContributorsCount}
          icon={<Users className="h-5 w-5" />}
          accent="blue"
          subtext="Youth team members"
        />
        <KPICard
          label="Girls & Youth"
          value={girlContributorsCount}
          icon={<Users className="h-5 w-5" />}
          accent="rose"
          subtext="Cultural performers"
        />
      </KPIGrid>
    );
  }

  // 4. FESTIVAL SUMMARY TAB (EXECUTIVE 7 FINANCIAL KPIS)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <KPICard
        label="Opening Bal."
        value={`₹${openingBalance.toLocaleString("en-IN")}`}
        accent="blue"
        icon={<IndianRupee className="h-4 w-4" />}
        subtext="Seed Fund"
      />
      <KPICard
        label="Collected"
        value={`₹${totalCollected.toLocaleString("en-IN")}`}
        accent="emerald"
        icon={<TrendingUp className="h-4 w-4" />}
        subtext="Deposited"
      />
      <KPICard
        label="Total Spent"
        value={`₹${totalSpent.toLocaleString("en-IN")}`}
        accent="rose"
        icon={<TrendingDown className="h-4 w-4" />}
        subtext="Approved Expenses"
      />
      <KPICard
        label="Net Balance"
        value={`₹${currentBalance.toLocaleString("en-IN")}`}
        accent="purple"
        icon={<Activity className="h-4 w-4" />}
        subtext="Available Fund"
      />
      <KPICard
        label="Pending"
        value={`₹${pendingAmount.toLocaleString("en-IN")}`}
        accent="amber"
        icon={<Clock className="h-4 w-4" />}
        subtext="Uncollected Pledges"
      />
      <KPICard
        label="Txn Count"
        value={transactionCount}
        accent="blue"
        icon={<Receipt className="h-4 w-4" />}
        subtext="Receipts & Vouchers"
      />
      <KPICard
        label="Contributors"
        value={contributorCount}
        accent="emerald"
        icon={<Users className="h-4 w-4" />}
        subtext="Active Donors"
        className="col-span-2 sm:col-span-1"
      />
    </div>
  );
};

export default ReportKpiCards;
