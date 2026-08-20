import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Phone, KeyRound, Mail, CheckCircle2, XCircle, Receipt } from "lucide-react";
import { toast } from "sonner";
import { AppButton, AppCard, AppInput, AppPageHero } from "@/components/common";
import {
  PublicLookupService,
  type LookupMethod,
  type PublicLookupData,
  type PublicLookupPayload,
} from "@/api/public/publicLookup.service";
import { isValidPhone, sanitizePhone } from "@/lib/phone";
import { ResultHeader } from "./components/ResultHeader";
import { MembersList } from "./components/MembersList";
import { OrganizationSection } from "./components/OrganizationSection";

type InitialQuery = { phone?: string; key?: string; email?: string };

interface ContributorLookupPageProps {
  initialQuery?: InitialQuery;
}

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: PublicLookupData; message: string };

const methodConfig: {
  id: LookupMethod;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  hint: string;
}[] = [
  {
    id: "phone",
    label: "Phone",
    icon: <Phone className="h-4 w-4" />,
    placeholder: "10-digit mobile number",
    hint: "Enter the mobile number used at the time of contribution.",
  },
  {
    id: "key",
    label: "Contributor Key",
    icon: <KeyRound className="h-4 w-4" />,
    placeholder: "Paste your contributor key",
    hint: "Share the verification key printed on your receipt.",
  },
  {
    id: "email",
    label: "Email",
    icon: <Mail className="h-4 w-4" />,
    placeholder: "e.g. name@example.com",
    hint: "Enter the email used to register your contributions.",
  },
];

function ContributorLookupPage({ initialQuery }: ContributorLookupPageProps) {
  const initialMethod: LookupMethod = initialQuery?.phone
    ? "phone"
    : initialQuery?.key
      ? "key"
      : initialQuery?.email
        ? "email"
        : "phone";

  const initialValue =
    initialQuery?.phone ?? initialQuery?.key ?? initialQuery?.email ?? "";

  const [method, setMethod] = useState<LookupMethod>(initialMethod);
  const [query, setQuery] = useState(initialValue);
  const [lookupState, setLookupState] = useState<LookupState>({ status: "idle" });
  const [lastPayload, setLastPayload] = useState<PublicLookupPayload | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeConfig = useMemo(
    () => methodConfig.find((config) => config.id === method) ?? methodConfig[0],
    [method],
  );

  useEffect(() => {
    if (initialValue) {
      void handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch() {
    const rawValue = query.trim();
    if (!rawValue) {
      setLookupState({ status: "error", message: "Please enter a value to search." });
      return;
    }

    const value = method === "phone" ? sanitizePhone(rawValue) : rawValue;

    if (method === "phone" && !isValidPhone(value)) {
      setLookupState({
        status: "error",
        message: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    setLookupState({ status: "loading" });

    const payload =
      method === "phone"
        ? { phoneNumber: value }
        : method === "key"
          ? { globalContributorKey: value }
          : { email: value };

    try {
      const response = await PublicLookupService.lookupContributor(payload);

      if (!response.success || !response.data) {
        setLookupState({
          status: "error",
          message: response.message || "Lookup failed. Please check the details and try again.",
        });
        return;
      }

      setLookupState({
        status: "success",
        data: response.data,
        message: response.message,
      });
      setLastPayload(payload);
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((error as any).response?.data?.message as string | undefined)
          : undefined;

      setLookupState({
        status: "error",
        message: message || "Something went wrong. Please try again.",
      });
    }
  }

  function handleNewSearch() {
    setLookupState({ status: "idle" });
    setQuery("");
    setMethod("phone");
    setLastPayload(null);
    requestAnimationFrame(() => searchInputRef.current?.focus());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDownloadPdf() {
    if (!lastPayload || pdfLoading) return;
    setPdfLoading(true);
    try {
      const blob = await PublicLookupService.downloadResultPdf(lastPayload);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `contribution-statement-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Contribution statement downloaded");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || "Failed to download statement");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="bg-background">
      <AppPageHero
        badge={
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Public Contribution Lookup
          </span>
        }
        title={
          <>
            Verify your <span className="gradient-text">contributions</span>
          </>
        }
        description="Search by phone number, contributor key, or email to view every contribution recorded for the people associated with that number — across all festivals and organizations."
      >
        {/* Search */}
        <div className="mx-auto mt-4 max-w-2xl">
          <AppCard className="border-border/60 bg-card/90 p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-2xl border border-border/60 bg-muted/40 p-1.5">
              {methodConfig.map((config) => {
                const isActive = method === config.id;
                return (
                  <button
                    key={config.id}
                    type="button"
                    onClick={() => {
                      setMethod(config.id);
                      setQuery("");
                      setLookupState({ status: "idle" });
                    }}
                    className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? "border border-border/60 bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {config.icon}
                    {config.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="flex-1">
                <AppInput
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) =>
                    setQuery(
                      method === "phone" ? sanitizePhone(e.target.value) : e.target.value,
                    )
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={activeConfig.placeholder}
                  leftIcon={activeConfig.icon}
                  aria-label={activeConfig.label}
                  inputMode={method === "phone" ? "numeric" : undefined}
                  maxLength={method === "phone" ? 10 : undefined}
                />
              </div>
              <AppButton
                onClick={handleSearch}
                loading={lookupState.status === "loading"}
                leftIcon={<Search className="h-4 w-4" />}
                className="sm:h-10.5"
              >
                Search
              </AppButton>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">{activeConfig.hint}</p>
          </AppCard>
        </div>
      </AppPageHero>

      {/* Results */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {lookupState.status === "loading" && (
            <AppCard className="p-8 text-center">
              <Search className="mx-auto h-8 w-8 animate-pulse text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Looking up contributions...</p>
            </AppCard>
          )}

          {lookupState.status === "error" && (
            <AppCard className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <XCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">No records found</h3>
              <p className="mt-1 text-sm text-muted-foreground">{lookupState.message}</p>
              <p className="mt-2 text-xs text-muted-foreground/80">
                Please check the details and try again.
              </p>
            </AppCard>
          )}

          {lookupState.status === "success" && (
            <div className="space-y-4">
              <ResultHeader
                summary={lookupState.data.summary}
                maskedPhone={lookupState.data.members[0]?.phoneNumber}
                onNewSearch={handleNewSearch}
                onDownloadPdf={handleDownloadPdf}
                downloadingPdf={pdfLoading}
              />
              <MembersList members={lookupState.data.members} />

              {lookupState.data.records.length === 0 ? (
                <AppCard className="p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    Contributor group verified
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lookupState.message || "No contribution records found for this contributor."}
                  </p>
                </AppCard>
              ) : (
                lookupState.data.records.map((record) => (
                  <OrganizationSection
                    key={record.organization.id}
                    record={record}
                    members={lookupState.data.members}
                    lookupPayload={lastPayload}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ContributorLookupPage;