import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { Card, CardContent } from "@/components/ui/card";
import { features, iconGradients } from "@/lib/data/landingPageData";
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
    color: "#10b981",
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
    color: "#6366f1",
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
    color: "#f59e0b",
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
    color: "#06b6d4",
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
    color: "#8b5cf6",
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
    color: "#ef4444",
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
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 via-chart-2/10 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="mb-5 mx-auto w-fit">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Powerful Features
              </span>
            </AppBadge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Everything you need to manage
              <br />
              <span className="gradient-text">festival finances</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              From contributions to expenses, billing to reports — FestivalFund brings your entire financial workflow into one elegant platform.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup">
                <AppButton size="lg" rightIcon={<ChevronRight className="h-4 w-4" />}>
                  Start Free Trial
                </AppButton>
              </Link>
              <Link to="/#features">
                <AppButton variant="secondary" size="lg">
                  View Demo
                </AppButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <AppBadge className="mb-3 mx-auto w-fit">Feature Details</AppBadge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Deep dive into every feature</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Every tool is built specifically for Indian festival management workflows.
            </p>
          </div>
          <div className="mt-14 space-y-16">
            {featureHighlights.map((feature, i) => {
              const Icon = feature.icon;
              const isReversed = i % 2 === 1;
              return (
                <div key={i} className={`flex flex-col gap-8 md:flex-row ${isReversed ? "md:flex-row-reverse" : ""} items-center`}>
                  <div className="flex-1 space-y-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${iconGradients[i]}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Card className="flex-1 w-full" style={{ borderTopColor: feature.color, borderTopWidth: 3 }}>
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground">{feature.title}</span>
                      </div>
                      <div className="space-y-3">
                        {feature.details.slice(0, 3).map((detail) => (
                          <div key={detail} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <AppBadge className="mb-3 mx-auto w-fit">More Features</AppBadge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Plus everything else you need</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Security, flexibility, and scalability built into every layer.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={i} className="group overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <CardContent className="p-5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${iconGradients[i % iconGradients.length]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-24 sm:px-6">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/15 via-chart-2/15 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-3xl border border-border/50 bg-background/60 p-10 text-center shadow-xl backdrop-blur-xl sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to simplify your festival management?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join thousands of organizations managing their festival finances with clarity and trust.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03]"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-border/50 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/50"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
