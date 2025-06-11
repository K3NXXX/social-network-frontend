export interface MessageData {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  sender?: UserPreview;
  senderId?: string;
  isRead?: boolean;
  chatId?: string;
}

//чат зі списку чатів (GET /chat/i)
export interface ChatPreview {
  chatId: string;
  name: string | null;
  isGroup: boolean;
  lastMessage: MessageData | null;
  participants: UserPreview[];
}

//чат з івента chat_created
export interface ChatPreview_ChatCreated {
  id: string;
  name: string | null;
  isGroup: boolean;
  messages: MessageData[];
  participants: {
    user: UserPreview;
  }[];
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
  isOnline?: boolean;
  isActive?: string;
}
