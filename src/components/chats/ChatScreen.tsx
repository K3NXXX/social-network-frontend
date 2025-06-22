import { Box, Typography, Avatar, TextField, IconButton } from '@mui/material';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatPreview, MessageData, UserPreview } from '../../types/chats';
import Message from './Message';
import { chatsService } from '../../services/chatsService';
import type { Socket } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '../../contexts/ThemeContext';

export interface ChatScreenProps {
  selectedChat: ChatPreview | null;
  socketRef: React.RefObject<Socket | null>;
  newChatUser: UserPreview | undefined;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ selectedChat, socketRef, newChatUser }) => {
  const currentUser = chatsService.getUser();

  const [messages, setMessages] = useState<MessageData[]>();
  const [messageInput, setMessageInput] = useState<string>('');
  const { t } = useTranslation();
  const { theme } = useTheme();

  const otherUser = selectedChat?.participants.find((user) => user.id !== currentUser.id);
  //щоб передавати оновлені значення до useEffect
  const selectedChatRef = useRef<ChatPreview | null>(selectedChat);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const newChatUserRef = useRef<UserPreview | undefined>(newChatUser);
  useEffect(() => {
    newChatUserRef.current = newChatUser;
  }, [newChatUser]);

  const messageInputRef = useRef<string>(messageInput);
  useEffect(() => {
    messageInputRef.current = messageInput;
  }, [messageInput]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!otherUser) return;
    try {
      const data = await chatsService.fetchMessages(otherUser.id);
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages for the chat:', error);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleMessageSeen = (msg: { messageId: string }) => {
      setMessages((messages) => {
        if (!messages) return;

        return messages.map((m) => (m.id === msg.messageId ? { ...m, isRead: true } : m));
      });
    };

    const handleGetMessage = (message: MessageData) => {
      console.log('message event caught:', message);
      const currentChat = selectedChatRef.current;
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

  const handleSendMessage = (content: string) => {
    if (content.length === 0) {
      console.log('the message is empty');
      return;
    }
    const socket = socketRef.current;
    if (!socket?.connected) {
      console.log('socket not connected yet');
      return;
    }
    if (socket && socket.connected) {
      socket.emit('newMessage', {
        receiverId:
          selectedChatRef.current?.participants.find((user) => user.id !== currentUser.id)?.id ||
          newChatUserRef.current?.id,
        content,
        imageUrl: null,
      });
    } else console.warn('Socket not connected. Message not sent.');

    setMessageInput('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!newChatUserRef.current && !selectedChatRef.current) {
          return;
        }
        handleSendMessage(messageInputRef.current);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [newChatUser]);

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

  const fullNameString = (user: UserPreview) => `${user.firstName} ${user.lastName}`;
  const initialsString = (user: UserPreview) =>
    `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;

  return (
    <>
      {!selectedChat && !newChatUser ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'var(--background-color)',
          }}
        >
          <Typography variant="h6" sx={{ color: theme === 'light' ? 'gray' : 'white' }}>
            {t('chats.chooseChat')}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            bgcolor: 'var(--background-color)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 70,
              borderBottom: '1px solid var(--border-color)',
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
                src={otherUser?.avatarUrl || newChatUser?.avatarUrl || undefined}
                alt={
                  otherUser
                    ? fullNameString(otherUser)
                    : newChatUser
                      ? fullNameString(newChatUser)
                      : ''
                }
                sx={{
                  width: 45,
                  height: 45,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'var(--primary-color)',
                  color: 'white',
                }}
              >
                <Typography variant="body1" component="p" sx={{ fontSize: '14px' }}>
                  {otherUser
                    ? otherUser?.avatarUrl
                      ? null
                      : initialsString(otherUser)
                    : newChatUser?.avatarUrl
                      ? null
                      : newChatUser
                        ? initialsString(newChatUser)
                        : null}
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
                sx={{ color: 'var(--text-color)', fontWeight: 'bold', fontSize: '16px' }}
              >
                {otherUser
                  ? fullNameString(otherUser)
                  : newChatUser
                    ? fullNameString(newChatUser)
                    : null}
              </Typography>
              <Typography
                variant="body1"
                component="p"
                sx={{ color: 'var(--text-color)', opacity: 0.5, fontSize: '14px' }}
              >
                {otherUser
                  ? otherUser?.isOnline || otherUser?.isActive === 'ACTIVE'
                    ? t('chats.online')
                    : t('chats.offline')
                  : ''}
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
                  msg.senderId
                    ? msg.isRead === false && msg.senderId !== currentUser.id
                      ? observeElement
                      : null
                    : msg.sender
                      ? msg.isRead === false && msg.sender.id !== currentUser.id
                        ? observeElement
                        : null
                      : null
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
                placeholder={t('chats.writeYourMessage')}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                InputProps={{
                  sx: {
                    color: 'var(--text-color)',
                    opacity: 0.7,
                    borderRadius: '20px',
                    '& input': {
                      padding: '1.5px 0px',
                      color: 'var(--text-color)',
                    },
                    '&.Mui-focused': {
                      color: 'var(--primary-color)',
                      opacity: 1,
                    },
                    '&.MuiFormLabel-filled': {
                      color: 'var(--primary-color)',
                    },
                  },
                }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    borderColor: 'var(--border-color)',
                    padding: 0,
                    '& input': {
                      paddingTop: 1.5,
                      paddingBottom: 1.5,
                      paddingLeft: 1.5,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--primary-color)',
                    },
                    '& fieldset': {
                      borderColor: 'var(--border-color)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--primary-color)',
                      borderWidth: '2px',
                    },
                  },
                }}
              ></TextField>
              <IconButton
                onClick={() => handleSendMessage(messageInput)}
                sx={{
                  width: 50,
                  height: '90%',
                  borderRadius: '35%',
                  border: '1px solid var(--primary-color)',
                  marginLeft: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <SendIcon sx={{ color: 'var(--text-color)' }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatScreen;
