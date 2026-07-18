import { AppBadge } from "@/components/common/AppBadge";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials, iconGradients } from "@/lib/data/landingPageData";

const TestimonialsSection = () => {
  return (
    <section id="reviews" className="bg-muted/30 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <AppBadge className="mb-3 mx-auto w-fit">Testimonials</AppBadge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by organizations across India</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            See why thousands of trusts, temples, and NGOs choose FestivalFund.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${iconGradients[i]}`}>
                    {t.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.author}</p>
                    <p className="text-2xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
