import { AppBadge } from "@/components/common/AppBadge";
import { Card, CardContent } from "@/components/ui/card";
import { features, iconGradients } from "@/lib/data/landingPageData";

const FeaturesSection = () => {
  return (
    <section id="features" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <AppBadge className="mb-3 mx-auto w-fit">Product Overview</AppBadge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to manage festival finances</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            From contributions to expenses, billing to reports — FestivalFund brings your entire financial workflow into one elegant platform.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card
                key={i}
                className="group overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ borderTopColor: f.color, borderTopWidth: 3 }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${iconGradients[i]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-semibold">{f.title}</h3>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
