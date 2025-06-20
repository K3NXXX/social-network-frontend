import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatBar from '../components/chats/ChatBar';
import ChatScreen from '../components/chats/ChatScreen';
import { chatsService } from '../services/chatsService';
import type { ChatPreview, ChatPreview_ChatCreated, UserPreview } from '../types/chats';
import SearchBlock from '../components/chats/SearchBlock';
import SearchIcon from '@mui/icons-material/Search';
import { Close } from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { userService } from '../services/userService';
import { useTranslation } from 'react-i18next';

const ChatsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [newChatUser, setNewChatUser] = useState<UserPreview | undefined>(undefined);
  const newChatUserRef = useRef<UserPreview | undefined>(undefined);
  const lastChatIdRef = useRef<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserPreview[]>([]);

  const debounceSearch = useCallback(
    debounce(async (value: string) => {
      if (value.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const data = await userService.searchUsers(value);
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debounceSearch(searchValue);
  }, [searchValue, debounceSearch]);

  useEffect(() => {
    newChatUserRef.current = newChatUser;
  }, [newChatUser]);

  // --- Ініціалізація WS та завантаження чатів
  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await chatsService.fetchChats();
        setChats(data);
      } catch (e) {
        console.error('Error fetching chats:', e);
      }
    };
    loadChats();

    socketRef.current = io('https://vetra-8c5dfe3bdee7.herokuapp.com', {
      path: '/socket.io',
      withCredentials: true,
      auth: {
        token: localStorage.getItem('accessToken'),
      },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
    });
    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
      if (lastChatIdRef.current) {
        socketRef.current?.emit('leave_chat', lastChatIdRef.current);
      }
    };
  }, []);

  // --- Перехід між чатами: leave/join
  useEffect(() => {
    if (!selectedChat) return;

    if (lastChatIdRef.current && lastChatIdRef.current !== selectedChat.chatId) {
      socketRef.current?.emit('leave_chat', lastChatIdRef.current);
    }
    lastChatIdRef.current = selectedChat.chatId;
    socketRef.current?.emit('join_chat', selectedChat.chatId);
  }, [selectedChat]);

  // --- Обробник створення нового групового чату
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onChatCreated = (newChat: ChatPreview_ChatCreated) => {
      const preview: ChatPreview = {
        chatId: newChat.id,
        isGroup: newChat.isGroup,
        name: newChat.name,
        lastMessage: newChat.messages.at(-1) ?? null,
        participants: newChat.participants.map((p) => p.user),
      };
      setChats((prev) => [preview, ...prev]);
      setSelectedChat(preview);
      newChatUserRef.current = undefined;
      lastChatIdRef.current = preview.chatId;
    };

    socket.on('chat_created', onChatCreated);
    return () => {
      socket.off('chat_created', onChatCreated);
    };
  }, []);

  const handleSelectUser = async (userData: UserPreview) => {
    setSearchValue('');
    setSearchResults([]);
    // знаходимо існуючий чат
    const existing = chats.find((c) => c.participants.some((p) => p.id === userData.id));
    if (existing) {
      setSelectedChat(existing);
    } else {
      setNewChatUser(userData);
      setSelectedChat(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Сайдбар з пошуком */}
      <Box
        sx={{
          width: 340,
          flexShrink: 0,
          bgcolor: 'var(--background-color)',
          borderRight: '1px solid var(--border-color)',
          p: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder={t('chats.chooseToWrite')}
          variant="outlined"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <Close onClick={() => setSearchValue('')} />
              </InputAdornment>
            ),
          }}
        />
        {searchResults.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              width: 300,
              mt: 6,
              bgcolor: '#181424',
              boxShadow: 3,
              borderRadius: 1,
              zIndex: 1000,
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            {searchResults.map((u) => (
              <SearchBlock key={u.id} data={u} onSelect={handleSelectUser} />
            ))}
          </Box>
        )}

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          {t('chats.chatsLabel')}
        </Typography>
        {chats.map((chat) => (
          <ChatBar
            key={chat.chatId}
            data={chat}
            onSelect={() => setSelectedChat(chat)}
            sx={
              selectedChat?.chatId === chat.chatId
                ? { bgcolor: 'var(--background-color)' }
                : undefined
            }
            socketRef={socketRef}
          />
        ))}
      </Box>

      {/* Основний екран чату */}
      <ChatScreen selectedChat={selectedChat} socketRef={socketRef} newChatUser={newChatUser} />
    </Box>
  );
};

export default ChatsPage;
