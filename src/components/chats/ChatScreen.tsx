import { Box, Typography, Avatar, TextField, IconButton, Button } from '@mui/material';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import sendIcon from '../../assets/paper-plane.svg';
import type { ChatPreview, MessageData, UserPreview } from '../../types/chats';
import Message from './Message';
import { chatsService } from '../../services/chatsService';
import type { Socket } from 'socket.io-client';
import { useTranslation } from 'react-i18next';

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
  const [shouldScroll, setShouldScroll] = useState<boolean>(false);
  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!shouldScroll) return;

    scrollToBottom();
    setShouldScroll(false);
  }, [messages, shouldScroll]);

  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const loadMessages = async (cursor: string | null, scroll: boolean) => {
    if (!otherUser) return;
    try {
      if (!hasNextPage) throw new Error(`Error: there's no more messages`);
      const data = await chatsService.fetchMessages(currentUser.id, otherUser.id, cursor);

      setMessages((msgs) => [...data.messages, ...(msgs || [])]);
      setHasNextPage(data.hasNextPage);
      if (scroll) setShouldScroll(true);
    } catch (error) {
      console.error('Error fetching messages for the chat:', error);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      loadMessages(null, true);
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
        setShouldScroll(true);
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
            bgcolor: 'white',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {t('chats.chooseChat')}
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
                  bgcolor: '#9885f4',
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
                sx={{ color: 'black', fontWeight: 'bold', fontSize: '16px' }}
              >
                {otherUser
                  ? fullNameString(otherUser)
                  : newChatUser
                    ? fullNameString(newChatUser)
                    : null}
              </Typography>
              <Typography variant="body1" component="p" sx={{ color: 'grey', fontSize: '14px' }}>
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
            {otherUser && messages ? (
              <Button variant="contained" onClick={() => loadMessages(messages[0].id, false)}>
                Load More!
              </Button>
            ) : null}
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
