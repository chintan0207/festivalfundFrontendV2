import { useState } from "react";
import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { AppCard } from "@/components/common/AppCard";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Mail, Phone, MapPin, Clock, Send, ArrowRight } from "lucide-react";
import { iconGradients } from "@/lib/data/landingPageData";

const contactMethods = [
  { icon: Mail, label: "Email", value: "hello@festivalfund.com", description: "We respond within 24 hours" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", description: "Mon-Fri 9 AM to 6 PM IST" },
  { icon: MapPin, label: "Office", value: "Mumbai, Maharashtra, India", description: "By appointment only" },
  { icon: Clock, label: "Hours", value: "Mon-Fri: 9 AM - 6 PM IST", description: "Weekend support available" },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
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
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 via-chart-2/10 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="mb-5 mx-auto w-fit">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Get in Touch
              </span>
            </AppBadge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              We'd love to hear
              <br />
              <span className="gradient-text">from you</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Have a question, feedback, or want to learn more? Reach out and our team will get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="space-y-4 lg:col-span-2">
              {contactMethods.map((method, i) => {
                const Icon = method.icon;
                return (
                  <Card key={i} className="border-border/50 transition-all duration-300 hover:shadow-md">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${iconGradients[i]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{method.label}</p>
                        <p className="text-sm text-muted-foreground">{method.value}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <AppCard title="Send us a message" subtitle="We'll get back to you within 24 hours.">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white ${iconGradients[0]}`}>
                      <Send className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Message Sent!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Thank you for reaching out. Our team will respond within 24 hours.
                    </p>
                    <AppButton className="mt-6" onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </AppButton>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AppInput id="name" label="Your Name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
                      <AppInput id="email" label="Email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <AppInput id="subject" label="Subject" placeholder="How can we help?" value={formData.subject} onChange={handleChange} required />
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <textarea
                        id="message"
                        rows={5}
                        className="h-9 min-h-[120px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-sm transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                        placeholder="Tell us more about your query..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <AppButton type="submit" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Send Message
                    </AppButton>
                  </form>
                )}
              </AppCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
