import { useState } from "react";
import { AppButton } from "@/components/common/AppButton";
import { AppBadge } from "@/components/common/AppBadge";
import { Wallet, TrendingUp, Receipt, IndianRupee, Star } from "lucide-react";

const heroContent = {
  badge: "Trusted by 500+ Mandals across India",

  titleLine1: "Modern Festival Management",
  titleHighlight: "Every Mandal",

  description:
    "Streamline contributions, track expenses, and generate professional reports for Ganesh Chaturthi, Navratri, Garba, and every community celebration using FestivalFund.",

  buttons: {
    primary: "Start Managing",
    secondary: "Watch Demo",
  },

  stats: [
    { value: "500+", label: "Mandals" },
    { value: "10K+", label: "Contributions" },
    { value: "₹50L+", label: "Funds Managed" },
  ],

  cards: [
    {
      title: "Contributions",
      amount: "12K",
      meta1: "8 Deposited",
      meta2: "3 Pending",
    },
    {
      title: "Festival Budget",
      amount: "23K",
      meta1: "Collected",
      meta2: "Expenses Ongoing",
    },
    {
      title: "Expenses",
      amount: "7K",
      meta1: "Decoration",
      meta2: "Pending Bills",
    },
  ],
};

const HeroSection = () => {
  const [content] = useState(heroContent);

  return (
    <section className="relative w-full bg-background text-foreground py-10 overflow-hidden">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE */}
        <div className="space-y-6 text-center lg:text-left">
          <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="w-fit">
            {content.badge}
          </AppBadge>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            {content.titleLine1}
            <br />
            for <span className="text-primary">{content.titleHighlight}</span>
          </h1>

          <p className="text-muted-foreground max-w-xl text-lg">{content.description}</p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <AppButton size="lg">{content.buttons.primary}</AppButton>

            <AppButton variant="secondary" size="lg">
              {content.buttons.secondary}
            </AppButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 max-w-md mx-auto lg:mx-0">
            {content.stats.map((item, index) => (
              <div key={index}>
                <h3 className="text-2xl font-bold">{item.value}</h3>

                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE CARDS */}
        <div className="relative flex justify-center items-center">
          {/* TOP LEFT */}
          <HeroCard
            title="Contributions"
            amount="12K"
            meta1="8 Deposited"
            meta2="3 Pending"
            icon={<Wallet size={16} />}
            className="absolute -left-10 top-0 rotate-[-8deg]"
          />

          {/* TOP RIGHT */}
          <HeroCard
            title="Festival Budget"
            amount="23K"
            meta1="Collected"
            meta2="Expenses Ongoing"
            icon={<TrendingUp size={16} />}
            className="absolute -right-2 top-0 rotate-[8deg]"
          />

          {/* BOTTOM CENTER */}
          <HeroCard
            title="Expenses"
            amount="7K"
            meta1="Decoration"
            meta2="Pending Bills"
            icon={<Receipt size={16} />}
            className="mt-32  rotate-[2deg]"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

/* CARD COMPONENT */

type HeroCardProps = {
  title: string;
  amount: string;
  meta1: string;
  meta2: string;
  icon: React.ReactNode;
  className?: string;
};

const HeroCard = ({ title, amount, meta1, meta2, icon, className }: HeroCardProps) => {
  return (
    <div
      className={`group w-[220px] bg-card/70 backdrop-blur border border-border rounded-2xl p-6 shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${className}`}
    >
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        {title}
      </div>

      <div className="flex items-center gap-1 text-3xl font-bold mt-3">
        <IndianRupee size={18} />
        {amount}
      </div>

      <div className="mt-3 text-sm text-muted-foreground">{meta1}</div>

      <div className="text-sm text-muted-foreground">{meta2}</div>
    </div>
  );
};
