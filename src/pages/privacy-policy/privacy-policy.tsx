import { AppBadge } from "@/components/common/AppBadge";
import { Shield, Star } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly to us, including organization details, admin information (name, email, phone), contributor data (name, contact, contribution history), and financial records. We also automatically collect usage data such as IP address, browser type, and pages visited to improve our service.",
  },
  {
    title: "How We Use Your Information",
    content: "We use your information to provide and maintain our festival management services, process contributions and generate receipts, send administrative communications, improve and personalize user experience, comply with legal obligations, and prevent fraud or abuse of our platform.",
  },
  {
    title: "Data Security",
    content: "We implement industry-standard security measures including encryption at rest and in transit, secure JWT-based authentication with automatic token rotation, role-based access control, complete data isolation between organizations, regular security audits, and automated daily backups to protect your data.",
  },
  {
    title: "Data Sharing & Disclosure",
    content: "We do not sell your personal information. We may share data with service providers who assist in operating our platform (subject to confidentiality agreements), when required by law or to protect our rights, or with your explicit consent. Contributor data is never shared across organizations.",
  },
  {
    title: "Data Retention",
    content: "We retain your data for as long as your account is active or as needed to provide services. Upon account deletion, we delete or anonymize your data within 30 days unless legal retention requirements apply. Backup data is purged within 90 days.",
  },
  {
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal data, withdraw consent at any time, request data portability, and object to certain data processing. To exercise these rights, contact us at privacy@festivalfund.com. We will respond within 30 days.",
  },
  {
    title: "Cookies",
    content: "We use essential cookies for authentication and security, analytics cookies to understand platform usage, and preference cookies to remember your settings. You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.",
  },
  {
    title: "Children's Privacy",
    content: "Our services are not directed to individuals under 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal data, we will delete it immediately.",
  },
  {
    title: "Changes to This Policy",
    content: "We may update this privacy policy from time to time. We will notify users of material changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "Contact Us",
    content: "For questions about this privacy policy or our data practices, contact us at privacy@festivalfund.com or write to FestivalFund, Mumbai, Maharashtra, India. We will respond to your inquiry within 24 hours.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 via-chart-2/10 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <div className="text-center">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="mb-5 mx-auto w-fit">
              <span className="inline-flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy Policy
              </span>
            </AppBadge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Last updated: January 1, 2025
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              At FestivalFund, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using FestivalFund, you consent to the practices described in this policy.
            </p>
          </div>
          <div className="mt-10 space-y-8">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold">
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

export default PrivacyPolicy;
