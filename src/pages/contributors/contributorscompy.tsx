import { useState } from "react";
import { useFestivalStore } from "@/store/festivalStore";
import { AppButton } from "@/components/common/AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Plus,
  Search,
  Phone,
  UserCheck,
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

export const ContributorsPage = () => {
  const { contributors, activeFestivalId, addContributor } = useFestivalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "PARENT" | "BOY" | "GIRL">("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<"PARENT" | "BOY" | "GIRL">("PARENT");
  const [locality, setLocality] = useState("");

  const filteredContributors = contributors.filter((c) => {
    const matchesFestival = activeFestivalId === "ALL" || c.festivalId === activeFestivalId;
    const matchesCategory = categoryFilter === "ALL" || c.category === categoryFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.locality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFestival && matchesCategory && matchesSearch;
  });

  const totalCount = filteredContributors.length;
  const parentsCount = filteredContributors.filter((c) => c.category === "PARENT").length;
  const boysCount = filteredContributors.filter((c) => c.category === "BOY").length;
  const girlsCount = filteredContributors.filter((c) => c.category === "GIRL").length;

  const handleAddContributor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addContributor({
      festivalId: activeFestivalId === "ALL" ? "fest-1" : activeFestivalId,
      name,
      phone: phone || "+91 99000 00000",
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      category,
      status: "Active",
      locality: locality || "Central Colony",
    });

    setName("");
    setPhone("");
    setEmail("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER WITH INDIGO/PURPLE GRADIENT BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Contributors
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage donor profiles across Parents, Boys, and Girls categories
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>Add Contributor</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <form onSubmit={handleAddContributor}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                  <Users className="h-5 w-5 text-indigo-500" />
                  Add New Contributor
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Register donor details into the system.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                <div className="grid gap-1.5">
                  <Label htmlFor="cName">Full Name</Label>
                  <Input
                    id="cName"
                    placeholder="e.g. Ramesh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="cPhone">Phone Number</Label>
                    <Input
                      id="cPhone"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="cCategory">Category</Label>
                    <select
                      id="cCategory"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="h-9 w-full rounded-xl border border-input bg-card px-3 text-xs outline-none"
                    >
                      <option value="PARENT">Parents</option>
                      <option value="BOY">Boys</option>
                      <option value="GIRL">Girls</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="cEmail">Email Address</Label>
                  <Input
                    id="cEmail"
                    type="email"
                    placeholder="donor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="cLoc">Locality / Address</Label>
                  <Input
                    id="cLoc"
                    placeholder="e.g. Sector 4, Green Park"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <AppButton type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </AppButton>
                <AppButton type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Save Contributor
                </AppButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-2xs font-semibold uppercase">
            <span>Total Donors</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalCount}</p>
          <p className="text-2xs text-muted-foreground">Registered donors</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-2xs font-semibold uppercase">
            <span>Parents</span>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{parentsCount}</p>
          <p className="text-2xs text-emerald-600 font-medium">Head of families</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-2xs font-semibold uppercase">
            <span>Boys & Youth</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{boysCount}</p>
          <p className="text-2xs text-blue-600 font-medium">Youth team members</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-2xs font-semibold uppercase">
            <span>Girls & Youth</span>
            <Users className="h-4 w-4 text-pink-500" />
          </div>
          <p className="text-2xl font-bold text-pink-600 mt-1">{girlsCount}</p>
          <p className="text-2xs text-pink-600 font-medium">Cultural performers</p>
        </div>
      </div>

      {/* SEARCH & CATEGORY FILTER PILLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === "ALL"
                ? "bg-card text-indigo-600 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Donors
          </button>
          <button
            onClick={() => setCategoryFilter("PARENT")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === "PARENT"
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Parents
          </button>
          <button
            onClick={() => setCategoryFilter("BOY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === "BOY"
                ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Boys
          </button>
          <button
            onClick={() => setCategoryFilter("GIRL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === "GIRL"
                ? "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Girls
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl bg-card border border-border/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/80 text-2xs font-bold text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Contributor</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Locality</th>
                <th className="px-4 py-3 text-right">Total Contributed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredContributors.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-600">
                    {c.contributorCode}
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">
                    {c.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.category === "PARENT"
                          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600"
                          : c.category === "BOY"
                            ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600"
                            : "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-600"
                      }`}
                    >
                      {c.category === "PARENT" ? "Parents" : c.category === "BOY" ? "Boys" : "Girls"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground space-y-0.5">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-indigo-500" />
                      <span>{c.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.locality}</td>
                  <td className="px-4 py-3 text-right font-extrabold text-foreground">
                    ₹{c.totalContributed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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

export default ContributorsPage;
