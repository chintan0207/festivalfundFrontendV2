import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { Card, CardContent } from "@/components/ui/card";
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
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 via-chart-2/10 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="mb-5 mx-auto w-fit">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Simple Pricing
              </span>
            </AppBadge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Transparent pricing for
              <br />
              <span className="gradient-text">every organization</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Choose the plan that fits your mandal, trust, or committee. Upgrade or downgrade anytime with no hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <Card
                key={i}
                className={cn(
                  "relative flex flex-col border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                  plan.featured && "border-primary/50 shadow-md",
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <AppBadge className="bg-primary text-primary-foreground text-xs px-4 py-1">
                      Most Popular
                    </AppBadge>
                  </div>
                )}
                <CardContent className={cn("flex flex-col gap-6 p-6", plan.featured && "pt-8")}>
                  <div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== "Free" && (
                      <span className="text-sm text-muted-foreground">/month</span>
                    )}
                  </div>
                  <Link to="/signup" className="w-full">
                    <AppButton
                      variant={plan.featured ? "primary" : "outline"}
                      className="w-full"
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      {plan.cta}
                    </AppButton>
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <AppBadge className="mb-3 mx-auto w-fit">Comparison</AppBadge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Compare plans in detail</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Find the perfect plan for your organization's needs.
            </p>
          </div>
          <div className="mt-10 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">Starter</th>
                  <th className="px-6 py-4 text-center font-semibold text-primary">Standard</th>
                  <th className="px-6 py-4 text-center font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Contributors", starter: "Up to 100", standard: "Unlimited", premium: "Unlimited" },
                  { feature: "Festivals per year", starter: "1", standard: "Unlimited", premium: "Unlimited" },
                  { feature: "Receipt Generation", starter: "Yes", standard: "Yes", premium: "Yes" },
                  { feature: "Basic Reports", starter: "Yes", standard: "Yes", premium: "Yes" },
                  { feature: "Advanced Reports", starter: "—", standard: "Yes", premium: "Yes" },
                  { feature: "Expense Reports", starter: "—", standard: "Yes", premium: "Yes" },
                  { feature: "Multi-Organization", starter: "—", standard: "—", premium: "Yes" },
                  { feature: "Email Support", starter: "Basic", standard: "Priority", premium: "Priority" },
                  { feature: "Dedicated Manager", starter: "—", standard: "—", premium: "Yes" },
                  { feature: "SLA Guarantee", starter: "—", standard: "—", premium: "Yes" },
                ].map((row, i) => (
                  <tr key={i} className={cn("border-b border-border last:border-b-0", i % 2 === 1 && "bg-muted/20")}>
                    <td className="px-6 py-3.5 font-medium">{row.feature}</td>
                    <td className="px-6 py-3.5 text-center text-muted-foreground">{row.starter}</td>
                    <td className="px-6 py-3.5 text-center text-muted-foreground">{row.standard}</td>
                    <td className="px-6 py-3.5 text-center text-muted-foreground">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto max-w-2xl text-center">
            <AppBadge className="mb-3 mx-auto w-fit">FAQ</AppBadge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Everything you need to know about our plans and pricing.
            </p>
          </div>
          <div className="mt-10 space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="group rounded-xl border border-border/50 bg-muted/20 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm font-semibold">
                  {item.question}
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-24 sm:px-6">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/15 via-chart-2/15 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-3xl border border-border/50 bg-background/60 p-10 text-center shadow-xl backdrop-blur-xl sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Still have questions?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Our team is here to help you find the perfect plan for your organization.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03]"
              >
                Contact Sales <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl border border-border/50 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/50"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
