import { Avatar, Box, Typography, type SxProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { ChatPreview, MessageData } from '../../types/chats';
import { chatsService } from '../../services/chatsService';
import type { Socket } from 'socket.io-client';

interface ChatBarProps {
  data: ChatPreview;
  onSelect: (chatId: ChatPreview) => void;
  sx?: SxProps;
  socketRef: React.RefObject<Socket | null>;
}

//форматування повідомлення, щоб в UI займало не більше maxLength символів
const formatLastMessage = (content: string, maxLength: number) => {
  if (content.trim().length < maxLength) return content.trim();
  return `${content.trim().slice(0, maxLength - 3)}...`;
};

const ChatBar: React.FC<ChatBarProps> = ({ data, onSelect, sx, socketRef }) => {
  const { lastMessage, participants } = data;
  const currentUser = chatsService.getUser();
  const otherUser = participants.find((user) => user.id !== currentUser.id);

  //для оновлення останнього повідомлення при переписці
  const [newMessage, setNewMessage] = useState<MessageData | null>(null);
  useEffect(() => {
    if (lastMessage) {
      console.log('Last Message:', lastMessage.content, lastMessage);
      setNewMessage(lastMessage);
    }
  }, [lastMessage]);
  console.log(newMessage, lastMessage, 'data:', data);

  const baseStyles = {
    width: '100%',
    display: 'flex',
    height: 85,
    cursor: 'pointer',
    ':hover': { bgcolor: '#e6e6e6' },
    transition: 'background-color 0.2s ease',
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleGetMessage = (message: any) => {
      console.log('got a new message on the chatbar:', message);
      console.log('chat ids: ', message.chatId, data.chatId);
      if (message.chatId === data.chatId) {
        setNewMessage({
          id: message.id,
          content: message.content,
          imageUrl: message.imageUrl,
          createdAt: message.createdAt,
          sender: message.sender,
          isRead: message.isRead,
        });
      }
    };

    socket.on('message', handleGetMessage);

    return () => {
      socket.off('message', handleGetMessage);
    };
  }, [socketRef.current]);

  return (
    <Box onClick={() => onSelect(data)} sx={{ ...baseStyles, ...sx }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 1.5,
        }}
      >
        <Avatar
          src={otherUser?.avatarUrl ?? undefined}
          alt={`${otherUser?.firstName} ${otherUser?.lastName}`}
          sx={{
            borderRadius: '50%',
            width: 65,
            height: 65,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            bgcolor: '#9885f4',
          }}
        >
          {otherUser?.avatarUrl
            ? null
            : `${otherUser?.firstName[0].toUpperCase()}${otherUser?.lastName[0].toUpperCase()}`}
        </Avatar>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Typography
          variant="body1"
          component="p"
          sx={{ color: 'black', fontWeight: 'bold', fontSize: '20px' }}
        >
          {`${otherUser?.firstName} ${otherUser?.lastName}`}
        </Typography>
        <Typography variant="body1" component="p" sx={{ color: 'grey' }}>
          {newMessage
            ? newMessage?.sender
              ? newMessage.sender.id === currentUser.id
                ? `Ви: ${formatLastMessage(newMessage.content, 16)}`
                : `${formatLastMessage(newMessage.content, 20)}`
              : newMessage.senderId
                ? newMessage.senderId === currentUser.id
                  ? `Ви: ${formatLastMessage(newMessage.content, 16)}`
                  : `${formatLastMessage(newMessage.content, 20)}`
                : 'Повідомлень ще немає-'
            : 'Повідомлень ще немає'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatBar;
