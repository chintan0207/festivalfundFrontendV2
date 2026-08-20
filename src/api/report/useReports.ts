/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ReportService,
  type ReportExportParams,
  type ReportExportType,
} from "./report.service";

export const REPORT_QUERY_KEYS = {
  stats: (festivalId: string) => ["reports", "stats", festivalId] as const,
};

export const useFestivalStats = (festivalId: string) => {
  return useQuery({
    queryKey: REPORT_QUERY_KEYS.stats(festivalId),
    queryFn: async () => {
      const res = await ReportService.getFestivalStats(festivalId);
      return res.data;
    },
    enabled: !!festivalId && festivalId !== "ALL",
    staleTime: 60 * 1000,
  });
};

/**
 * Shared backend-driven PDF export for a single Reports tab.
 * Downloads the blob with the given filename and shows loading/error state.
 */
type ReportExportVariables = {
  type: ReportExportType;
  festivalId: string;
  params?: ReportExportParams;
  fileName: string;
};

export const useReportPdfExport = () => {
  return useMutation({
    mutationFn: (variables: ReportExportVariables) =>
      ReportService.exportReport(variables.type, variables.festivalId, variables.params),
    onSuccess: (blob, { fileName }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report exported successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to export report");
    },
  });
};