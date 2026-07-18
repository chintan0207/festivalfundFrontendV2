import { AppBadge } from "@/components/common/AppBadge";
import { Card, CardContent } from "@/components/ui/card";
import { securityFeatures } from "@/lib/data/landingPageData";

const SecuritySection = () => {
  return (
    <section id="security" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <AppBadge className="mb-3 mx-auto w-fit">Security</AppBadge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Enterprise-grade security by default</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Your data is protected with bank-level encryption, role-based access control, and comprehensive audit trails.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i}>
                <CardContent className="p-5 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-semibold">{s.title}</h4>
                  <p className="mt-1 text-2xs text-muted-foreground">{s.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
