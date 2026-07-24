import {
  AppButton,
  AppCard,
  AppPageHero,
  AppSectionHeader,
  AppCTASection,
  AppIconBadge,
} from "@/components/common";
import { Check, ChevronRight, Calendar, Users, IndianRupee, Receipt, FileText, Building2, Shield, Search, UserCheck, Wallet, ArrowRight, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";

const featureHighlights = [
  {
    title: "Festival Management",
    description: "Create and manage festivals with budgets, timelines, and real-time progress tracking across your organization.",
    icon: Calendar,
    details: [
      "Set up festivals with custom budgets and timelines",
      "Track progress in real-time against your goals",
      "Manage multiple festivals simultaneously",
      "Assign team members to specific festivals",
    ],
  },
  {
    title: "Contributor Profiles",
    description: "Maintain detailed profiles with auto-generated codes, categories, contribution history, and contact information.",
    icon: Users,
    details: [
      "Auto-generated unique contributor IDs",
      "Categorize contributors by type or group",
      "Full contribution history at a glance",
      "Contact information and communication logs",
    ],
  },
  {
    title: "Contribution Tracking",
    description: "Record cash and in-kind donations with status workflow, multiple payment modes, and automatic receipt generation.",
    icon: IndianRupee,
    details: [
      "Support for cash, cheque, UPI, and bank transfers",
      "Automatic receipt generation with unique IDs",
      "Pending/collected status workflow",
      "Bulk contribution entry for events",
    ],
  },
  {
    title: "Expense Management",
    description: "Track categorized expenses with payment tracking and approval workflow.",
    icon: Receipt,
    details: [
      "Categorize expenses by type (Mahaprasad, Decoration, etc.)",
      "Track paid/unpaid status for each expense",
      "Attach bills and receipts digitally",
      "Expense approval workflow for accountability",
    ],
  },
  {
    title: "PDF Receipts & Reports",
    description: "Generate professional contribution slips and comprehensive festival financial reports with one click.",
    icon: FileText,
    details: [
      "Professional PDF receipts for every contribution",
      "Customizable receipt templates with your branding",
      "One-click festival financial reports",
      "Export data to Excel for offline analysis",
    ],
  },
  {
    title: "Multi-Organization Support",
    description: "Serve multiple mandals, trusts, and committees from a single platform with complete data isolation.",
    icon: Building2,
    details: [
      "Complete data isolation between organizations",
      "Custom branding per organization",
      "Centralized or decentralized management",
      "Cross-organization reporting for admins",
    ],
  },
];

const additionalFeatures = [
  {
    title: "JWT Authentication",
    description: "Secure token-based authentication with automatic refresh and rotation for maximum security.",
    icon: Shield,
  },
  {
    title: "Role-Based Access",
    description: "Granular permissions for Admin, Viewer, and Super Admin roles to control data access.",
    icon: UserCheck,
  },
  {
    title: "Data Isolation",
    description: "Complete separation of data between organizations at the database level for privacy.",
    icon: Building2,
  },
  {
    title: "Private Contributor Lookup",
    description: "Encrypted lookup keys protect contributor privacy while allowing self-service history check.",
    icon: Search,
  },
  {
    title: "Digital Wallet",
    description: "Track balances across festivals and organizations with real-time updates.",
    icon: Wallet,
  },
  {
    title: "Smart Search",
    description: "Quickly find contributors, transactions, and receipts with powerful search.",
    icon: Search,
  },
];

const Features = () => {
  return (
    <div className="bg-background">
      {/* Hero */}
      <AppPageHero
        badge={
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Powerful Features
          </span>
        }
        badgeIcon={<Star className="h-4 w-4 text-primary" />}
        title={
          <>
            Everything you need to manage{" "}
            <span className="gradient-text">festival finances</span>
          </>
        }
        description="From contributions to expenses, billing to reports — FestivalFund brings your entire financial workflow into one elegant platform."
        actions={
          <>
            <Link to="/signup">
              <AppButton size="lg" rightIcon={<ChevronRight className="h-4 w-4" />}>
                Start Free Trial
              </AppButton>
            </Link>
            <Link to="/contact">
              <AppButton variant="secondary" size="lg">
                Contact Sales
              </AppButton>
            </Link>
          </>
        }
      />

      {/* Detailed Features */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AppSectionHeader
            badge="Feature Details"
            title="Deep dive into every feature"
            subtitle="Every tool is built specifically for Indian festival management workflows."
          />
          <div className="mt-14 space-y-16">
            {featureHighlights.map((feature, i) => {
              const Icon = feature.icon;
              const isReversed = i % 2 === 1;
              return (
                <div key={i} className={`flex flex-col gap-8 md:flex-row ${isReversed ? "md:flex-row-reverse" : ""} items-center`}>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3.5">
                      <AppIconBadge icon={<Icon className="h-5 w-5" />} colorIndex={i} size="lg" />
                      <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    <ul className="space-y-2.5">
                      {feature.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2.5 text-sm font-medium text-foreground/90">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <AppCard className="flex-1 w-full p-6 sm:p-8 border-border/60 bg-card/90">
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground mb-5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-foreground">{feature.title}</span>
                    </div>
                    <div className="space-y-3">
                      {feature.details.slice(0, 3).map((detail) => (
                        <div key={detail} className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/40 p-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </AppCard>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AppSectionHeader
            badge="More Features"
            title="Plus everything else you need"
            subtitle="Security, flexibility, and scalability built into every layer."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <AppCard key={i} className="group overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg p-5 bg-card/80 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <AppIconBadge icon={<Icon className="h-4.5 w-4.5" />} colorIndex={i} size="sm" />
                    <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </AppCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AppCTASection
        title="Ready to simplify your festival management?"
        description="Join thousands of organizations managing their festival finances with clarity and trust."
      >
        <Link to="/signup">
          <AppButton size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Get Started Free
          </AppButton>
        </Link>
        <Link to="/contact">
          <AppButton variant="outline" size="lg">
            Talk to Sales
          </AppButton>
        </Link>
      </AppCTASection>
    </div>
  );
};

export default Features;
