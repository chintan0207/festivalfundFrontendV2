import { AppSectionHeader, AppBadge, AppButton, AppCard } from "@/components/common";
import { pricingPlans } from "@/lib/data/landingPageData";
import { Check, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// PricingSection component - Modern 3-column card grid
const PricingSection = () => {
  return (
    <section id="pricing" className="px-3.5 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <AppSectionHeader
          badge="Pricing"
          title="Simple plans. Full access."
          subtitle="All FestivalFund plans are currently free. Enjoy full access during our launch period."
        />
        <div className="mx-auto mt-10 pt-4 grid max-w-6xl gap-6 grid-cols-1 md:grid-cols-3 items-stretch">
          {pricingPlans.map((plan, i) => (
            <AppCard
              key={i}
              className={cn(
                "relative flex flex-col justify-between border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-6 sm:p-7 bg-card/90 rounded-2xl overflow-visible",
                plan.featured
                  ? "border-primary/80 shadow-lg shadow-primary/10 ring-2 ring-primary/20 bg-primary/[0.02] z-10"
                  : "hover:border-border z-0",
              )}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
                  <AppBadge className="bg-primary text-primary-foreground text-xs px-3.5 py-1 font-bold shadow-lg inline-flex items-center gap-1.5 rounded-full whitespace-nowrap">
                    <Sparkles className="h-3.5 w-3.5" />
                    Most Popular
                  </AppBadge>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 border border-border/50 flex flex-col gap-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-foreground">₹0</span>
                    <span className="text-xs font-semibold text-muted-foreground">/month</span>
                    <span className="text-xs sm:text-sm text-muted-foreground/70 line-through ml-auto font-medium">
                      ₹{plan.regularPrice}/month
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      Currently Free
                    </span>
                    <span className="text-[10px] text-muted-foreground/80 font-medium">
                      Planned regular price
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 pt-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-foreground/90">
                      <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-border/50">
                <Link to="/signup" className="w-full block">
                  <AppButton
                    variant={plan.featured ? "default" : "outline"}
                    className="w-full py-2.5 text-sm font-semibold shadow-sm"
                  >
                    {plan.cta}
                  </AppButton>
                </Link>
              </div>
            </AppCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
