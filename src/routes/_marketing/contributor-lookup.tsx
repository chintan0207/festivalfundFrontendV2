import { createFileRoute } from "@tanstack/react-router";
import ContributorLookupPage from "@/pages/contributor-lookup/contributor-lookup";

export type ContributorLookupSearchParams = {
  phone?: string;
  key?: string;
  email?: string;
};

export const Route = createFileRoute("/_marketing/contributor-lookup")({
  validateSearch: (search: Record<string, unknown>): ContributorLookupSearchParams => ({
    phone: typeof search.phone === "string" ? search.phone : undefined,
    key: typeof search.key === "string" ? search.key : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  component: ContributorLookupRouteComponent,
});

function ContributorLookupRouteComponent() {
  const { phone, key, email } = Route.useSearch();

  return <ContributorLookupPage initialQuery={{ phone, key, email }} />;
}