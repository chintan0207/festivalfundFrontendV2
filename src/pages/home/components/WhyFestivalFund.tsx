import { AppBadge } from "@/components/common/AppBadge";
import { Card } from "@/components/ui/card";
import { reasons, festivalSummary, iconGradients } from "@/lib/data/landingPageData";
import { Check, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const WhyFestivalFund = () => {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <AppBadge className="mb-3 mx-auto w-fit">Why FestivalFund</AppBadge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for trust, designed for scale
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Organizations across India trust FestivalFund to manage contributions, track
            expenses, and generate transparent reports — all from one platform.
          </p>
        </div>
        <div className="mt-12 grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-5">
            {reasons.map((r, i) => (
              <div key={i} className="flex gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${iconGradients[i]}`}>
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold">{r.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Card className="p-5">
            <p className="mb-4 text-sm font-semibold">Today&apos;s Financial Summary</p>
            <div className="grid grid-cols-2 gap-3">
              {festivalSummary.map((m, i) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-border bg-muted/30 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${iconGradients[i]}`}
                    >
                      <m.icon className="h-4 w-4" />
                    </div>
                    {m.trend && (
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-2xs font-medium",
                          m.trendUp
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-500",
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
                  <p className="mt-2 text-lg font-bold">{m.value}</p>
                  <p className="text-2xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyFestivalFund;
