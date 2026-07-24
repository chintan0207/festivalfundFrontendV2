import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { iconGradients } from "@/lib/data/landingPageData";
import { Star, LifeBuoy, Book, MessageCircle, Mail, ChevronRight, ArrowRight, Search, FileText, Users, Settings, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";

const supportCategories = [
  { icon: LifeBuoy, title: "Getting Started", description: "New to FestivalFund? Start here with setup guides.", articles: 12 },
  { icon: Book, title: "Account & Billing", description: "Manage your account, plans, and payment details.", articles: 8 },
  { icon: Users, title: "Managing Contributors", description: "Add, edit, and manage contributor profiles.", articles: 15 },
  { icon: FileText, title: "Contributions & Receipts", description: "Record contributions and generate receipts.", articles: 10 },
  { icon: Settings, title: "Festival Setup", description: "Create and configure festivals and budgets.", articles: 9 },
  { icon: Shield, title: "Security & Permissions", description: "Role management and data security guides.", articles: 6 },
];

const quickLinks = [
  { label: "How to add a contributor", href: "#" },
  { label: "Generating PDF receipts", href: "#" },
  { label: "Setting up your first festival", href: "#" },
  { label: "Managing expenses", href: "#" },
  { label: "Understanding reports", href: "#" },
  { label: "Inviting team members", href: "#" },
];

const Support = () => {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 md:pt-32">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 via-chart-2/10 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="mb-5 mx-auto w-fit">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Help Center
              </span>
            </AppBadge>
            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              How can we{" "}
              <span className="gradient-text">help you?</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Search our knowledge base, browse guides, or reach out to our support team.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full rounded-2xl border border-border/60 bg-background py-4 pl-12 pr-4 text-sm shadow-sm transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <AppBadge className="mb-3 mx-auto w-fit">Browse by Topic</AppBadge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Find the answers you need</h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Explore our comprehensive knowledge base organized by topic.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {supportCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <AppCard key={i} className="group cursor-pointer border-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg p-5 bg-card/80">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ${iconGradients[i % iconGradients.length]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{cat.articles} articles</span>
                  </div>
                  <h3 className="mt-3.5 text-base font-semibold text-foreground">{cat.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Browse Articles <ChevronRight className="h-3 w-3" />
                  </div>
                </AppCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links + Contact */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <AppCard className="border-border/60 p-6 bg-card/90">
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ChevronRight className="h-4 w-4 text-primary" />
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </AppCard>

            <AppCard className="border-border/60 p-6 bg-card/90">
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <MessageCircle className="h-4 w-4 text-primary" />
                Still need help?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Our support team is available to assist you with any questions or issues.
              </p>
              <div className="mt-6 space-y-3">
                <Link to="/contact" className="w-full block">
                  <AppButton className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Contact Support
                  </AppButton>
                </Link>
                <a href="mailto:support@festivalfund.com" className="w-full block">
                  <AppButton variant="outline" className="w-full" leftIcon={<Mail className="h-4 w-4" />}>
                    support@festivalfund.com
                  </AppButton>
                </a>
              </div>
            </AppCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
