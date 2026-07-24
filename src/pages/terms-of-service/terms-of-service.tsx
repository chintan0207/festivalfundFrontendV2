import { AppPageHero } from "@/components/common";
import { FileText, Star } from "lucide-react";

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using FestivalFund, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all visitors, users, and others who access or use our service.",
  },
  {
    title: "Description of Service",
    content: "FestivalFund provides a web-based platform for festival financial management, including contribution tracking, expense management, receipt generation, and reporting. We reserve the right to modify, suspend, or discontinue any aspect of the service with reasonable notice.",
  },
  {
    title: "User Accounts",
    content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information during registration. You must notify us immediately of any unauthorized use of your account.",
  },
  {
    title: "Organization Responsibilities",
    content: "Organizations using FestivalFund are responsible for ensuring compliance with applicable laws regarding financial record-keeping and data protection. Organizations must obtain necessary consents from contributors for data collection and processing.",
  },
  {
    title: "Payment Terms",
    content: "Paid plans are billed monthly or annually as selected. All payments are non-refundable except as expressly stated. We may change our fees with 30 days notice. Non-payment may result in service suspension or account termination.",
  },
  {
    title: "Acceptable Use",
    content: "You agree not to use the platform for any unlawful purpose or in violation of any applicable laws. You may not attempt to breach platform security, upload malicious code, or interfere with other users' access to the service.",
  },
  {
    title: "Data Ownership",
    content: "You retain all rights to your data. FestivalFund claims no ownership over the data you input. We may use aggregated, anonymized data for platform improvement. Upon termination, you may export your data within 30 days.",
  },
  {
    title: "Limitation of Liability",
    content: "FestivalFund shall not be liable for indirect, incidental, special, consequential, or punitive damages. Our total liability for any claim arising from the use of our platform is limited to the amount paid by you in the 12 months preceding the claim.",
  },
  {
    title: "Termination",
    content: "Either party may terminate the agreement at any time. We may suspend or terminate access for violation of these terms. Upon termination, your right to use the service ceases immediately. Data will be available for export for 30 days after termination.",
  },
  {
    title: "Changes to Terms",
    content: "We reserve the right to modify these terms at any time. Material changes will be communicated via email or platform notification. Continued use after changes constitutes acceptance of the new terms. Review these terms periodically.",
  },
];

const TermsOfService = () => {
  return (
    <div className="bg-background">
      <AppPageHero
        badge={
          <span className="inline-flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Terms of Service
          </span>
        }
        badgeIcon={<Star className="h-4 w-4 text-primary" />}
        title={
          <>
            Terms of <span className="gradient-text">Service</span>
          </>
        }
        description="Last updated: January 1, 2025"
      />

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-muted-foreground leading-relaxed">
            Please read these Terms of Service carefully before using the FestivalFund platform. These terms govern your use of our services and form a binding agreement between you and FestivalFund.
          </p>
          <div className="mt-10 space-y-8">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-foreground">
                  <span className="gradient-text">{i + 1}.</span> {section.title}
                </h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
