/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadService } from "./upload.service";

export const useUploadSingle = () => {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      UploadService.uploadSingle(file, folder),
    onSuccess: (res) => {
      toast.success(res.message || "File uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "File upload failed");
    },
  });
};

export const useUploadMultiple = () => {
  return useMutation({
    mutationFn: ({ files, folder }: { files: File[]; folder?: string }) =>
      UploadService.uploadMultiple(files, folder),
    onSuccess: (res) => {
      toast.success(res.message || "Files uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Files upload failed");
    },
  });
};

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: (fileUrl: string) => UploadService.deleteFile(fileUrl),
    onSuccess: (res) => {
      toast.success(res.message || "File removed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove file");
    },
  });
};
