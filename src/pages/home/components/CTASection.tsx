import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppButton, AppCTASection } from "@/components/common";

const CTASection = () => {
  return (
    <AppCTASection
      title="Give your festival the finance platform it deserves"
      description="Join thousands of organizations collecting with confidence. Free to start, ready to scale."
    >
      <Link to="/signup">
        <AppButton size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Create your organization
        </AppButton>
      </Link>
      <Link to="/login">
        <AppButton variant="outline" size="lg">
          Sign In
        </AppButton>
      </Link>
    </AppCTASection>
  );
};

export default CTASection;
