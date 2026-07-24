import { AppBadge, AppCard, AppIconBadge } from "@/components/common";
import { tenantOrgs } from "@/lib/data/landingPageData";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const MultiTenantSection = () => {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <div>
          <AppBadge className="mb-4 w-fit">Multi-Tenant Architecture</AppBadge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">One platform, thousands of organizations</h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
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
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <AppCard className="p-6 border-border/60 bg-card/90">
          <div className="grid grid-cols-2 gap-3">
            {tenantOrgs.map((org, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl border p-4 text-center transition-colors",
                  i === 0
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/60 bg-muted/40",
                )}
              >
                <AppIconBadge
                  icon={org.split(" ").map((n) => n[0]).join("")}
                  colorIndex={i}
                  size="sm"
                  className="mx-auto mb-2 font-bold"
                />
                <p className="text-xs font-semibold text-foreground">{org}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground font-medium">
                  {["Active", "Active", "Trial", "Active", "Active", "Active"][i]}
                </p>
              </div>
            ))}
          </div>
        </AppCard>
      </div>
    </section>
  );
};

export default MultiTenantSection;
