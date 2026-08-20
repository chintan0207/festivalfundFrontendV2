import { AppBadge, AppCard } from "@/components/common";
import { Calendar, Users, Wallet, Receipt, FileText, ShieldCheck } from "lucide-react";

const previewHighlights = [
  {
    icon: Calendar,
    title: "Festivals",
    description: "Plan budgets, dates, and status across every celebration.",
  },
  {
    icon: Users,
    title: "Contributors",
    description: "Profiles with auto-generated codes and contribution history.",
  },
  {
    icon: Wallet,
    title: "Contributions",
    description: "Record cash and in-kind donations with a clear status workflow.",
  },
  {
    icon: Receipt,
    title: "Expenses",
    description: "Track categorized spending against live festival balances.",
  },
];

const DashboardPreview = () => {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl animate-fade-up px-4 sm:px-6">
      <div className="absolute -inset-4 rounded-3xl pointer-events-none" />
      <AppCard className="relative overflow-hidden p-0 border-border/60">
        <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/50 px-4">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center font-mono text-2xs text-muted-foreground">
            app.festivalfund.com/dashboard
          </div>
        </div>
        <div className="p-4 sm:p-6 text-left">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">Dashboard Overview</p>
              <p className="text-2xs text-muted-foreground">
                Your organization&apos;s festival hub
              </p>
            </div>
            <AppBadge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </AppBadge>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {previewHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-border/60 bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-xs font-bold text-foreground">{item.title}</p>
                  </div>
                  <p className="mt-2 text-2xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/50 p-4">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">
              Everything in one place
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Real-time contribution & expense tracking",
                "Automatic receipt (slip) generation with QR codes",
                "Public contributor lookup portal",
                "Exportable PDF & Excel financial reports",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="text-xs text-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppCard>
      <div className="mt-8 mb-2 text-center">
        <p className="text-sm text-muted-foreground font-medium">
          <FileText className="mr-1.5 inline h-4 w-4 text-primary" />
          Built for mandals, trusts, and community committees across India
        </p>
      </div>
    </div>
  );
};

export default DashboardPreview;
