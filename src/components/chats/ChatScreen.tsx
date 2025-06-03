// import React from 'react';
import { Box, Typography, Avatar, TextField, IconButton } from '@mui/material';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import sendIcon from '../../assets/paper-plane.svg';
import type { ChatPreview, MessageData, UserPreview } from '../../types/chats';
import Message from './Message';
import { chatsService } from '../../services/chatsService';
import type { Socket } from 'socket.io-client';

export interface ChatScreenProps {
  selectedChat: ChatPreview | null;
  socketRef: React.RefObject<Socket | null>;
  newChatFriend: UserPreview | undefined;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ selectedChat, socketRef, newChatFriend }) => {
  const currentUser = chatsService.getUser();

  //співрозмовник в існуючому чаті, newChatFriend - якщо чат ще не створений
  const otherUser = selectedChat?.participants.find((user) => user.id !== currentUser.id);

  const [messages, setMessages] = useState<MessageData[]>();

  //to pass the updated value of a selected chat to the useEffect[socketRef.current]
  const selectedChatRef = useRef<ChatPreview | null>(selectedChat);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  //коли користувач відкриває чат:
  useEffect(() => {
    if (selectedChat) {
      if (!otherUser?.id) return;
      const loadMessages = async () => {
        try {
          const data = await chatsService.fetchMessages(otherUser?.id);
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages for the chat:', error);
        }
      };
      loadMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      console.log('returning from the socket on ChatScreen');
      return;
    }

    const handleMessageSeen = (msg: any) => {
      console.log('handling message seen: ', msg);
      setMessages((messages) => {
        if (!messages) return;

        return messages.map((m) => (m.id === msg.messageId ? { ...m, isRead: true } : m));
      });
    };

    const handleGetMessage = (message: any) => {
      const currentChat = selectedChatRef.current;
      console.log('handling getting a message (chatscreen): ', message);
      console.log(message.chatId, currentChat?.chatId, currentChat);
      if (message.chatId === currentChat?.chatId) {
        setMessages((messages) => [
          ...(messages || []),
          {
            id: message.id,
            content: message.content,
            imageUrl: message.imageUrl,
            createdAt: message.createdAt,
            sender: message.sender,
            isRead: message.isRead,
          },
        ]);
      }
    };

    socket.on('message', handleGetMessage);
    socket.on('message_seen', handleMessageSeen);

    return () => {
      socket.off('message_seen', handleMessageSeen);
      socket.off('message', handleGetMessage);
    };
  }, [socketRef.current]);

  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = (content: string) => {
    if (content.length === 0) return;
    console.log('sending a new message:', {
      receiverId: otherUser?.id || newChatFriend?.id,
      content,
      imageUrl: null,
    });
    const socket = socketRef.current;
    if (!socket?.connected) {
      console.log('socket not connected yet');
      return;
    }

    if (socket && socket.connected) {
      socket.emit('newMessage', {
        receiverId: otherUser?.id || newChatFriend?.id,
        content,
        imageUrl: null,
      });
      console.log('Message emitted:', content);
    } else {
      console.warn('Socket not connected. Message not sent.');
    }

    setMessageInput('');
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [newChatFriend]);

  const observer = useRef<IntersectionObserver | null>(null);

  const observeElement = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    if (!observer.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const messageId = entry.target.getAttribute('data-id');
              if (socketRef.current && socketRef.current.connected) {
                console.log('emitting message seen:', entry.target);
                socketRef.current?.emit('message_seen', { messageId });
              } else console.log('socket is not connected, message_seen not sent');
            }
          });
        },
        { root: null, threshold: 1.0 }
      );
    }
    observer.current.observe(node);
  }, []);

  const fullNameString = (user: any) => `${user.firstName} ${user.lastName}`;
  const initialsString = (user: any) =>
    `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;

  return (
    <>
      {!selectedChat && !newChatFriend ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'white',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Виберіть чат, щоб почати спілкування
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 70,
              borderBottom: '1px solid #dedede',
              display: 'flex',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 1.5,
              }}
            >
              <Avatar
                src={otherUser?.avatarUrl || newChatFriend?.avatarUrl || undefined}
                alt={otherUser ? fullNameString(otherUser) : fullNameString(newChatFriend)}
                sx={{
                  width: 45,
                  height: 45,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: '#9885f4',
                  color: 'white',
                }}
              >
                <Typography variant="body1" component="p" sx={{ fontSize: '14px' }}>
                  {otherUser
                    ? otherUser?.avatarUrl
                      ? null
                      : initialsString(otherUser)
                    : newChatFriend?.avatarUrl
                      ? null
                      : initialsString(newChatFriend)}
                </Typography>
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
                sx={{ color: 'black', fontWeight: 'bold', fontSize: '16px' }}
              >
                {otherUser ? fullNameString(otherUser) : fullNameString(newChatFriend)}
              </Typography>
              <Typography variant="body1" component="p" sx={{ color: 'grey', fontSize: '14px' }}>
                {otherUser ? (otherUser?.isOnline ? 'В мережі' : 'Не в мережі') : ''}
              </Typography>
            </Box>
          </Box>
          <Box
            ref={scrollRef}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'scroll',
              minHeight: 0,
              flex: 1,
            }}
          >
            {messages?.map((msg, index) => (
              <Message
                key={index}
                data={msg}
                data-id={msg.id}
                innerRef={
                  //ставимо observer тільки якщо повідомлення від іншого юзера, і не прочитане
                  msg.isRead === false && msg.sender.id !== currentUser.id ? observeElement : null
                }
              />
            ))}
          </Box>
          <Box
            sx={{
              width: '100%',
              height: '4.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '95%',
                height: '70%',
                marginBottom: '0.5rem',
                display: 'flex',
              }}
            >
              <TextField
                variant="outlined"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                    '& fieldset': {
                      border: '1px solid #dedede',
                    },
                  },
                  color: '#dedede',
                }}
                placeholder="Напишіть своє повідомлення тут..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              ></TextField>
              <IconButton
                onClick={() => handleSendMessage(messageInput)}
                sx={{
                  width: 50,
                  height: '100%',
                  borderRadius: '35%',
                  border: '1px solid #dedede',
                  marginLeft: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img src={sendIcon} alt="send" style={{ width: 24, height: 24 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatScreen;
