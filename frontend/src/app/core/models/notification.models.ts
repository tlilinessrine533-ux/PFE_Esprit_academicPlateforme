export interface NotificationItemResponse {
  id: number;
  title: string;
  messageText: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationOverviewResponse {
  unreadCount: number;
  notifications: NotificationItemResponse[];
}
