import { AppSectionHeader, AppCard, AppIconBadge } from "@/components/common";
import { testimonials } from "@/lib/data/landingPageData";

const TestimonialsSection = () => {
  return (
    <section id="reviews" className="bg-muted/30 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <AppSectionHeader
          badge="Testimonials"
          title="Loved by organizations across India"
          subtitle="See why thousands of trusts, temples, and NGOs choose FestivalFund."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <AppCard key={i} className="border-border/60 p-5 bg-card/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="mb-3 flex gap-1 text-amber-500">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3 pt-2 border-t border-border/40">
                <AppIconBadge
                  icon={t.author.split(" ").map((n) => n[0]).join("")}
                  colorIndex={i}
                  size="sm"
                  className="rounded-full text-xs font-bold"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </AppCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
