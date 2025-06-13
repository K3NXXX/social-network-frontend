export interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: NotificationSender;
  post?: NotificationPost;
}

export interface NotificationSender {
  id: string;
  username: string | null;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface NotificationPost {
  id: string;
  content: string;
  photo: string | null;
}
