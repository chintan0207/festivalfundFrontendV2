import { useState } from "react";
import { useFestivalStore } from "@/store/festivalStore";
import { Badge } from "@/components/ui/badge";
import { AppButton } from "@/components/common/AppButton";
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  Target,
  ArrowRight,
  BarChart3,
  Search,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const FestivalsPage = () => {
  const { festivals, activeFestivalId, setActiveFestival, addFestival } = useFestivalStore();
  const [filterTab, setFilterTab] = useState<"ALL" | "ACTIVE" | "UPCOMING" | "COMPLETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [year, setYear] = useState(2026);
  const [targetAmount, setTargetAmount] = useState(500000);
  const [category, setCategory] = useState("Religious & Cultural");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("Community Grounds");
  const [description, setDescription] = useState("");

  const activeFest = festivals.find((f) => f.id === activeFestivalId);

  const filteredFestivals = festivals.filter((f) => {
    const matchesTab = filterTab === "ALL" || f.status === filterTab;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalTarget = festivals.reduce((acc, f) => acc + f.targetAmount, 0);
  const totalCollected = festivals.reduce((acc, f) => acc + (f.stats?.totalCollected || 0), 0);
  const totalSpent = festivals.reduce((acc, f) => acc + (f.stats?.totalExpenses || 0), 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addFestival({
      name,
      year: Number(year),
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: endDate || new Date().toISOString().split("T")[0],
      targetAmount: Number(targetAmount),
      status: "UPCOMING",
      location: location || "Main Pavilion",
      category: category || "Cultural Event",
      description: description || "Annual festival celebration.",
    });

    // Reset form
    setName("");
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Festivals Directory
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {festivals.length} Total
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your annual festivals, set active context for quick tracking, and monitor fund targets.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <AppButton className="gap-2 rounded-xl shadow-md">
              <Plus className="h-4 w-4" />
              <span>Create New Festival</span>
            </AppButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <form onSubmit={handleCreateSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Create New Festival
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Setup target budget, dates, and venue for your upcoming festival event.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                <div className="grid gap-1.5">
                  <Label htmlFor="festName">Festival Title</Label>
                  <Input
                    id="festName"
                    placeholder="e.g. Ganesh Chaturthi Mahotsav 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="festYear">Event Year</Label>
                    <Input
                      id="festYear"
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="targetAmt">Target Budget (₹)</Label>
                    <Input
                      id="targetAmt"
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="sDate">Start Date</Label>
                    <Input
                      id="sDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="eDate">End Date</Label>
                    <Input
                      id="eDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="loc">Venue / Location</Label>
                  <Input
                    id="loc"
                    placeholder="e.g. Central Mandap Ground"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="desc">Description</Label>
                  <Input
                    id="desc"
                    placeholder="Brief description of events and highlights..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <AppButton type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </AppButton>
                <AppButton type="submit">Save Festival</AppButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-2xs font-medium uppercase tracking-wider">
            <span>Active Festivals</span>
            <CalendarDays className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">
            {festivals.filter((f) => f.status === "ACTIVE").length}
          </p>
          <p className="text-2xs text-emerald-600 dark:text-emerald-400 font-medium">
            Currently accepting funds
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-2xs font-medium uppercase tracking-wider">
            <span>Total Target Budget</span>
            <Target className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">
            ₹{(totalTarget / 100000).toFixed(1)}L
          </p>
          <p className="text-2xs text-muted-foreground">Across all registered festivals</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-2xs font-medium uppercase tracking-wider">
            <span>Total Funds Raised</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{(totalCollected / 100000).toFixed(1)}L
          </p>
          <p className="text-2xs text-emerald-600 dark:text-emerald-400 font-medium">
            {((totalCollected / (totalTarget || 1)) * 100).toFixed(0)}% Overall Progress
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-2xs font-medium uppercase tracking-wider">
            <span>Total Expenses</span>
            <BarChart3 className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">
            ₹{(totalSpent / 100000).toFixed(1)}L
          </p>
          <p className="text-2xs text-muted-foreground">
            Net Surplus: ₹{((totalCollected - totalSpent) / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      {/* ACTIVE FESTIVAL SPOTLIGHT BANNER */}
      {activeFest && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/15 via-emerald-500/10 to-teal-500/10 border border-primary/20 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-semibold">
                  ACTIVE FESTIVAL CONTEXT
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground">
                  {activeFest.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{activeFest.name}</h2>
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {activeFest.startDate} to {activeFest.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {activeFest.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  {activeFest.contributorsCount} Contributors
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-2xs text-muted-foreground uppercase font-semibold">
                  Fund Target Achieved
                </p>
                <p className="text-lg font-bold text-primary">
                  ₹{(activeFest.stats?.totalCollected || 0).toLocaleString()} / ₹
                  {activeFest.targetAmount.toLocaleString()}
                </p>
              </div>
              <AppButton
                variant="outline"
                onClick={() => setActiveFestival(activeFest.id)}
                className="w-full sm:w-auto gap-2 bg-card rounded-xl font-semibold border-primary/30 text-primary"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Currently Active</span>
              </AppButton>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-2xs font-semibold text-muted-foreground">
              <span>
                Target Completion:{" "}
                {(((activeFest.stats?.totalCollected || 0) / (activeFest.targetAmount || 1)) * 100).toFixed(1)}%
              </span>
              <span>Spent: ₹{(activeFest.stats?.totalExpenses || 0).toLocaleString()}</span>
            </div>
            <div className="h-3 w-full bg-muted/80 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    ((activeFest.stats?.totalCollected || 0) / (activeFest.targetAmount || 1)) * 100,
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl w-full sm:w-auto">
          {(["ALL", "ACTIVE", "UPCOMING", "COMPLETED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === tab
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? "All Festivals" : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search festival name or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* FESTIVAL CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFestivals.map((fest) => {
          const isSelected = activeFestivalId === fest.id;
          const festCollected = fest.stats?.totalCollected || 0;
          const festExpenses = fest.stats?.totalExpenses || 0;
          const progress = Math.min(
            100,
            (festCollected / (fest.targetAmount || 1)) * 100,
          );

          return (
            <div
              key={fest.id}
              className={`group p-5 rounded-2xl bg-card border transition-all duration-200 hover:shadow-lg flex flex-col justify-between space-y-4 ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20 shadow-md"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-2xs font-semibold ${
                      fest.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : fest.status === "UPCOMING"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {fest.status}
                  </Badge>
                  <span className="text-2xs font-semibold text-muted-foreground">{fest.year}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {fest.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {fest.description}
                  </p>
                </div>

                {/* Progress Stats */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Raised:</span>
                    <span className="font-bold text-foreground">
                      ₹{festCollected.toLocaleString()}{" "}
                      <span className="text-2xs text-muted-foreground">
                        / ₹{fest.targetAmount.toLocaleString()}
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-2xs text-muted-foreground">
                    <span>{progress.toFixed(0)}% achieved</span>
                    <span>Spent: ₹{festExpenses.toLocaleString()}</span>
                  </div>
                </div>

                {/* Info Details */}
                <div className="pt-2 border-t border-border/60 space-y-1 text-2xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-primary" />
                    <span>
                      {fest.startDate} - {fest.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="truncate">{fest.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-border">
                {isSelected ? (
                  <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Active Context</span>
                  </div>
                ) : (
                  <AppButton
                    variant="outline"
                    onClick={() => setActiveFestival(fest.id)}
                    className="w-full justify-center gap-2 rounded-xl text-xs font-semibold hover:border-primary hover:text-primary"
                  >
                    <span>Set Active Festival</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </AppButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FestivalsPage;
