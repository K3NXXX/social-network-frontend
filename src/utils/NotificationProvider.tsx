// src/utils/NotificationProvider.tsx
import { useEffect } from 'react';
import { useNotificationStore } from '../zustand/stores/notificationStore';
import { useAuth } from '../services/AuthContext'; // хук із AuthProvider

export default function NotificationProvider() {
  const { user } = useAuth(); // отримуємо поточного юзера
  const { fetchNotifications, initSocket, disconnectSocket } = useNotificationStore();

  useEffect(() => {
    if (!user?.id) {
      // нікого логувати – відключаємо старий сокет
      disconnectSocket();
      return;
    }

    // якщо юзер з’явився (логін) – підтягуємо історію та стартуємо WS
    fetchNotifications();
    initSocket(user.id);

    // при розлогіні (user.id стає undefined) – cleanup
    return () => {
      disconnectSocket();
    };
  }, [user?.id]); // <–– спрацьовує щоразу, як змінюється user.id

  return null;
}
