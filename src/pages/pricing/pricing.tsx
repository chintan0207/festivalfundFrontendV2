import {
  AppBadge,
  AppButton,
  AppCard,
  AppPageHero,
  AppSectionHeader,
  AppCTASection,
} from "@/components/common";
import { pricingPlans } from "@/lib/data/landingPageData";
import { Check, ChevronRight, Star, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate applies from your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "During our launch period, all plans are completely free with full access to all features. No credit card is required to sign up.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept UPI, Net Banking, Credit/Debit cards, and major digital wallets via our secure payment gateway.",
  },
  {
    question: "What happens to my data if I downgrade?",
    answer: "All your existing data remains safe and accessible. If your new plan has lower limits, you won't be able to add new items beyond the limit, but existing data is never deleted.",
  },
  {
    question: "Do you offer discounts for non-profits or community trusts?",
    answer: "Yes! Special pricing is available for registered non-profit organizations and charitable trusts. Contact our support team for details.",
  },
];

// Pricing page component - 3-column pricing grid
const Pricing = () => {
  return (
    <div className="bg-background">
      {/* Hero & Pricing Cards */}
      <AppPageHero
        badge={
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Launch Period
          </span>
        }
        badgeIcon={<Star className="h-4 w-4 text-primary" />}
        title={
          <>
            Simple plans. <span className="gradient-text">Full access.</span>
          </>
        }
        description="All FestivalFund plans are currently free. Enjoy full access during our launch period."
      >
        <div className="mx-auto max-w-6xl pt-6">
          <div className="grid gap-6 md:grid-cols-3 text-left items-stretch">
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
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      {plan.cta}
                    </AppButton>
                  </Link>
                </div>
              </AppCard>
            ))}
          </div>
          <p className="mt-6 text-center text-xs sm:text-sm text-muted-foreground font-medium">
            All FestivalFund plans are currently free. Enjoy full access during our launch period.
          </p>
        </div>
      </AppPageHero>

      {/* Feature Comparison */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <AppSectionHeader
            badge="Comparison"
            title="Compare plans in detail"
            subtitle="Explore plan capabilities. All features are fully unlocked while all plans remain free."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/60">
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-foreground">Basic</th>
                    <th className="px-6 py-4 text-center font-semibold text-primary">Standard</th>
                    <th className="px-6 py-4 text-center font-semibold text-foreground">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Current Price", basic: "₹0 (Free)", standard: "₹0 (Free)", premium: "₹0 (Free)" },
                    { feature: "Planned Regular Price", basic: "₹99 / month", standard: "₹299 / month", premium: "₹399 / month" },
                    { feature: "Festivals per year", basic: "Unlimited", standard: "Unlimited", premium: "Unlimited" },
                    { feature: "Contributors", basic: "Unlimited", standard: "Unlimited", premium: "Unlimited" },
                    { feature: "Receipt Generation", basic: "Yes", standard: "Yes", premium: "Yes" },
                    { feature: "Basic Reports & Export", basic: "Yes", standard: "Yes", premium: "Yes" },
                    { feature: "Advanced Insights", basic: "Basic", standard: "Advanced", premium: "Comprehensive" },
                    { feature: "Export Capabilities", basic: "PDF / CSV", standard: "Full Export", premium: "Extended Archival" },
                    { feature: "Support", basic: "Standard", standard: "Priority", premium: "Dedicated 24/7" },
                  ].map((row, i) => (
                    <tr key={i} className={cn("border-b border-border/40 last:border-b-0", i % 2 === 1 && "bg-muted/20")}>
                      <td className="px-6 py-3.5 font-medium text-foreground">{row.feature}</td>
                      <td className="px-6 py-3.5 text-center text-muted-foreground">{row.basic}</td>
                      <td className="px-6 py-3.5 text-center text-foreground font-semibold">{row.standard}</td>
                      <td className="px-6 py-3.5 text-center text-muted-foreground">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-left">
          <AppSectionHeader
            badge="FAQ"
            title="Frequently asked questions"
            subtitle="Everything you need to know about our plans and pricing."
          />
          <div className="mt-10 space-y-3.5">
            {faqItems.map((item, i) => (
              <details key={i} className="group rounded-2xl border border-border/60 bg-card/80 [&_summary::-webkit-details-marker]:hidden transition-colors hover:border-primary/40">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-foreground">
                  {item.question}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90 group-open:text-primary" />
                </summary>
                <div className="px-6 pb-4 pt-1 border-t border-border/30">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <AppCTASection
        title="Still have questions?"
        description="Our team is here to help you find the perfect plan for your organization."
      >
        <Link to="/contact">
          <AppButton size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Contact Sales
          </AppButton>
        </Link>
        <Link to="/signup">
          <AppButton variant="outline" size="lg">
            Start Free Trial
          </AppButton>
        </Link>
      </AppCTASection>
    </div>
  );
};

export default Pricing;
