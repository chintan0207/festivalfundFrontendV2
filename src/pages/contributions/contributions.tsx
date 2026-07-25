import { useState } from "react";
import { useFestivalStore } from "@/store/festivalStore";
import { AppButton } from "@/components/common/AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
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

export const ContributionsPage = () => {
  const { contributions, festivals, activeFestivalId, addContribution } = useFestivalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DEPOSITED" | "PENDING" | "CANCELLED">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "PARENT" | "BOY" | "GIRL">("ALL");
  const [sortBy, setSortBy] = useState<"name" | "amount" | "none">("none");
  const [minimalView, setMinimalView] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [targetFestId, setTargetFestId] = useState(
    activeFestivalId === "ALL" ? "fest-1" : activeFestivalId,
  );
  const [contributorName, setContributorName] = useState("");
  const [contributorPhone, setContributorPhone] = useState("");
  const [contributorCategory, setContributorCategory] = useState<"PARENT" | "BOY" | "GIRL">("PARENT");
  const [amount, setAmount] = useState(5000);
  const [paymentMode, setPaymentMode] = useState<"UPI" | "CASH">("UPI");
  const [notes, setNotes] = useState("");

  // Filter contributions
  let filteredContributions = contributions.filter((cnt) => {
    const matchesFestival = activeFestivalId === "ALL" || cnt.festivalId === activeFestivalId;
    const matchesStatus = statusFilter === "ALL" || cnt.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || cnt.contributorCategory === categoryFilter;
    const matchesSearch =
      cnt.contributorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cnt.contributorPhone.includes(searchQuery) ||
      cnt.receiptNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFestival && matchesStatus && matchesCategory && matchesSearch;
  });

  if (sortBy === "name") {
    filteredContributions = [...filteredContributions].sort((a, b) =>
      a.contributorName.localeCompare(b.contributorName),
    );
  } else if (sortBy === "amount") {
    filteredContributions = [...filteredContributions].sort((a, b) => b.amount - a.amount);
  }

  const depositedTotal = contributions
    .filter((c) => (activeFestivalId === "ALL" || c.festivalId === activeFestivalId) && c.status === "DEPOSITED")
    .reduce((acc, c) => acc + c.amount, 0);

  const pendingTotal = contributions
    .filter((c) => (activeFestivalId === "ALL" || c.festivalId === activeFestivalId) && c.status === "PENDING")
    .reduce((acc, c) => acc + c.amount, 0);

  const grandTotal = depositedTotal + pendingTotal;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributorName || !amount) return;

    addContribution({
      festivalId: targetFestId,
      contributorName,
      contributorPhone: contributorPhone || "+91 98000 00000",
      contributorCategory,
      type: "MONEY",
      amount: Number(amount),
      paymentMode,
      status: "DEPOSITED",
      notes: notes || "Festival contribution",
    });

    setContributorName("");
    setContributorPhone("");
    setNotes("");
    setIsAddOpen(false);
  };

  const clearFilters = () => {
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setSortBy("none");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Contributions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage festival contributions and their details
          </p>
        </div>

        {/* ADD CONTRIBUTION PURPLE GRADIENT BUTTON */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>Add Contribution</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  Add New Contribution
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Record donor contribution & generate receipt.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                <div className="grid gap-1.5">
                  <Label htmlFor="targetFest">Select Festival</Label>
                  <select
                    id="targetFest"
                    value={targetFestId}
                    onChange={(e) => setTargetFestId(e.target.value)}
                    className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs outline-none"
                  >
                    {festivals.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.year})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="cName">Contributor Name</Label>
                  <Input
                    id="cName"
                    placeholder="e.g. Ramesh Sharma"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="cCat">Category</Label>
                    <select
                      id="cCat"
                      value={contributorCategory}
                      onChange={(e) => setContributorCategory(e.target.value as any)}
                      className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs outline-none"
                    >
                      <option value="PARENT">Parents</option>
                      <option value="BOY">Boys</option>
                      <option value="GIRL">Girls</option>
                    </select>
                  </div>

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
                    <Label htmlFor="cPhone">Phone Number</Label>
                    <Input
                      id="cPhone"
                      placeholder="+91 98765 43210"
                      value={contributorPhone}
                      onChange={(e) => setContributorPhone(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="pMode">Payment Mode</Label>
                    <select
                      id="pMode"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value as any)}
                      className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs outline-none"
                    >
                      <option value="UPI">UPI</option>
                      <option value="CASH">Cash</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="e.g. Stage contribution"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <AppButton type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </AppButton>
                <AppButton type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Save Contribution
                </AppButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 3 STAT CARDS MATCHING IMAGE 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Deposited */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-foreground tracking-tight">
              ₹{depositedTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-2xs text-muted-foreground font-medium mt-0.5">Deposited</p>
          </div>
        </div>

        {/* 2. Pending */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-foreground tracking-tight">
              ₹{pendingTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-2xs text-muted-foreground font-medium mt-0.5">Pending</p>
          </div>
        </div>

        {/* 3. Total */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-foreground tracking-tight">
              ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-2xs text-muted-foreground font-medium mt-0.5">Total</p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR MATCHING IMAGE 2 */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-full bg-card border border-border/80 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-purple-500/30 transition-all shadow-xs"
        />
      </div>

      {/* FILTER PILLS BAR MATCHING IMAGE 2 */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-xs text-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-2xs font-semibold text-muted-foreground mr-1">
            <Filter className="h-3.5 w-3.5" /> Status:
          </span>
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              statusFilter === "ALL"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-muted/60 text-purple-600 hover:bg-muted"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("DEPOSITED")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              statusFilter === "DEPOSITED"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-muted/60 text-purple-600 hover:bg-muted"
            }`}
          >
            Deposited
          </button>
          <button
            onClick={() => setStatusFilter("PENDING")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              statusFilter === "PENDING"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-muted/60 text-purple-600 hover:bg-muted"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("CANCELLED")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              statusFilter === "CANCELLED"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-muted/60 text-purple-600 hover:bg-muted"
            }`}
          >
            Cancelled
          </button>
        </div>

        <div className="h-4 w-px bg-border hidden md:block" />

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-2xs font-semibold text-muted-foreground mr-1">
            <Filter className="h-3.5 w-3.5" /> Category:
          </span>
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              categoryFilter === "ALL"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategoryFilter("PARENT")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              categoryFilter === "PARENT"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
            }`}
          >
            Parents
          </button>
          <button
            onClick={() => setCategoryFilter("BOY")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              categoryFilter === "BOY"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
            }`}
          >
            Boys
          </button>
          <button
            onClick={() => setCategoryFilter("GIRL")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              categoryFilter === "GIRL"
                ? "bg-pink-600 text-white shadow-xs"
                : "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20"
            }`}
          >
            Girls
          </button>
        </div>

        <div className="h-4 w-px bg-border hidden md:block" />

        {/* Sort & Clear */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-2xs font-semibold text-muted-foreground">Sort by:</span>
          <button
            onClick={() => setSortBy("name")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              sortBy === "name"
                ? "bg-purple-600 text-white"
                : "bg-muted/60 text-purple-600 hover:bg-muted"
            }`}
          >
            Name
          </button>
          <button
            onClick={() => setSortBy("amount")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              sortBy === "amount"
                ? "bg-purple-600 text-white"
                : "bg-muted/60 text-purple-600 hover:bg-muted"
            }`}
          >
            Amount
          </button>
          <button
            onClick={clearFilters}
            className="px-3.5 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow-xs"
          >
            Clear
          </button>
        </div>
      </div>

      {/* CONTRIBUTIONS LIST TABLE / MINIMAL VIEW */}
      <div className="rounded-2xl bg-card border border-border/80 shadow-xs overflow-hidden">
        {minimalView ? (
          <div className="p-4 space-y-2 divide-y divide-border/50">
            {filteredContributions.map((cnt) => (
              <div key={cnt.id} className="pt-2 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-foreground">{cnt.contributorName}</p>
                  <p className="text-2xs text-muted-foreground">{cnt.receiptNo}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">₹{cnt.amount.toLocaleString()}</p>
                  <span className="text-[10px] text-muted-foreground">{cnt.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/80 text-2xs font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Receipt Code</th>
                  <th className="px-4 py-3">Contributor</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredContributions.map((cnt) => (
                  <tr key={cnt.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-purple-600">
                      {cnt.receiptNo}
                    </td>
                    <td className="px-4 py-3 font-bold text-foreground">
                      {cnt.contributorName}
                      <p className="text-2xs font-normal text-muted-foreground">
                        {cnt.contributorPhone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cnt.contributorCategory === "PARENT"
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600"
                            : cnt.contributorCategory === "BOY"
                              ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600"
                              : "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-600"
                        }`}
                      >
                        {cnt.contributorCategory === "PARENT"
                          ? "Parents"
                          : cnt.contributorCategory === "BOY"
                            ? "Boys"
                            : "Girls"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{cnt.paymentMode}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cnt.status === "DEPOSITED"
                            ? "bg-gradient-to-r from-green-500/20 to-lime-500/20 text-green-600"
                            : cnt.status === "PENDING"
                              ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600"
                              : "bg-red-500/20 text-red-600"
                        }`}
                      >
                        {cnt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-foreground">
                      ₹{cnt.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MINIMAL VIEW TOGGLE BOTTOM RIGHT MATCHING IMAGE 2 */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setMinimalView(!minimalView)}
          className="px-4 py-2 rounded-xl bg-card border border-border/80 text-xs font-semibold text-foreground hover:bg-muted transition-all shadow-xs cursor-pointer"
        >
          {minimalView ? "Switch to Full Table View" : "Switch to Minimal View"}
        </button>
      </div>
    </div>
  );
};

export default ContributionsPage;
