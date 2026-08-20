import { useCurrentUser } from "@/api/auth/useAuth";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import WhyFestivalFund from "./components/WhyFestivalFund";
import HowItWorks from "./components/HowItWorks";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";
import SecuritySection from "./components/SecuritySection";
import MultiTenantSection from "./components/MultiTenantSection";
import CTASection from "./components/CTASection";

const Home = () => {
  useCurrentUser();

  return (
    <div className="bg-background">
      <HeroSection />
      <FeaturesSection />
      <WhyFestivalFund />
      <HowItWorks />
      <PricingSection />
      <TestimonialsSection />
      <SecuritySection />
      <MultiTenantSection />
      <CTASection />
    </div>
  );
};

export default Home;
