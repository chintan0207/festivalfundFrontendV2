import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivals } from "@/api/festival/useFestivals";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Banknote,
  Calendar,
  Zap,
} from "lucide-react";

const Dashboard = () => {
  const { activeFestivalId } = useFestivalApiStore();
  const { data } = useFestivals();
  const festivals = (data?.festivals ?? []).filter((f) => !f.isDeleted);

  const activeFest =
    festivals.find((f) => f._id === activeFestivalId) ?? festivals[0] ?? null;

  // Derived stats based on backend data structure
  const stats = activeFest?.stats;
  const openingBalance = stats?.openingBalance ?? 0;
  const totalCollected = stats?.totalCollected ?? 0;
  const totalSpent = stats?.totalExpenses ?? 0;
  const currentBalance =
    stats?.currentBalance ?? openingBalance + totalCollected - totalSpent;
  const pendingAmount = stats?.pendingAmount ?? 0;

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

        {/* ACTIVE FESTIVAL CHIP (selection lives in the top navbar) */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="text-left min-w-[130px]">
            <p className="text-xs font-bold text-foreground truncate">
              {activeFest?.name ?? "Select Festival"}
            </p>
            <p className="text-2xs text-muted-foreground font-medium">
              {activeFest?.year ?? ""}
            </p>
          </div>
        </div>
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