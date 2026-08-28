import ApiClient from "../apiClient";

export interface AppNotification {
  _id: string;
  organizationId: string;
  recipientUserId: string;
  actorUserId?: string;
  actorName?: string;
  type: string;
  title: string;
  message: string;
  module: string;
  entityType?: string;
  entityId?: string;
  link?: string;
  isRead: boolean;
  readAt?: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  createdAt: string;
}

export interface NotificationResponse {
  docs: AppNotification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export const notificationService = {
  getNotifications: async (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
    const response = await ApiClient.get("/notifications", { params });
    return response.data.data as NotificationResponse;
  },

  getUnreadCount: async () => {
    const response = await ApiClient.get("/notifications/unread-count");
    return response.data.data.unreadCount as number;
  },

  markAsRead: async (id: string) => {
    const response = await ApiClient.patch(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async () => {
    const response = await ApiClient.patch("/notifications/read-all");
    return response.data.data;
  },

  deleteNotification: async (id: string) => {
    const response = await ApiClient.delete(`/notifications/${id}`);
    return response.data.data;
  },
};
