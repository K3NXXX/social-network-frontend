import { Close } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { io, Socket } from 'socket.io-client';
import ChatBar from '../components/chats/ChatBar';
import ChatScreen from '../components/chats/ChatScreen';
import { chatsService } from '../services/chatsService';
import type { ChatPreview, ChatPreview_ChatCreated, UserPreview } from '../types/chats';
import SearchBlock from '../components/chats/SearchBlock';
import { useTheme } from '../contexts/ThemeContext';
import { userService } from '../services/userService';
import { useLocation, useNavigate } from 'react-router-dom';

const ChatsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData: UserPreview = location.state?.userData;

  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [newChatUser, setNewChatUser] = useState<UserPreview | undefined>(undefined);
  const newChatUserRef = useRef<UserPreview | undefined>(undefined);
  const lastChatIdRef = useRef<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const { theme } = useTheme();

  //висота Header для обчислення висоти цього екрана
  const [headerHeight, setHeaderHeight] = useState<number>(0);

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

  //оновлення accessToken
  // useEffect(() => {
  //   console.log('REFRESHING ACCESS TOKEN...');
  //   const setNewToken = async () => {
  //     const newToken = await chatsService.refreshAccessToken();
  //     console.log('NEW TOKEN!:', newToken);
  //   };

  //   setNewToken();
  // }, []);

  useEffect(() => {
    debounceSearch(searchValue);
  }, [searchValue, debounceSearch]);

  useEffect(() => {
    newChatUserRef.current = newChatUser;
  }, [newChatUser]);

  // --- Ініціалізація WS та завантаження чатів
  useEffect(() => {
    const headerEl = document.querySelector('.MuiCard-root');
    if (headerEl) setHeaderHeight(Number.parseInt(getComputedStyle(headerEl).height));

    const loadChats = async () => {
      try {
        const data = await chatsService.fetchChats();
        setChats(data);
      } catch (e) {
        console.error('Error fetching chats:', e);
      }
    };
    loadChats();

    socketRef.current = io(import.meta.env.VITE_API_URL, {
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

    const handleError = (payload: any) => {
      console.error('Error: ', payload.message);
      alert(t('chats.authError', { message: payload.message }));
      navigate('/login');
    };

    socketRef.current.on('error', handleError);

    return () => {
      socketRef.current?.off('error', handleError);
      socketRef.current?.disconnect();
      if (lastChatIdRef.current) {
        socketRef.current?.emit('leave_chat', lastChatIdRef.current);
      }
    };
  }, []);

  //якщо треба відкрити чат з юзером, у профілі якого натиснули на 'повідомлення'
  useEffect(() => {
    if (userData && chats.length > 0) {
      const setChat = async () => {
        const chat = await findChat(userData.id);
        if (!chat) {
          setNewChatUser(userData);
          setSelectedChat(null);
        } else {
          setNewChatUser(undefined);
          setSelectedChat(chat);
        }
      };

      setChat();
    }
  }, [chats, userData]);

  //івенти join_chat / leave_chat коли користувач відкриває і міняє чати
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

  const findChat = async (friendId: string) => {
    //знаходить чат з другом за його id.
    const foundChat =
      chats.find((chat) => chat.participants.find((user) => user.id === friendId)) || null;
    if (!foundChat) {
      try {
        const data = await chatsService.fetchChat(friendId);
        if (data) {
          console.log('found the chat on the backend:', data);
          const fetchedChat: ChatPreview = {
            chatId: data.id,
            name: null,
            isGroup: data.isGroup,
            lastMessage: null,
            participants: data.participants.map((p) => ({
              ...p,
              isOnline: false,
            })),
          };
          setChats((chats) => [fetchedChat, ...chats]);
          return fetchedChat;
        } else return null;
      } catch (error) {
        console.error(`Error fetching chat with ${friendId}:`, error);
      }
    } else return foundChat;
  };

  const handleSelectUser = async (userData: UserPreview) => {
    setSearchValue('');
    setSearchResults([]);
    const chat = await findChat(userData.id);
    if (chat) {
      setSelectedChat(chat);
      lastChatIdRef.current = chat.chatId;
    } else {
      setSelectedChat(null);
      setNewChatUser(userData);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: `calc(${window.innerHeight}px - ${headerHeight}px)` }}>
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
          sx={{
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
            '& .MuiOutlinedInput-root': {
              color: theme === 'dark' ? '#fff' : '#000',
              '& fieldset': {
                borderColor: theme === 'dark' ? '#555' : '#ccc',
              },
              '&:hover fieldset': {
                borderColor: theme === 'dark' ? '#888' : '#888',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#9885f4',
              },
            },
            input: {
              color: theme === 'dark' ? '#fff' : '#000',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme === 'light' ? '#949494' : 'white' }} />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <Close
                  sx={{ color: theme === 'light' ? '#949494' : 'white' }}
                  onClick={() => setSearchValue('')}
                />
              </InputAdornment>
            ),
          }}
        />
        {searchResults.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              width: 305,
              mt: 1,
              bgcolor: '#181424',
              boxShadow: 3,
              borderRadius: 1,
              zIndex: 1000,
              maxHeight: 400,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
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
      <ChatScreen selectedChat={selectedChat} socketRef={socketRef} newChatUser={newChatUser} />
    </Box>
  );
};

export default ChatsPage;
