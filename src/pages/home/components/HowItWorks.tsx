import { AppBadge } from "@/components/common/AppBadge";
import { steps, iconGradients } from "@/lib/data/landingPageData";
import { Building2, CreditCard, Calendar, Sparkles } from "lucide-react";

const stepIcons = [Building2, CreditCard, Calendar, Sparkles];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <AppBadge className="mb-3 mx-auto w-fit">How It Works</AppBadge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get started in minutes, not weeks</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Set up your organization, invite your team, and start managing festival funds immediately.
          </p>
        </div>
        <div className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-0">
          {steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${iconGradients[i]}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mt-4 text-base font-semibold">{s.title}</h4>
                <p className="mt-1.5 max-w-[220px] text-sm text-muted-foreground">{s.description}</p>
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
