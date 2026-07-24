import { AppSectionHeader, AppIconBadge } from "@/components/common";
import { steps } from "@/lib/data/landingPageData";
import { Building2, CreditCard, Calendar, Sparkles } from "lucide-react";

const stepIcons = [Building2, CreditCard, Calendar, Sparkles];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <AppSectionHeader
          badge="How It Works"
          title="Get started in minutes, not weeks"
          subtitle="Set up your organization, invite your team, and start managing festival funds immediately."
        />
        <div className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-0">
          {steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={i} className="relative flex flex-col items-center text-center">
                <AppIconBadge
                  icon={<Icon className="h-6 w-6" />}
                  colorIndex={i}
                  size="lg"
                  className="mx-auto"
                />
                <h4 className="mt-4 text-base font-semibold text-foreground">{s.title}</h4>
                <p className="mt-1.5 max-w-[220px] text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+28px)] top-7 hidden h-px w-[calc(100%-56px)] border-t-2 border-dashed border-border md:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
