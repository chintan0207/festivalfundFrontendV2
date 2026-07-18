import { AppButton } from "@/components/common/AppButton";
import { AppBadge } from "@/components/common/AppBadge";
import { Star, ChevronRight } from "lucide-react";

const heroContent = {
  badge: "Built for mandals, trusts, and festival committees",

  titleLine1: "Manage festival funds with,",
  titleHighlight: "clarity & trust",

  description:
    "Track contributions, manage expenses, generate receipts, and build transparent financial records for your community festivals — all in one platform.",

  buttons: {
    primary: "Start Free Trial",
    secondary: "View Demo",
  },

  stats: [
    { value: "100+", label: "Mandals" },
    { value: "₹5Cr+", label: "Funds Managed" },
    { value: "99.9%", label: "Uptime" },
  ],
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.3) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 via-chart-2/10 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <AppBadge
            icon={<Star className="h-4 w-4 text-primary" />}
            className="mb-5 mx-auto w-fit"
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              {heroContent.badge}
            </span>
          </AppBadge>
          <h1 className="animate-fade-up text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {heroContent.titleLine1}
            <br />
            <span className="gradient-text">{heroContent.titleHighlight}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            {heroContent.description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <AppButton size="lg" rightIcon={<ChevronRight className="h-4 w-4" />}>
              {heroContent.buttons.primary}
            </AppButton>
            <AppButton variant="secondary" size="lg">
              {heroContent.buttons.secondary}
            </AppButton>
          </div>
          <p className="mt-4 text-sm" style={{ color: "var(--tertiary)" }}>
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
