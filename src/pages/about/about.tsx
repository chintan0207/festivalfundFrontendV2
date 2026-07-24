import {
  AppBadge,
  AppButton,
  AppCard,
  AppPageHero,
  AppSectionHeader,
  AppCTASection,
  AppIconBadge,
} from "@/components/common";
import { Star, Heart, Shield, Users, Target, Eye, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const stats = [
  { value: "100+", label: "Organizations" },
  { value: "₹5Cr+", label: "Funds Managed" },
  { value: "50K+", label: "Contributors" },
  { value: "99.9%", label: "Uptime" },
];

const values = [
  {
    title: "Transparency",
    description: "Every financial record is clear, traceable, and reportable. We believe trust is built through openness.",
    icon: Eye,
  },
  {
    title: "Community First",
    description: "Built for Indian mandals, trusts, and committees. Every feature is designed with their needs in mind.",
    icon: Heart,
  },
  {
    title: "Security",
    description: "Bank-level encryption and data isolation ensure every organization's financial data stays protected.",
    icon: Shield,
  },
  {
    title: "Inclusivity",
    description: "Simple enough for small mandals, powerful enough for large organizations. Technology for everyone.",
    icon: Users,
  },
];

const team = [
  { name: "Rajesh Mehta", role: "Founder & CEO", initials: "RM" },
  { name: "Priya Sharma", role: "Chief Technology Officer", initials: "PS" },
  { name: "Amit Verma", role: "Head of Product", initials: "AV" },
  { name: "Sneha Patel", role: "Community Manager", initials: "SP" },
];

const About = () => {
  return (
    <div className="bg-background">
      {/* Hero */}
      <AppPageHero
        badge={
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            About Us
          </span>
        }
        badgeIcon={<Star className="h-4 w-4 text-primary" />}
        title={
          <>
            Building trust through{" "}
            <span className="gradient-text">financial clarity</span>
          </>
        }
        description="FestivalFund was founded with a simple mission: help Indian community organizations manage their festival finances with transparency and ease."
      />

      {/* Stats */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <AppCard key={stat.label} className="border-border/60 text-center p-6 bg-card/80">
                <p className="text-3xl font-extrabold gradient-text">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </AppCard>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <AppBadge className="mb-4 w-fit">Our Mission</AppBadge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Empowering every festival with modern financial tools</h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                For generations, Indian festivals have been managed through notebooks and ledgers. We're bringing these traditions into the digital age — without losing the human touch.
              </p>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Our platform serves Ganesh Utsav mandals, Navratri committees, temple trusts, and community NGOs across India, helping them manage contributions, track expenses, and generate transparent reports.
              </p>
            </div>
            <AppCard className="border-border/60 p-8 text-center bg-card/90">
              <Target className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-bold text-foreground">Our Vision</h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                A world where every community festival has the financial transparency and management tools it deserves — preserving traditions while embracing technology.
              </p>
            </AppCard>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AppSectionHeader
            badge="Our Values"
            title="What drives us every day"
            subtitle="These core principles guide every decision we make at FestivalFund."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <AppCard key={i} className="border-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg p-5 bg-card/80 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <AppIconBadge icon={<Icon className="h-5 w-5" />} colorIndex={i} />
                    <h3 className="text-base font-semibold text-foreground">{v.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </AppCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AppSectionHeader
            badge="Our Team"
            title="Meet the people behind FestivalFund"
            subtitle="A passionate team dedicated to serving India's festival communities."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <AppCard key={i} className="border-border/60 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg p-6 bg-card/90">
                <AppIconBadge
                  icon={member.initials}
                  colorIndex={i}
                  size="lg"
                  className="mx-auto rounded-full text-lg font-bold"
                />
                <h3 className="mt-4 text-base font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </AppCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AppCTASection
        title="Join us in transforming festival management"
        description="Start your journey with FestivalFund today. Free to start, ready to scale."
      >
        <Link to="/signup">
          <AppButton size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Get Started
          </AppButton>
        </Link>
        <Link to="/contact">
          <AppButton variant="outline" size="lg">
            Contact Us
          </AppButton>
        </Link>
      </AppCTASection>
    </div>
  );
};

export default About;
