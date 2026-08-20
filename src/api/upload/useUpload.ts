/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadService } from "./upload.service";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      UploadService.uploadFile(file, folder),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload file");
    },
  });
};