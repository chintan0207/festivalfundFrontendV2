import ApiClient from "../apiClient";

export type UploadResult = {
  url: string;
  key?: string;
  provider?: string;
  fileName?: string;
  size?: number;
  mimetype?: string;
};

export const UploadService = {
  /** Uploads a single file via POST /upload/single (multipart `file` + `folder`). */
  uploadFile: async (file: File, folder = "general"): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await ApiClient.post<{ data: UploadResult }>(
      "/upload/single",
      formData,
      {
        transformRequest: [(data) => data],
        headers: { "Content-Type": undefined },
      },
    );
    return response.data.data;
  },

  deleteFile: async (fileUrl: string): Promise<void> => {
    await ApiClient.delete("/upload", { data: { fileUrl } });
  },
};