import { AppBadge } from "@/components/common/AppBadge";
import { Card, CardContent } from "@/components/ui/card";
import { iconGradients } from "@/lib/data/landingPageData";
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
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 via-chart-2/10 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="mb-5 mx-auto w-fit">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                About Us
              </span>
            </AppBadge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Building trust through
              <br />
              <span className="gradient-text">financial clarity</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              FestivalFund was founded with a simple mission: help Indian community organizations manage their festival finances with transparency and ease.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50 text-center">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <AppBadge className="mb-4 w-fit">Our Mission</AppBadge>
              <h2 className="text-3xl font-bold tracking-tight">Empowering every festival with modern financial tools</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                For generations, Indian festivals have been managed through notebooks and ledgers. We're bringing these traditions into the digital age — without losing the human touch.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Our platform serves Ganesh Utsav mandals, Navratri committees, temple trusts, and community NGOs across India, helping them manage contributions, track expenses, and generate transparent reports.
              </p>
            </div>
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <Target className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-4 text-xl font-bold">Our Vision</h3>
                <p className="mt-2 text-muted-foreground">
                  A world where every community festival has the financial transparency and management tools it deserves — preserving traditions while embracing technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <AppBadge className="mb-3 mx-auto w-fit">Our Values</AppBadge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What drives us every day</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              These core principles guide every decision we make at FestivalFund.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Card key={i} className="border-border/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-white ${iconGradients[i]}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <AppBadge className="mb-3 mx-auto w-fit">Our Team</AppBadge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet the people behind FestivalFund</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              A passionate team dedicated to serving India's festival communities.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Card key={i} className="border-border/50 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white ${iconGradients[i]}`}>
                    {member.initials}
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-24 sm:px-6">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/15 via-chart-2/15 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-3xl border border-border/50 bg-background/60 p-10 text-center shadow-xl backdrop-blur-xl sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Join us in transforming festival management</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Start your journey with FestivalFund today. Free to start, ready to scale.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03]"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-border/50 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
