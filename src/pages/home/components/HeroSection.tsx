import { Link } from "@tanstack/react-router";
import { AppButton, AppPageHero } from "@/components/common";
import { Star, ChevronRight } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

const heroContent = {
  badge: "Built for mandals, trusts, and festival committees",

  titleLine1: "Manage festival funds with",
  titleHighlight: "clarity & trust",

  description:
    "Track contributions, manage expenses, generate receipts, and build transparent financial records for your community festivals — all in one platform.",

  buttons: {
    primary: "Start Free Trial",
    secondary: "Explore Features",
  },
};

const HeroSection = () => {
  return (
    <AppPageHero
      badge={
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          {heroContent.badge}
        </span>
      }
      badgeIcon={<Star className="h-4 w-4 text-primary" />}
      title={
        <>
          {heroContent.titleLine1}{" "}
          <span className="gradient-text">{heroContent.titleHighlight}</span>
        </>
      }
      description={heroContent.description}
      actions={
        <>
          <Link to="/signup">
            <AppButton size="lg" rightIcon={<ChevronRight className="h-4 w-4" />}>
              {heroContent.buttons.primary}
            </AppButton>
          </Link>

          <Link to="/features">
            <AppButton variant="secondary" size="lg">
              {heroContent.buttons.secondary}
            </AppButton>
          </Link>
        </>
      }
    >
      <DashboardPreview />
    </AppPageHero>
  );
};

export default HeroSection;
