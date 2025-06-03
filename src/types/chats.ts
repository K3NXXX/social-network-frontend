export interface MessageData {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  sender: UserPreview;
  isRead?: boolean;
}

//чат зі списку чатів (GET /chat/i)
export interface ChatPreview {
  chatId: string;
  name: string | null;
  isGroup: boolean;
  lastMessage: MessageData | null;
  participants: UserPreviewWithStatus[];
}

//чат (GET /chat/:receiverId)
export interface ChatDetails {
  id: string;
  isGroup: boolean;
  participants: UserPreview[];
}

export interface UserPreview {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  avatarUrl: string | null;
}

export interface UserPreviewWithStatus extends UserPreview {
  isOnline: boolean;
}
