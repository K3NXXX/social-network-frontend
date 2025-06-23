import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(import.meta.env.VITE_API_URL, {
      path: '/socket.io',
      query: { userId },
      withCredentials: true,
      auth: {
        token: localStorage.getItem('accessToken'),
      },
      transports: ['websocket'],
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
