import { AppSectionHeader, AppCard, AppIconBadge } from "@/components/common";
import { reasons, festivalSummary } from "@/lib/data/landingPageData";
import { Check, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const WhyFestivalFund = () => {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <AppSectionHeader
          badge="Why FestivalFund"
          title="Built for trust, designed for scale"
          subtitle="Organizations across India trust FestivalFund to manage contributions, track expenses, and generate transparent reports — all from one platform."
        />
        <div className="mt-12 grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-5">
            {reasons.map((r, i) => (
              <div key={i} className="flex gap-4">
                <AppIconBadge icon={<Check className="h-5 w-5" />} colorIndex={i} size="md" />
                <div>
                  <h4 className="text-base font-semibold text-foreground">{r.title}</h4>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
          <AppCard className="p-5 border-border/60 bg-card/90">
            <p className="mb-4 text-sm font-bold text-foreground">Today&apos;s Financial Summary</p>
            <div className="grid grid-cols-2 gap-3">
              {festivalSummary.map((m, i) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-border/50 bg-muted/30 p-3"
                >
                  <div className="flex items-center justify-between">
                    <AppIconBadge icon={<m.icon className="h-4 w-4" />} colorIndex={i} size="sm" />
                    {m.trend && (
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-[11px] font-semibold",
                          m.trendUp
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-500",
                        )}
                      >
                        {m.trendUp ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {m.trend}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-lg font-bold text-foreground">{m.value}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{m.label}</p>
                </div>
              ))}
            </div>
          </AppCard>
        </div>
      </div>
    </section>
  );
};

export default WhyFestivalFund;
