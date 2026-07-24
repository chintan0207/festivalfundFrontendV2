import { AppSectionHeader, AppCard } from "@/components/common";
import { securityFeatures } from "@/lib/data/landingPageData";

const SecuritySection = () => {
  return (
    <section id="security" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <AppSectionHeader
          badge="Security"
          title="Enterprise-grade security by default"
          subtitle="Your data is protected with bank-level encryption, role-based access control, and comprehensive audit trails."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((s, i) => {
            const Icon = s.icon;
            return (
              <AppCard key={i} className="border-border/60 p-5 text-center bg-card/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              </AppCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
