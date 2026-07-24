/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { AppButton, AppCard, AppPageHero, AppIconBadge } from "@/components/common";
import { Star, Mail, Phone, MapPin, Clock, Send, ArrowRight } from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@festivalfund.com",
    description: "We respond within 24 hours",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    description: "Mon-Fri 9 AM to 6 PM IST",
  },
  // { icon: MapPin, label: "Office", value: "Mumbai, Maharashtra, India", description: "By appointment only" },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon-Fri: 9 AM - 6 PM IST",
    description: "Weekend support available",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-background">
      {/* Hero & Contact Form Grid */}
      <AppPageHero
        badge={
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Get in Touch
          </span>
        }
        badgeIcon={<Star className="h-4 w-4 text-primary" />}
        title={
          <>
            We'd love to hear <span className="gradient-text">from you</span>
          </>
        }
        description="Have a question, feedback, or need help setting up your festival mandal? Reach out and our support team will assist you."
      >
        <div className="mx-auto max-w-6xl pt-6 text-left">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <AppCard
                title="Send us a message"
                subtitle="We'll get back to you within 24 hours."
                className="bg-card/90 border-border/60"
              >
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <AppIconBadge
                      icon={<Send className="h-8 w-8" />}
                      colorIndex={0}
                      size="lg"
                      className="h-16 w-16 shadow-lg mb-2 mx-auto"
                    />
                    <h3 className="mt-4 text-xl font-bold text-foreground">
                      Message Sent!
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                      Thank you for reaching out. Our team will review your query and
                      respond within 24 hours.
                    </p>
                    <AppButton className="mt-6" onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </AppButton>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-foreground"
                        >
                          Your Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm shadow-sm transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground"
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm shadow-sm transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-foreground"
                      >
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm shadow-sm transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-foreground"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm shadow-sm transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                        placeholder="Tell us more about your query..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <AppButton
                      type="submit"
                      className="w-full h-10.5"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Send Message
                    </AppButton>
                  </form>
                )}
              </AppCard>
            </div>
            {/* Contact Info */}
            <div className="space-y-4 lg:col-span-2">
              {contactMethods.map((method, i) => {
                const Icon = method.icon;
                return (
                  <AppCard
                    key={i}
                    className="border-border/60 transition-all duration-300 hover:shadow-md bg-card/90 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <AppIconBadge
                        icon={<Icon className="h-5 w-5" />}
                        colorIndex={i}
                        size="md"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {method.label}
                        </p>
                        <p className="text-sm text-foreground/90 font-medium">
                          {method.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </AppCard>
                );
              })}
            </div>
          </div>
        </div>
      </AppPageHero>
    </div>
  );
};

export default Contact;
