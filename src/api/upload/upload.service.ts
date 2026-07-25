import ApiClient from "../apiClient";

export type UploadResult = {
  url: string;
  key: string;
  provider: string;
  fileName: string;
  size: number;
  mimetype: string;
};

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export const UploadService = {
  uploadSingle: async (file: File, folder: string = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await ApiClient.post<ApiResponse<UploadResult>>("/upload/single", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  uploadMultiple: async (files: File[], folder: string = "general") => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("folder", folder);

    const response = await ApiClient.post<ApiResponse<UploadResult[]>>(
      "/upload/multiple",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  deleteFile: async (fileUrl: string) => {
    const response = await ApiClient.delete<ApiResponse<null>>("/upload", {
      data: { fileUrl },
    });

    return response.data;
  },
};
