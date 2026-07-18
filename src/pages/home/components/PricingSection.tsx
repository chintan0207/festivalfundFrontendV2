import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { pricingPlans } from "@/lib/data/landingPageData";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PricingSection = () => {
  return (
    <section id="pricing" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <AppBadge className="mb-3 mx-auto w-fit">Pricing</AppBadge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Choose the plan that fits your organization. Upgrade or downgrade anytime.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-xl border border-border">
          {pricingPlans.map((p, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-4 border-b border-border px-6 py-5 last:border-b-0 sm:flex-row sm:items-center sm:gap-6",
                p.featured && "bg-primary/5",
              )}
            >
              <div className="flex min-w-[130px] items-center gap-2">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
                {p.featured && (
                  <AppBadge className="shrink-0 bg-primary text-primary-foreground text-2xs">
                    Most Popular
                  </AppBadge>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">{p.price}</span>
                <span className="text-xs text-muted-foreground">/month</span>
              </div>
              <div className="hidden min-w-0 flex-1 gap-x-3 gap-y-1 sm:flex sm:flex-wrap">
                {p.features.slice(0, 3).map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 text-2xs text-muted-foreground">
                    <Check className="h-2.5 w-2.5 text-primary" />
                    {f}
                  </span>
                ))}
                {p.features.length > 3 && (
                  <span className="text-2xs text-muted-foreground">+{p.features.length - 3} more</span>
                )}
              </div>
              <AppButton
                variant={p.featured ? "primary" : "outline"}
                className="w-full sm:w-auto sm:shrink-0"
              >
                {p.cta}
              </AppButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
