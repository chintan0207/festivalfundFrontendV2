import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import type { Contribution, Expense } from "@/lib/data/mockData";

interface ReportChartsProps {
  contributions: Contribution[];
  expenses: Expense[];
  onSelectCategory?: (category: "FOOD" | "DECORATION" | "SERVICES" | "CULTURAL" | "OTHER") => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: "#ef4444", // Red
  DECORATION: "#10b981", // Emerald/Green
  SERVICES: "#f59e0b", // Amber/Orange
  CULTURAL: "#8b5cf6", // Purple
  OTHER: "#6b7280", // Gray
};

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
    if (categoryTotals[exp.category] !== undefined) {
      categoryTotals[exp.category] += exp.amount;
    } else {
      categoryTotals.OTHER += exp.amount;
    }
  });

  const categoryPieData = Object.entries(categoryTotals)
    .filter(([_, val]) => val > 0)
    .map(([cat, val]) => ({
      rawCategory: cat,
      name: CATEGORY_NAMES[cat] || cat,
      value: val,
      color: CATEGORY_COLORS[cat] || "#6b7280",
    }));

  // 2. Prepare Payment Method Data
  const paymentTotals: Record<string, number> = {
    CASH: 0,
    UPI: 0,
  };

  contributions.forEach((c) => {
    const pm = (c.paymentMode || "CASH").toUpperCase();
    if (paymentTotals[pm] !== undefined) {
      paymentTotals[pm] += c.amount;
    } else {
      paymentTotals.CASH += c.amount;
    }
  });

  const paymentData = [
    { name: "Cash", value: paymentTotals.CASH, color: "#10b981" },
    { name: "UPI / QR", value: paymentTotals.UPI, color: "#3b82f6" },
  ].filter((item) => item.value > 0);

  // 3. Prepare Time-series Cash Flow Trend Data (Grouped by Date)
  const dateMap: Record<string, { date: string; income: number; expense: number }> = {};

  contributions.forEach((c) => {
    if (c.status === "DEPOSITED" && c.date) {
      if (!dateMap[c.date]) {
        dateMap[c.date] = { date: c.date, income: 0, expense: 0 };
      }
      dateMap[c.date].income += c.amount;
    }
  });

  expenses.forEach((e) => {
    if (e.date) {
      if (!dateMap[e.date]) {
        dateMap[e.date] = { date: e.date, income: 0, expense: 0 };
      }
      dateMap[e.date].expense += e.amount;
    }
  });

  const timeSeriesData = Object.values(dateMap).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* ROW 1: INCOME VS EXPENSES CASHFLOW TREND AREA CHART */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Income vs Expenses Cash Flow Trend</h3>
            <p className="text-2xs text-muted-foreground">
              Daily collection velocity vs expenditure timeline
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Income
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-rose-500">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Expenses
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          {timeSeriesData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No trend data available for current filters.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" className="text-muted-foreground" tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(val: any) => [`₹${Number(val || 0).toLocaleString("en-IN")}`, ""]}
                />
                <Area type="monotone" dataKey="income" name="Income (₹)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expense" name="Expenses (₹)" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ROW 2: EXPENSE CATEGORY PIE & PAYMENT METHOD BREAKDOWN BAR CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EXPENSE CATEGORY DONUT CHART WITH DRILL-DOWN */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Expense Category Breakdown</h3>
              <p className="text-2xs text-muted-foreground">Click any slice to view filtered details</p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {categoryPieData.length === 0 ? (
              <div className="text-xs text-muted-foreground">No category data recorded.</div>
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
                    onClick={(entry: any) => {
                      if (onSelectCategory && entry && entry.rawCategory) {
                        onSelectCategory(
                          entry.rawCategory as "FOOD" | "DECORATION" | "SERVICES" | "CULTURAL" | "OTHER"
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
                    formatter={(val: any) => [`₹${Number(val || 0).toLocaleString("en-IN")}`, "Spent"]}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* PAYMENT METHOD BREAKDOWN BAR CHART */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Contribution Payment Channels</h3>
            <p className="text-2xs text-muted-foreground">Cash vs Digital UPI collection split</p>
          </div>

          <div className="h-56 w-full pt-2">
            {paymentData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No payment channel data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" className="text-muted-foreground" tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "10px",
                      fontSize: "11px",
                    }}
                    formatter={(val: any) => [`₹${Number(val || 0).toLocaleString("en-IN")}`, "Collected"]}
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
