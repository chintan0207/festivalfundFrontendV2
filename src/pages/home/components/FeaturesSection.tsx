import { AppBadge, AppCard, AppSectionHeader, AppIconBadge } from "@/components/common";
import { features } from "@/lib/data/landingPageData";

const FeaturesSection = () => {
  return (
    <section id="features" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <AppSectionHeader
          badge="Product Overview"
          title="Everything you need to manage festival finances"
          subtitle="From contributions to expenses, billing to reports — FestivalFund brings your entire financial workflow into one elegant platform."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <AppCard
                key={i}
                className="group overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg p-5 bg-card/80 space-y-2.5"
                style={{ borderTopColor: f.color, borderTopWidth: 3 }}
              >
                <div className="flex items-center gap-3">
                  <AppIconBadge icon={<Icon className="h-4.5 w-4.5" />} colorIndex={i} size="sm" />
                  <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </AppCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
