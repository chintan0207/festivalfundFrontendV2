import { useFestivalStore } from "@/store/festivalStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Banknote,
  Calendar,
  ChevronDown,
  Check,
  Zap,
} from "lucide-react";

const Dashboard = () => {
  const { activeFestivalId, festivals, setActiveFestival } = useFestivalStore();

  const activeFest = festivals.find((f) => f.id === activeFestivalId) || festivals[0];

  // Calculated stats based on backend data structure
  const openingBalance =
    activeFestivalId === "ALL"
      ? festivals.reduce((acc, f) => acc + (f.stats?.openingBalance || 0), 0)
      : activeFest?.stats?.openingBalance || 25000;

  const totalCollected =
    activeFestivalId === "ALL"
      ? festivals.reduce((acc, f) => acc + (f.stats?.totalCollected || 0), 0)
      : activeFest?.stats?.totalCollected || 107748;

  const totalSpent =
    activeFestivalId === "ALL"
      ? festivals.reduce((acc, f) => acc + (f.stats?.totalExpenses || 0), 0)
      : activeFest?.stats?.totalExpenses || 104139;

  const currentBalance =
    activeFestivalId === "ALL"
      ? festivals.reduce((acc, f) => acc + (f.stats?.currentBalance || 0), 0)
      : activeFest?.stats?.currentBalance || openingBalance + totalCollected - totalSpent;

  const pendingAmount =
    activeFestivalId === "ALL"
      ? festivals.reduce((acc, f) => acc + (f.stats?.pendingAmount || 0), 0)
      : activeFest?.stats?.pendingAmount || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER WITH FESTIVAL SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Festival Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview of contributions and expenses
          </p>
        </div>

        {/* FESTIVAL SELECTOR DROPDOWN CARD */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-primary/40 transition-all cursor-pointer">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-left min-w-[130px]">
                <p className="text-xs font-bold text-foreground truncate">
                  {activeFestivalId === "ALL" ? "All Festivals" : activeFest?.name}
                </p>
                <p className="text-2xs text-muted-foreground font-medium">
                  {activeFestivalId === "ALL" ? "Combined View" : activeFest?.year}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-xl">
            <DropdownMenuLabel className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
              Switch Active Festival
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => setActiveFestival("ALL")}
              className={`flex items-center justify-between cursor-pointer rounded-lg px-2.5 py-2 ${
                activeFestivalId === "ALL" ? "bg-primary/10 text-primary font-semibold" : ""
              }`}
            >
              <span className="text-xs font-medium">All Festivals</span>
              {activeFestivalId === "ALL" && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>

            {festivals.map((fest) => (
              <DropdownMenuItem
                key={fest.id}
                onClick={() => setActiveFestival(fest.id)}
                className={`flex items-center justify-between cursor-pointer rounded-lg px-2.5 py-2 ${
                  activeFestivalId === fest.id ? "bg-primary/10 text-primary font-semibold" : ""
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{fest.name}</span>
                  <span className="text-2xs text-muted-foreground">{fest.year}</span>
                </div>
                {activeFestivalId === fest.id && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 4 PRIMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Opening Balance */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xl">
            ₹
          </div>
          <div>
            <p className="text-2xs font-medium text-muted-foreground">Opening Balance</p>
            <p className="text-xl font-extrabold text-foreground tracking-tight mt-0.5">
              ₹{openingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-2xs text-muted-foreground">Initial funds</p>
          </div>
        </div>

        {/* 2. Total Collected */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xs font-medium text-muted-foreground">Total Collected</p>
            <p className="text-xl font-extrabold text-foreground tracking-tight mt-0.5">
              ₹{totalCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-2xs text-muted-foreground">From contributions</p>
          </div>
        </div>

        {/* 3. Total Spent */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xl">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xs font-medium text-muted-foreground">Total Spent</p>
            <p className="text-xl font-extrabold text-foreground tracking-tight mt-0.5">
              ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-2xs text-muted-foreground">On expenses</p>
          </div>
        </div>

        {/* 4. Current Balance */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xl">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xs font-medium text-muted-foreground">Current Balance</p>
            <p className="text-xl font-extrabold text-foreground tracking-tight mt-0.5">
              ₹{currentBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-2xs text-muted-foreground">Available funds</p>
          </div>
        </div>
      </div>

      {/* QUICK OVERVIEW CARD */}
      <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-600" />
          <h2 className="text-base font-bold text-foreground">Quick Overview</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pending Amount */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                ₹{pendingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-2xs text-muted-foreground font-medium">Pending Amount</p>
            </div>
          </div>

          {/* Total Amount */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                ₹{totalCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-2xs text-muted-foreground font-medium">Total Amount</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
