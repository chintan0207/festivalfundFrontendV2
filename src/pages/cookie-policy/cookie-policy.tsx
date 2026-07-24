import { AppPageHero } from "@/components/common";
import { Cookie, Star } from "lucide-react";

const sections = [
  {
    title: "What Are Cookies",
    content: "Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, authenticate your session, and understand how you interact with the platform. FestivalFund uses cookies to provide a secure and personalized experience.",
  },
  {
    title: "Essential Cookies",
    content: "These cookies are necessary for the platform to function properly. They enable core features such as secure login, session management, and account security. Essential cookies cannot be disabled. Without these cookies, certain parts of the platform may not function correctly.",
    examples: ["Session authentication tokens", "CSRF protection tokens", "Security and fraud prevention"],
  },
  {
    title: "Functional Cookies",
    content: "Functional cookies remember your preferences and choices to enhance your experience. These cookies allow us to personalize the platform based on your settings.",
    examples: ["Theme preference (light/dark mode)", "Language and regional settings", "Dashboard layout preferences"],
  },
  {
    title: "Analytics Cookies",
    content: "We use analytics cookies to understand how users interact with our platform. This helps us improve features, identify issues, and optimize performance. Analytics data is aggregated and anonymized.",
    examples: ["Page visit counts and navigation patterns", "Feature usage statistics", "Error and performance monitoring"],
  },
  {
    title: "Third-Party Cookies",
    content: "We use minimal third-party services that may set cookies on your device. These include our analytics provider and CDN services. We carefully vet all third-party services for privacy compliance.",
    examples: ["CDN performance cookies", "Analytics service cookies"],
  },
  {
    title: "Cookie Management",
    content: "You can control and manage cookies in your browser settings. Most browsers allow you to block or delete cookies. However, disabling certain cookies may affect platform functionality. You can also use browser privacy modes to limit cookie storage.",
  },
  {
    title: "Your Consent",
    content: "By continuing to use FestivalFund, you consent to our use of cookies as described in this policy. When you first visit our platform, you will see a cookie notice with options to customize your preferences. You can change your preferences at any time.",
  },
  {
    title: "Updates to This Policy",
    content: "We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes through the platform or via email. Continued use after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "Contact Us",
    content: "If you have questions about our use of cookies, please contact us at privacy@festivalfund.com or write to FestivalFund, Mumbai, Maharashtra, India.",
  },
];

const CookiePolicy = () => {
  return (
    <div className="bg-background">
      <AppPageHero
        badge={
          <span className="inline-flex items-center gap-2">
            <Cookie className="h-4 w-4" />
            Cookie Policy
          </span>
        }
        badgeIcon={<Star className="h-4 w-4 text-primary" />}
        title={
          <>
            Cookie <span className="gradient-text">Policy</span>
          </>
        }
        description="Last updated: January 1, 2025"
      />

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-muted-foreground leading-relaxed">
            This Cookie Policy explains how FestivalFund uses cookies and similar tracking technologies to recognize you when you visit our platform. Understanding these technologies helps you make informed choices about your privacy.
          </p>
          <div className="mt-10 space-y-8">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-foreground">
                  <span className="gradient-text">{i + 1}.</span> {section.title}
                </h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{section.content}</p>
                {"examples" in section && (
                  <ul className="mt-3 space-y-1.5">
                    {(section as typeof sections[0] & { examples: string[] }).examples.map((example) => (
                      <li key={example} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
