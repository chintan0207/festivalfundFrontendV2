import { AppBadge, AppCard, AppIconBadge } from "@/components/common";
import { Database, Lock, Building2, Users, Scale } from "lucide-react";

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
                  <CheckDot />
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <AppCard className="p-6 border-border/60 bg-card/90">
          <div className="space-y-3">
            {[
              { icon: Database, title: "Isolated storage", text: "Every organization's festivals, contributors, and ledgers live in a separate scope." },
              { icon: Lock, title: "Scoped access", text: "Admins and viewers only ever see their own organization's data." },
              { icon: Building2, title: "Custom workspace", text: "Each tenant has its own branding, logo, and preferences." },
              { icon: Users, title: "Team management", text: "Invite members with Admin or Viewer roles per organization." },
              { icon: Scale, title: "Fair limits", text: "Plans define festival and contributor limits per organization." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/40 p-4">
                  <AppIconBadge icon={<Icon className="h-4 w-4" />} colorIndex={i} size="sm" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-2xs text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </AppCard>
      </div>
    </section>
  );
};

const CheckDot = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none">
    <path d="M5 10.5l3 3L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default MultiTenantSection;
