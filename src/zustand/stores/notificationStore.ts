import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { userService } from '../../services/userService';
import type { Notification } from '../../types/notifications';

interface NotificationState {
  notifications: Notification[] | null;
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  unreadNotifications: Notification[];
  socket: Socket | null;
  initSocket: (userId: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: null,
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

  get unreadNotifications() {
    const notifications = get().notifications;
    return notifications ? notifications.filter((n) => !n.isRead) : [];
  },

  initSocket: (userId: string) => {
    if (get().socket) return;

    const socket = io('https://vetra-8c5dfe3bdee7.herokuapp.com', {
      query: { userId },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('notification', (notification: Notification) => {
      const current = get().notifications || [];
      set({ notifications: [notification, ...current] });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    set({ socket });
  },
}));
