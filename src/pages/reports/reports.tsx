import { useState } from "react";
import { useFestivalStore } from "@/store/festivalStore";
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Utensils,
  Sparkles,
  Tent,
  Volume2,
  Package,
  Calculator,
  Users,
  FileBox,
} from "lucide-react";

export const ReportsPage = () => {
  const { activeFestivalId, festivals, contributions, expenses } = useFestivalStore();
  const [activeTab, setActiveTab] = useState<"summary" | "contributions" | "expenses" | "contributors">("summary");

  const activeFest = festivals.find((f) => f.id === activeFestivalId) || festivals[0];

  const currentContributions = contributions.filter(
    (c) => activeFestivalId === "ALL" || c.festivalId === activeFestivalId,
  );

  const currentExpenses = expenses.filter(
    (e) => activeFestivalId === "ALL" || e.festivalId === activeFestivalId,
  );

  const openingBalance = activeFest?.stats?.openingBalance || 25000;
  const totalCollected = currentContributions.reduce((acc, c) => acc + (c.status === "DEPOSITED" ? c.amount : 0), 0);
  const pendingAmount = currentContributions.reduce((acc, c) => acc + (c.status === "PENDING" ? c.amount : 0), 0);
  const totalSpent = currentExpenses.reduce((acc, e) => acc + e.amount, 0);
  const currentBalance = openingBalance + totalCollected - totalSpent;

  // Expense breakdown totals matching image4
  const mahaprasadTotal = currentExpenses
    .filter((e) => e.category === "MAHAPRASAD")
    .reduce((acc, e) => acc + e.amount, 0);
  const decorationTotal = currentExpenses
    .filter((e) => e.category === "DECORATION")
    .reduce((acc, e) => acc + e.amount, 0);
  const mandapTotal = currentExpenses
    .filter((e) => e.category === "MANDAP")
    .reduce((acc, e) => acc + e.amount, 0);
  const soundTotal = currentExpenses
    .filter((e) => e.category === "SOUND")
    .reduce((acc, e) => acc + e.amount, 0);
  const otherTotal = currentExpenses
    .filter((e) => e.category === "OTHER")
    .reduce((acc, e) => acc + e.amount, 0);

  const handleExportComplete = () => {
    alert(`Exporting Complete Financial Report for ${activeFest?.name}...`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER WITH ORANGE GRADIENT BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Comprehensive festival financial reports with export functionality
          </p>
        </div>

        <button
          onClick={handleExportComplete}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Export Complete Report</span>
        </button>
      </div>

      {/* REPORT TYPE TABS BAR MATCHING IMAGE 4 */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
        <p className="text-2xs font-semibold text-muted-foreground">Choose Report Type</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Festival Summary */}
          <button
            onClick={() => setActiveTab("summary")}
            className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "summary"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-card text-foreground border-border hover:bg-muted"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Festival Summary</span>
          </button>

          {/* 2. Contributions Report */}
          <button
            onClick={() => setActiveTab("contributions")}
            className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "contributions"
                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                : "bg-card text-foreground border-border hover:bg-muted"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Contributions Report</span>
          </button>

          {/* 3. Expenses Report */}
          <button
            onClick={() => setActiveTab("expenses")}
            className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "expenses"
                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                : "bg-card text-foreground border-border hover:bg-muted"
            }`}
          >
            <TrendingDown className="h-4 w-4" />
            <span>Expenses Report</span>
          </button>

          {/* 4. Contributors Report */}
          <button
            onClick={() => setActiveTab("contributors")}
            className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "contributors"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-card text-foreground border-border hover:bg-muted"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Contributors Report</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: FESTIVAL SUMMARY VIEW MATCHING IMAGE 4 */}
      {activeTab === "summary" && (
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-foreground">Festival Summary</h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-foreground">{activeFest?.name}</p>
              <p className="text-2xs text-muted-foreground">{activeFest?.year}</p>
            </div>
          </div>

          {/* 5 STAT CARDS ROW */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Opening Balance */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                ₹
              </div>
              <div>
                <p className="text-2xs text-muted-foreground font-medium">Opening Balance</p>
                <p className="text-sm font-bold text-foreground">
                  ₹{openingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Total Collected */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground font-medium">Total Collected</p>
                <p className="text-sm font-bold text-foreground">
                  ₹{totalCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Total Spent */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 font-bold">
                <TrendingDown className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground font-medium">Total Spent</p>
                <p className="text-sm font-bold text-foreground">
                  ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Current Balance */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground font-medium">Current Balance</p>
                <p className="text-sm font-bold text-foreground">
                  ₹{currentBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Pending Amount */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3 col-span-2 lg:col-span-1">
              <div className="h-9 w-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground font-medium">Pending Amount</p>
                <p className="text-sm font-bold text-foreground">
                  ₹{pendingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* CATEGORY BREAKDOWN LIST */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                  <Utensils className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Mahaprasad</p>
                  <p className="text-[10px] text-muted-foreground">Food & Prasad expenses</p>
                </div>
              </div>
              <p className="font-bold text-foreground">
                ₹{mahaprasadTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Decoration</p>
                  <p className="text-[10px] text-muted-foreground">Stage & Lighting</p>
                </div>
              </div>
              <p className="font-bold text-foreground">
                ₹{decorationTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs">
                  <Tent className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Mandap</p>
                  <p className="text-[10px] text-muted-foreground">Stage & Mandap setup</p>
                </div>
              </div>
              <p className="font-bold text-foreground">
                ₹{mandapTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-rose-500 text-white flex items-center justify-center text-xs">
                  <Volume2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Sound</p>
                  <p className="text-[10px] text-muted-foreground">Audio arrangements</p>
                </div>
              </div>
              <p className="font-bold text-foreground">
                ₹{soundTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs">
                  <Package className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Other</p>
                  <p className="text-[10px] text-muted-foreground">Miscellaneous</p>
                </div>
              </div>
              <p className="font-bold text-foreground">
                ₹{otherTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/60 border border-border/80 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-slate-700 text-white flex items-center justify-center text-xs">
                  <Calculator className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Total</p>
                  <p className="text-[10px] text-muted-foreground">Overall Expenses</p>
                </div>
              </div>
              <p className="font-bold text-foreground">
                ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: CONTRIBUTIONS REPORT MATCHING IMAGE 5 */}
      {activeTab === "contributions" && (
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 text-purple-600">
              <TrendingUp className="h-5 w-5" />
              <h2 className="text-base font-bold text-foreground">Detailed Contributions Report</h2>
            </div>

            <button
              onClick={() => alert("Exporting Contributions CSV...")}
              className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>
          </div>

          <div className="rounded-xl border border-border/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-2xs font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Contributor</th>
                  <th className="px-4 py-3">Amount / Item</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {currentContributions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      <FileBox className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                      No contributions found.
                    </td>
                  </tr>
                ) : (
                  currentContributions.map((cnt) => (
                    <tr key={cnt.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-bold text-foreground">
                        {cnt.contributorName}
                        <p className="text-2xs font-normal text-muted-foreground">
                          {cnt.receiptNo}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-600">
                        ₹{cnt.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{cnt.date}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                          {cnt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: EXPENSES REPORT */}
      {activeTab === "expenses" && (
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 text-rose-500">
              <TrendingDown className="h-5 w-5" />
              <h2 className="text-base font-bold text-foreground">Detailed Expenses Report</h2>
            </div>

            <button
              onClick={() => alert("Exporting Expenses CSV...")}
              className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>
          </div>

          <div className="rounded-xl border border-border/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-2xs font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Voucher #</th>
                  <th className="px-4 py-3">Title & Vendor</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {currentExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono font-bold text-rose-500">
                      {exp.voucherNo}
                    </td>
                    <td className="px-4 py-3 font-bold text-foreground">
                      {exp.title}
                      <p className="text-2xs font-normal text-muted-foreground">
                        Paid to: {exp.paidTo}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{exp.category}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-foreground">
                      ₹{exp.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: CONTRIBUTORS REPORT */}
      {activeTab === "contributors" && (
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <Users className="h-5 w-5" />
              <h2 className="text-base font-bold text-foreground">Contributors Summary Report</h2>
            </div>

            <button
              onClick={() => alert("Exporting Contributors CSV...")}
              className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 text-xs text-muted-foreground">
            Total {currentContributions.length} contributions recorded for active festival context.
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
