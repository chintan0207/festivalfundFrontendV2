import axios from "axios";
import { API_BASE_URL } from "../env";

/**
 * Plain client for public endpoints. Unlike `ApiClient` (src/api/apiClient.ts),
 * this never attaches an Authorization header or runs the 401-refresh/logout
 * interceptor, so the lookup works for logged-out visitors.
 */
const publicApiClient = axios.create({
  baseURL: API_BASE_URL || "http://localhost:8081/api",
  headers: { "Content-Type": "application/json" },
});

export type LookupMethod = "phone" | "key" | "email";

export type PublicLookupPayload = {
  phoneNumber?: string;
  globalContributorKey?: string;
  email?: string;
};

export type PublicContributorMember = {
  id: string;
  name: string;
  category?: string | null;
  organization: { id: string; name: string } | null;
  /** Always masked by the server (e.g. "+91 ****1844"). */
  phoneNumber?: string | null;
};

export type PublicFestival = {
  id?: string;
  name?: string;
  year?: number;
  status?: string;
};

export type PublicContribution = {
  contributionId: string;
  contributionCode: string;
  type: "MONEY" | "ITEM";
  status: string;
  paymentMode?: string;
  date: string;
  amount?: number;
  itemName?: string;
  quantity?: number;
  estimatedValue?: number;
  slipPath?: string;
  contributor: {
    id: string;
    name?: string;
    category?: string | null;
  };
};

export type PublicFestivalGroup = {
  festival: PublicFestival;
  contributions: PublicContribution[];
  contributionCount: number;
  latestContributionDate?: string | null;
  totalDeposited: number;
  totalPending: number;
  totalCancelled: number;
  totalMoney: number;
  totalItems: number;
  totalItemValue: number;
};

export type PublicLookupRecord = {
  organization: { id: string; name: string; logoUrl?: string };
  festivals: PublicFestivalGroup[];
  totals: {
    totalContributionCount: number;
    totalDeposited: number;
    totalPending: number;
    totalCancelled: number;
    totalMoney: number;
    totalItems: number;
    totalItemValue: number;
  };
};

export type PublicLookupSummary = {
  memberCount: number;
  organizationCount: number;
  festivalCount: number;
  totalContributions: number;
  totalDeposited: number;
  totalPending: number;
  totalCancelled: number;
  totalMoney: number;
  totalItems: number;
  totalItemValue: number;
  latestContributionDate: string | null;
};

export type PublicLookupData = {
  lookupKey: string;
  members: PublicContributorMember[];
  summary: PublicLookupSummary;
  records: PublicLookupRecord[];
};

export type PublicLookupApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: PublicLookupData;
};

export const PublicLookupService = {
  lookupContributor: async (payload: PublicLookupPayload) => {
    const response = await publicApiClient.post<PublicLookupApiResponse>(
      "/public/contributor-lookup",
      payload,
    );
    return response.data;
  },

  /**
   * Download the whole lookup result as a single PDF statement (backend
   * generated via puppeteer, same identity resolution as the JSON lookup).
   */
  downloadResultPdf: async (payload: PublicLookupPayload): Promise<Blob> => {
    const response = await publicApiClient.post("/public/contributor-lookup/pdf", payload, {
      responseType: "blob",
    });
    return response.data as Blob;
  },
};