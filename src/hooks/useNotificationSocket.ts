import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io('https://vetra-8c5dfe3bdee7.herokuapp.com', {
      query: { userId },
      transports: ['websocket'],
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
