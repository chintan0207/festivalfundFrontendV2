/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReportService } from "./report.service";

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

export const useDownloadFestivalReportPdf = () => {
  return useMutation({
    mutationFn: (festivalId: string) => ReportService.downloadFestivalPdf(festivalId),
    onSuccess: (blob, festivalId) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `festival-report-${festivalId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Festival report PDF downloaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to download PDF report");
    },
  });
};

export const useDownloadContributionsPdf = () => {
  return useMutation({
    mutationFn: (festivalId?: string) => ReportService.downloadContributionsPdf(festivalId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `contributions-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Contributions PDF downloaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to download contributions PDF");
    },
  });
};

export const useDownloadExpensesPdf = () => {
  return useMutation({
    mutationFn: (festivalId?: string) => ReportService.downloadExpensesPdf(festivalId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expenses-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Expenses PDF downloaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to download expenses PDF");
    },
  });
};
