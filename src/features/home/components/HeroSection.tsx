import { useState } from "react";
import { AppButton } from "@/components/common/AppButton";
import { Wallet, IndianRupee, TrendingUp, Star } from "lucide-react";
import { heroContent } from "./Content";
import { AppBadge } from "@/components/common/AppBadge";

const HeroSection = () => {
  const [content] = useState(heroContent);

  return (
    <section className="w-full bg-background text-foreground">
      <div className="container mx-auto px-4 grid gap-12 lg:grid-cols-2 items-center">
        {/* LEFT CONTENT */}
        <div className="space-y-5 text-center lg:text-left">
          <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="w-fit">
            {content.badge}
          </AppBadge>

          <h1 className="text-fluid-3xl font-bold leading-tight">
            {content.titleLine1}
            <br />
            for <span className="text-primary">{content.titleHighlight}</span>
          </h1>

          <p className="text-fluid-base text-muted-foreground max-w-xl">
            {content.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <AppButton>{content.buttons.primary}</AppButton>

            <AppButton variant="secondary">
              {content.buttons.secondary}
            </AppButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 max-w-md">
            {content.stats.map((item, index) => (
              <div key={index}>
                <h3 className="text-fluid-xl font-bold">{item.value}</h3>

                <p className="text-muted-foreground text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARDS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {content.cards.map((card, index) => (
            <div
              key={index}
              className="bg-card border rounded-xl shadow-md p-5 w-44 hover:scale-105 transition"
            >
              <div className="text-muted-foreground text-xs flex items-center gap-1">
                {index === 1 ? <TrendingUp size={14} /> : <Wallet size={14} />}
                {card.title}
              </div>

              <h3 className="text-xl font-bold mt-2 flex items-center gap-1">
                <IndianRupee size={16} />
                {card.amount}
              </h3>

              <p className="text-xs text-muted-foreground mt-2">{card.meta1}</p>

              <p className="text-xs text-muted-foreground">{card.meta2}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
