import {
  AppBadge,
  AppButton,
  AppCard,
  AppPageHero,
  AppSectionHeader,
  AppCTASection,
} from "@/components/common";
import { pricingPlans } from "@/lib/data/landingPageData";
import { Check, ChevronRight, Star, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate applies from your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans come with a 14-day free trial. No credit card required. You can cancel anytime during the trial with no charges.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, and bank transfers. For annual plans, we offer a 15% discount.",
  },
  {
    question: "Can I customize my plan?",
    answer: "Yes, contact our sales team for custom plans tailored to your organization's specific needs. We offer volume discounts for large organizations.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption, secure JWT authentication, and complete data isolation between organizations. Your data is backed up daily.",
  },
  {
    question: "Do you offer support?",
    answer: "All plans include email support. Standard and Premium plans include priority support with faster response times. Premium plans also include a dedicated account manager.",
  },
];

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
        <div className="mx-auto max-w-5xl pt-4">
          <div className="grid gap-6 md:grid-cols-3 text-left">
            {pricingPlans.map((plan, i) => (
              <AppCard
                key={i}
                className={cn(
                  "relative flex flex-col border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-6 bg-card/90",
                  plan.featured && "border-primary/60 shadow-md shadow-primary/10",
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <AppBadge className="bg-primary text-primary-foreground text-xs px-4 py-1 font-semibold shadow-md">
                      Most Popular
                    </AppBadge>
                  </div>
                )}
                <div className={cn("flex flex-col gap-6", plan.featured && "pt-2")}>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-foreground">₹0</span>
                      <span className="text-sm text-muted-foreground font-semibold">/month</span>
                      <span className="text-sm text-muted-foreground/70 line-through ml-1.5 font-medium">
                        ₹{plan.regularPrice}/month
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full w-max mt-1">
                      Currently Free
                    </span>
                  </div>
                  <Link to="/signup" className="w-full">
                    <AppButton
                      variant={plan.featured ? "default" : "outline"}
                      className="w-full"
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      {plan.cta}
                    </AppButton>
                  </Link>
                  <ul className="space-y-3 pt-2 border-t border-border/50">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm font-medium text-foreground/90">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
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
