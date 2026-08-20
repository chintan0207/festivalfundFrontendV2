import { AppSectionHeader, AppCard, AppIconBadge } from "@/components/common";
import { reasons } from "@/lib/data/landingPageData";
import { Check, ShieldCheck } from "lucide-react";

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
            <p className="mb-4 text-sm font-bold text-foreground">What you get out of the box</p>
            <div className="space-y-3">
              {[
                "Transparent, auditable financial records",
                "Instant PDF receipts for every contribution",
                "Role-based access for admins and viewers",
                "Fully isolated data per organization",
                "Mobile-friendly for on-the-go management",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="text-xs sm:text-sm text-foreground">{point}</span>
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
