import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { userService } from '../../services/userService';
import type { Notification } from '../../types/notifications';

interface NotificationState {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  unreadNotifications: Notification[];
  socket: Socket | null;
  initSocket: (userId: string) => void;
  markOneAsRead: (id: string) => Promise<void>;
  disconnectSocket: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  socket: null,

  fetchNotifications: async () => {
    try {
      const result = await userService.getUserNotifications();
      set({ notifications: result });
    } catch (err) {
      console.error('error fetching notifications', err);
      set({ notifications: [] });
    }
  },

  markAllAsRead: async () => {
    try {
      await userService.markAllAsRead();
      const current = get().notifications || [];
      const updated = current.map((n) => ({ ...n, isRead: true }));
      set({ notifications: updated });
    } catch (err) {
      console.error('error marking all as read', err);
    }
  },

  markOneAsRead: async (id: string) => {
    try {
      await userService.markOneAsRead(id);
      const current = get().notifications || [];
      const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      set({ notifications: updated });
    } catch (err) {
      console.error('error marking one as read', err);
    }
  },

  get unreadNotifications() {
    const notifications = get().notifications;
    return notifications ? notifications.filter((n) => !n.isRead) : [];
  },

  initSocket: (userId: string) => {
    if (get().socket) return;
    const socket = io('https://vetra-8c5dfe3bdee7.herokuapp.com', {
      path: '/socket.io',
      query: { userId },
      withCredentials: true,
      auth: {
        token: localStorage.getItem('accessToken'),
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('notification', async (notification: Notification) => {
      if (!notification.sender) {
        console.warn('notification without sender, refetching all notifications', notification);
        await get().fetchNotifications();
        return;
      }

      const current = get().notifications || [];
      set({ notifications: [notification, ...current] });
    });

    socket.on('disconnect', (reason) => {
      console.warn('🛑 Socket disconnected, reason:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('🚨 Socket connect_error:', err);
    });

    socket.on('error', (err) => {
      console.error('❗ Socket error:', err);
    });
    set({ socket });
  },
  disconnectSocket: () => {
    const sock = get().socket;
    if (sock) {
      sock.disconnect();
      console.log('🚪 disconnectSocket() called');
      set({ socket: null });
    }
  },
}));
