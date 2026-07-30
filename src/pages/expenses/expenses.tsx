import { useState } from "react";
import { useFestivalStore } from "@/store/festivalStore";
import { AppButton } from "@/components/common/AppButton";
import { AppSelect } from "@/components/common/AppSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Utensils,
  Sparkles,
  Tent,
  Volume2,
  Package,
  Calculator,
  Filter,
  Receipt,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export const ExpensesPage = () => {
  const { expenses, festivals, activeFestivalId, addExpense } = useFestivalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [targetFestId, setTargetFestId] = useState(
    activeFestivalId === "ALL" ? "fest-1" : activeFestivalId,
  );
  const [title, setTitle] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [amount, setAmount] = useState(10000);
  const [category, setCategory] = useState<"MAHAPRASAD" | "DECORATION" | "MANDAP" | "SOUND" | "OTHER">("MANDAP");
  const [paymentMode, setPaymentMode] = useState<"UPI" | "CASH">("UPI");
  const [notes, setNotes] = useState("");

  // Category totals matching backend enum values & image3
  const currentExpenses = expenses.filter(
    (e) => activeFestivalId === "ALL" || e.festivalId === activeFestivalId,
  );

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

  const grandTotal =
    mahaprasadTotal + decorationTotal + mandapTotal + soundTotal + otherTotal;

  // Filtered expense list
  const filteredExpenses = currentExpenses.filter((exp) => {
    const matchesCategory = categoryFilter === "ALL" || exp.category === categoryFilter;
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.paidTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.voucherNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    addExpense({
      festivalId: targetFestId,
      title,
      category,
      amount: Number(amount),
      paidTo: paidTo || "General Vendor",
      paymentMode,
      status: "Paid",
      notes: notes || "Festival expense payout",
    });

    setTitle("");
    setPaidTo("");
    setNotes("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Expenses
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track and manage festival expenses
          </p>
        </div>

        {/* ADD EXPENSE PINK/ROSE GRADIENT BUTTON */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                  <Receipt className="h-5 w-5 text-rose-500" />
                  Add Vendor Expense
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Record voucher payment & vendor details.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                <AppSelect
                  id="festTarget"
                  label="Select Festival"
                  value={targetFestId}
                  onChange={(val) => setTargetFestId(val)}
                  options={festivals.map((f) => ({ value: f.id, label: `${f.name} (${f.year})` }))}
                />

                <div className="grid gap-1.5">
                  <Label htmlFor="title">Expense Description / Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Mandap Construction"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <AppSelect
                    id="cat"
                    label="Category"
                    value={category}
                    onChange={(val) => setCategory(val as any)}
                    options={[
                      { value: "MAHAPRASAD", label: "Mahaprasad" },
                      { value: "DECORATION", label: "Decoration" },
                      { value: "MANDAP", label: "Mandap" },
                      { value: "SOUND", label: "Sound" },
                      { value: "OTHER", label: "Other" },
                    ]}
                  />

                  <div className="grid gap-1.5">
                    <Label htmlFor="amt">Amount (₹)</Label>
                    <Input
                      id="amt"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="paidTo">Paid To (Vendor)</Label>
                    <Input
                      id="paidTo"
                      placeholder="e.g. Shree Ram Decorators"
                      value={paidTo}
                      onChange={(e) => setPaidTo(e.target.value)}
                    />
                  </div>

                  <AppSelect
                    id="pMode"
                    label="Payment Mode"
                    value={paymentMode}
                    onChange={(val) => setPaymentMode(val as any)}
                    options={[
                      { value: "UPI", label: "UPI" },
                      { value: "CASH", label: "Cash" },
                    ]}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="notes">Voucher Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Invoice or reference note..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <AppButton type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </AppButton>
                <AppButton type="submit" className="bg-rose-500 hover:bg-rose-600 text-white">
                  Save Expense
                </AppButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* CATEGORY BREAKDOWN LIST CARDS MATCHING IMAGE 3 */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
        {/* 1. Mahaprasad */}
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors border border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Mahaprasad</p>
              <p className="text-2xs text-muted-foreground">Food & Prasad expenses</p>
            </div>
          </div>
          <p className="text-base font-extrabold text-foreground tracking-tight">
            ₹{mahaprasadTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* 2. Decoration */}
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors border border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Decoration</p>
              <p className="text-2xs text-muted-foreground">Stage & Lighting</p>
            </div>
          </div>
          <p className="text-base font-extrabold text-foreground tracking-tight">
            ₹{decorationTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* 3. Mandap */}
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors border border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Tent className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Mandap</p>
              <p className="text-2xs text-muted-foreground">Stage & Mandap setup</p>
            </div>
          </div>
          <p className="text-base font-extrabold text-foreground tracking-tight">
            ₹{mandapTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* 4. Sound */}
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors border border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Sound</p>
              <p className="text-2xs text-muted-foreground">Audio arrangements</p>
            </div>
          </div>
          <p className="text-base font-extrabold text-foreground tracking-tight">
            ₹{soundTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* 5. Other */}
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors border border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Other</p>
              <p className="text-2xs text-muted-foreground">Miscellaneous</p>
            </div>
          </div>
          <p className="text-base font-extrabold text-foreground tracking-tight">
            ₹{otherTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* 6. Total Overall Expenses */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Total</p>
              <p className="text-2xs text-muted-foreground">Overall Expenses</p>
            </div>
          </div>
          <p className="text-lg font-extrabold text-foreground tracking-tight">
            ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* SEARCH BAR MATCHING IMAGE 3 */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-full bg-card border border-border/80 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-rose-500/30 transition-all shadow-xs"
        />
      </div>

      {/* CATEGORY FILTER PILLS MATCHING IMAGE 3 */}
      <div className="flex items-center gap-1.5 flex-wrap p-4 rounded-2xl bg-card border border-border/80 shadow-xs text-xs">
        <span className="flex items-center gap-1 text-2xs font-semibold text-muted-foreground mr-1">
          <Filter className="h-3.5 w-3.5" /> Category:
        </span>
        <button
          onClick={() => setCategoryFilter("ALL")}
          className={`px-3.5 py-1 rounded-full font-medium transition-all ${
            categoryFilter === "ALL"
              ? "bg-rose-500 text-white shadow-xs"
              : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setCategoryFilter("MAHAPRASAD")}
          className={`px-3.5 py-1 rounded-full font-medium transition-all ${
            categoryFilter === "MAHAPRASAD"
              ? "bg-rose-500 text-white shadow-xs"
              : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          }`}
        >
          Mahaprasad
        </button>
        <button
          onClick={() => setCategoryFilter("DECORATION")}
          className={`px-3.5 py-1 rounded-full font-medium transition-all ${
            categoryFilter === "DECORATION"
              ? "bg-rose-500 text-white shadow-xs"
              : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          }`}
        >
          Decoration
        </button>
        <button
          onClick={() => setCategoryFilter("MANDAP")}
          className={`px-3.5 py-1 rounded-full font-medium transition-all ${
            categoryFilter === "MANDAP"
              ? "bg-rose-500 text-white shadow-xs"
              : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          }`}
        >
          Mandap
        </button>
        <button
          onClick={() => setCategoryFilter("SOUND")}
          className={`px-3.5 py-1 rounded-full font-medium transition-all ${
            categoryFilter === "SOUND"
              ? "bg-rose-500 text-white shadow-xs"
              : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          }`}
        >
          Sound
        </button>
        <button
          onClick={() => setCategoryFilter("OTHER")}
          className={`px-3.5 py-1 rounded-full font-medium transition-all ${
            categoryFilter === "OTHER"
              ? "bg-rose-500 text-white shadow-xs"
              : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          }`}
        >
          Other
        </button>
      </div>

      {/* DETAILED EXPENSES VOUCHERS LIST TABLE */}
      <div className="rounded-2xl bg-card border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/80 text-2xs font-bold text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Voucher No</th>
                <th className="px-4 py-3">Title & Payee</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-rose-500">
                    {exp.voucherNo}
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">
                    {exp.title}
                    <p className="text-2xs font-normal text-muted-foreground">
                      Paid to: {exp.paidTo}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        exp.category === "MANDAP"
                          ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-600"
                          : exp.category === "DECORATION"
                            ? "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-600"
                            : exp.category === "SOUND"
                              ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-600"
                              : "bg-blue-500/20 text-blue-600"
                      }`}
                    >
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{exp.paymentMode}</td>
                  <td className="px-4 py-3 text-muted-foreground">{exp.date}</td>
                  <td className="px-4 py-3 text-right font-extrabold text-foreground">
                    ₹{exp.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
