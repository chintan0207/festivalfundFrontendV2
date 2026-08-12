import { useState } from "react";
import { Search, CheckCircle2, Download, Sparkles } from "lucide-react";
import { useFestivalStore } from "@/store/festivalStore";

export const QuickReceiptLookup = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const { contributions } = useFestivalStore();

  const matched = query.trim()
    ? contributions.find(
        (c) =>
          c.receiptNo.toLowerCase() === query.trim().toLowerCase() ||
          c.contributorName.toLowerCase().includes(query.trim().toLowerCase())
      )
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <section className="py-12 bg-muted/30 border-y border-border/60">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Public Transparency Portal</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Quick Receipt & Contribution Verification
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Verify any festival contribution instant receipt status by entering your Receipt Number or Name below.
        </p>

        {/* SEARCH FORM */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="e.g. REC-2025-001 or Contributor Name"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/50 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
          >
            Verify
          </button>
        </form>

        {/* RESULT CARD */}
        {searched && (
          <div className="max-w-md mx-auto text-left animate-fade-up">
            {matched ? (
              <div className="p-5 rounded-2xl bg-card border border-emerald-500/40 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>VERIFIED CONTRIBUTION</span>
                  </div>
                  <span className="font-mono text-2xs font-extrabold text-muted-foreground">
                    {matched.receiptNo}
                  </span>
                </div>

                <div className="space-y-1 pt-1 border-t border-border/60">
                  <p className="text-sm font-extrabold text-foreground">{matched.contributorName}</p>
                  <p className="text-xs text-emerald-600 font-extrabold font-mono">
                    ₹{matched.amount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    Date: {matched.date} | Payment Mode: {matched.paymentMode || "CASH"}
                  </p>
                </div>

                <button
                  onClick={() => alert(`Downloading Receipt ${matched.receiptNo}...`)}
                  className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Digital Receipt PDF</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-card border border-border text-center text-xs text-muted-foreground">
                No matching contribution receipt found for "{query}". Try checking the receipt number.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default QuickReceiptLookup;
