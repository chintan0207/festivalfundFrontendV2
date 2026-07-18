import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const CTASection = () => {
  return (
    <section className="relative px-4 py-24 sm:px-6">
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/15 via-chart-2/15 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-5xl">
        <div className="rounded-3xl border border-border/50 bg-background/60 p-10 text-center shadow-xl backdrop-blur-xl sm:p-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Give your festival the finance platform it deserves
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join thousands of organizations collecting with confidence. Free to start,
            ready to scale.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03]"
            >
              Create your organization <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-border/50 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
