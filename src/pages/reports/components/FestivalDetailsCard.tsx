import { Calendar, MapPin, Tag, Target, Landmark, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";

interface FestivalDetailsCardProps {
  festival: {
    id: string;
    name: string;
    year: number;
    startDate?: string;
    endDate?: string;
    targetAmount?: number;
    status: string;
    location?: string;
    category?: string;
    description?: string;
  };
  totalCollected: number;
  totalSpent?: number;
  currentBalance?: number;
}

export const FestivalDetailsCard = ({
  festival,
  totalCollected,
}: FestivalDetailsCardProps) => {
  const theme = getModuleTheme("festivals");

  const target = festival?.targetAmount || 0;
  const targetProgress = target > 0 ? Math.min(Math.round((totalCollected / target) * 100), 100) : 0;

  const formatDate = (d?: string) => {
    if (!d) return "TBD";
    try {
      return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return d;
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    UPCOMING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    COMPLETED: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    ARCHIVED: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-5 shadow-xs space-y-4">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm font-extrabold text-lg", theme.gradient)}>
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-foreground tracking-tight">{festival?.name || "Festival Overview"}</h2>
              <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                {festival?.year || 2025}
              </span>
              <span className={cn("text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wide", statusColors[festival?.status] || statusColors.ACTIVE)}>
                {festival?.status || "ACTIVE"}
              </span>
            </div>
            {festival?.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{festival.description}</p>
            )}
          </div>
        </div>

        {/* TARGET BUDGET CALLOUT */}
        {target > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/40 w-full sm:w-auto">
            <Target className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Target Budget</p>
              <p className="text-sm font-mono font-extrabold text-foreground">
                ₹{target.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* METADATA CHIPS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/40">
          <Calendar className="h-4 w-4 text-purple-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold">Event Dates</p>
            <p className="font-semibold text-foreground truncate">
              {formatDate(festival?.startDate)} – {formatDate(festival?.endDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/40">
          <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold">Location / Mandap</p>
            <p className="font-semibold text-foreground truncate">{festival?.location || "Main Festival Ground"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/40">
          <Tag className="h-4 w-4 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-semibold">Category</p>
            <p className="font-semibold text-foreground truncate">{festival?.category || "Religious & Cultural"}</p>
          </div>
        </div>
      </div>

      {/* BUDGET COLLECTION PROGRESS BAR */}
      {target > 0 && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Target Budget Progress</span>
            </div>
            <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400">
              {targetProgress}% ({totalCollected >= target ? "Target Achieved!" : `₹${(target - totalCollected).toLocaleString("en-IN")} pending`})
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${targetProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
