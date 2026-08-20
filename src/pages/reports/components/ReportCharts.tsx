import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import GroupedBarChart, { type GroupedBarRow } from "@/components/charts/GroupedBarChart";
import { chartCategoryColor } from "@/theme/colors";

type ChartContribution = {
  paymentMode?: string;
  status?: string;
  amount?: number;
  date?: string;
};

type ChartExpense = {
  category?: string;
  amount?: number;
  date?: string;
  status?: string;
};

interface ReportChartsProps {
  contributions: ChartContribution[];
  expenses: ChartExpense[];
  openingBalance?: number;
  onSelectCategory?: (
    category: "FOOD" | "DECORATION" | "SERVICES" | "CULTURAL" | "OTHER",
  ) => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  FOOD: "Food & Prasad",
  DECORATION: "Stage & Decoration",
  SERVICES: "Sound & Services",
  CULTURAL: "Cultural Programs",
  OTHER: "Other / Admin",
};

export const ReportCharts = ({
  contributions,
  expenses,
  openingBalance,
  onSelectCategory,
}: ReportChartsProps) => {
  // 1. Prepare Category Pie Data
  const categoryTotals: Record<string, number> = {
    FOOD: 0,
    DECORATION: 0,
    SERVICES: 0,
    CULTURAL: 0,
    OTHER: 0,
  };

  expenses.forEach((exp) => {
    const cat = exp.category && categoryTotals[exp.category] !== undefined ? exp.category : "OTHER";
    categoryTotals[cat] += exp.amount ?? 0;
  });

  const categoryPieData = Object.entries(categoryTotals)
    .filter((entry) => entry[1] > 0)
    .map(([cat, val]) => ({
      rawCategory: cat,
      name: CATEGORY_NAMES[cat] || cat,
      value: val,
      color: chartCategoryColor(cat),
    }));

  // 2. Prepare Payment Method Data
  const paymentTotals: Record<string, number> = {
    CASH: 0,
    UPI: 0,
    BANK_TRANSFER: 0,
    CHEQUE: 0,
    OTHER: 0,
  };

  contributions.forEach((c) => {
    const pm = (c.paymentMode || "OTHER").toUpperCase();
    if (paymentTotals[pm] !== undefined) {
      paymentTotals[pm] += c.amount ?? 0;
    } else {
      paymentTotals.OTHER += c.amount ?? 0;
    }
  });

  const PAYMENT_LABELS: Record<string, string> = {
    CASH: "Cash",
    UPI: "UPI / QR",
    BANK_TRANSFER: "Bank Transfer",
    CHEQUE: "Cheque",
    OTHER: "Other",
  };

  const paymentData = Object.entries(paymentTotals)
    .filter(([, value]) => value > 0)
    .map(([mode, value]) => ({
      name: PAYMENT_LABELS[mode] || mode,
      value,
      color: chartCategoryColor(mode),
    }));

  // 3. Prepare Time-series Cash Flow Trend Data (Grouped by Date)
  const dateMap: Record<string, { date: string; income: number; expense: number }> = {};

  contributions.forEach((c) => {
    if (c.status === "DEPOSITED" && c.date) {
      if (!dateMap[c.date]) {
        dateMap[c.date] = { date: c.date, income: 0, expense: 0 };
      }
      dateMap[c.date].income += c.amount ?? 0;
    }
  });

  expenses.forEach((e) => {
    if (e.date) {
      if (!dateMap[e.date]) {
        dateMap[e.date] = { date: e.date, income: 0, expense: 0 };
      }
      dateMap[e.date].expense += e.amount ?? 0;
    }
  });

  const timeSeriesData: GroupedBarRow[] = Object.values(dateMap).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div className="space-y-6">
      {/* ROW 1: INCOME VS EXPENSES GROUPED BAR CHART */}
      <GroupedBarChart
        rows={timeSeriesData}
        openingBalance={openingBalance}
        title="Income vs Expenses Cash Flow Trend"
        subtitle="Daily collection velocity vs expenditure timeline"
        height={256}
        emptyText="No trend data available for current filters."
      />

      {/* ROW 2: EXPENSE CATEGORY PIE & PAYMENT METHOD BREAKDOWN BAR CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EXPENSE CATEGORY DONUT CHART WITH DRILL-DOWN */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Expense Category Breakdown
              </h3>
              <p className="text-2xs text-muted-foreground">
                Click any slice to view filtered details
              </p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {categoryPieData.length === 0 ? (
              <div className="text-xs text-muted-foreground">
                No category data recorded.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    cursor="pointer"
                    onClick={(data) => {
                      const category = (data as { rawCategory?: string } | undefined)
                        ?.rawCategory;
                      if (onSelectCategory && category) {
                        onSelectCategory(
                          category as
                            | "FOOD"
                            | "DECORATION"
                            | "SERVICES"
                            | "CULTURAL"
                            | "OTHER",
                        );
                      }
                    }}
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "10px",
                      fontSize: "11px",
                    }}
                    formatter={(value) => [
                      `₹${Number(value ?? 0).toLocaleString("en-IN")}`,
                      "Spent",
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* PAYMENT METHOD BREAKDOWN BAR CHART */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Contribution Payment Channels
            </h3>
            <p className="text-2xs text-muted-foreground">
              Cash vs Digital UPI collection split
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            {paymentData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No payment channel data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={paymentData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    className="text-border/40"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="currentColor"
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    stroke="currentColor"
                    className="text-muted-foreground"
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "10px",
                      fontSize: "11px",
                    }}
                    formatter={(value) => [
                      `₹${Number(value ?? 0).toLocaleString("en-IN")}`,
                      "Collected",
                    ]}
                  />
                  <Bar dataKey="value" name="Amount (₹)" radius={[6, 6, 0, 0]}>
                    {paymentData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCharts;
