import { AppBadge } from "@/components/common/AppBadge";
import { Card, CardContent } from "@/components/ui/card";
import { tenantOrgs, iconGradients } from "@/lib/data/landingPageData";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const MultiTenantSection = () => {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <div>
          <AppBadge className="mb-4 w-fit">Multi-Tenant Architecture</AppBadge>
          <h2 className="text-3xl font-bold tracking-tight">One platform, thousands of organizations</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Each organization gets its own isolated workspace with custom branding, roles, and data — all managed through a single secure platform.
          </p>
          <div className="mt-6 space-y-3">
            {[
              "Complete data isolation between organizations",
              "Custom branding, colors, and domain",
              "Role-based access control per organization",
              "Centralized super admin management",
              "Scalable to thousands of tenants",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-sm text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {tenantOrgs.map((org, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl border p-4 text-center",
                  i === 0
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-muted/50",
                )}
              >
                <div
                  className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${iconGradients[i]}`}
                >
                  {org.split(" ").map((n) => n[0]).join("")}
                </div>
                <p className="text-xs font-medium">{org}</p>
                <p className="mt-0.5 text-2xs text-muted-foreground">
                  {["Active", "Active", "Trial", "Active", "Active", "Active"][i]}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default MultiTenantSection;
