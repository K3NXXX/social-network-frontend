import {
  Avatar,
  Box,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ChatBar from '../components/chats/ChatBar';
import ChatScreen from '../components/chats/ChatScreen';
import { chatsService } from '../services/chatsService';
import type { ChatPreview, ChatPreview_ChatCreated, UserPreview } from '../types/chats';
import { io, Socket } from 'socket.io-client';

import SearchBlock from '../components/chats/SearchBlock';
import SearchIcon from '@mui/icons-material/Search';
import { Close } from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { userService } from '../services/userService';
import { useTranslation } from 'react-i18next';

const ChatsPage: React.FC = () => {
  // const currentUser = chatsService.getUser();
  const { t } = useTranslation();

  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [chats, setChats] = useState<ChatPreview[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const lastChatIdRef = useRef<string | null>(null); // для leave_chat івента

  //якщо з користувачем раніше чата не було-
  const [newChatUser, setNewChatUser] = useState<UserPreview | undefined>(undefined);
  const newChatUserRef = useRef<UserPreview | undefined>(undefined);

  //висота Header для обчислення висоти цього екрана
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserPreview[] | []>([]);
  const debounceSearch = useCallback(
    debounce(async (value: string) => {
      if (value.trim().length < 2) return setSearchResults([]);
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

  useEffect(() => {
    const headerEl = document.querySelector('.MuiCard-root');
    if (headerEl) setHeaderHeight(Number.parseInt(getComputedStyle(headerEl).height));

    //завантажуємо дані про чати при відкритті сторінки
    const loadChats = async () => {
      try {
        const data = await chatsService.fetchChats();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    const loadUsers = async () => {
      try {
        // const data = await chatsService.fetchAllUsers();
        // setUsers(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    loadChats();
    loadUsers();

    //події з веб-сокетами
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
      //вихід зі сторінки чатів
      socketRef.current?.disconnect();
      if (lastChatIdRef.current) {
        socketRef.current?.emit('leave_chat', lastChatIdRef.current);
      }
    };
  }, []);

  //івенти join_chat / leave_chat коли користувач відкриває і міняє чати
  useEffect(() => {
    if (!selectedChat) return;

    if (lastChatIdRef.current && lastChatIdRef.current !== selectedChat.chatId) {
      socketRef.current?.emit('leave_chat', lastChatIdRef.current);
    }

    lastChatIdRef.current = selectedChat.chatId;
    socketRef.current?.emit('join_chat', selectedChat.chatId);
  }, [selectedChat]);

  const handleSelectUser = async (userData: UserPreview) => {
    console.log('handling select user:', userData);

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

  //івент chat_created
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    if (!socket.connected) socket.connect();

    const handleChatCreated = async (newChat: ChatPreview_ChatCreated) => {
      console.log('chat_created caught:', newChat);

      const chatData: ChatPreview = {
        chatId: newChat.id,
        isGroup: newChat.isGroup,
        name: newChat.name,
        lastMessage: newChat.messages[newChat.messages.length - 1],
        participants: [newChat.participants[0].user, newChat.participants[1].user],
      };
      console.log(chatData, ': new chat data here!!!');
      setChats((chats) => [chatData, ...chats]);
      setSelectedChat(chatData);
      setNewChatUser(undefined);
      lastChatIdRef.current = chatData.chatId;
      // const friend = newChatUserRef.current;
      // if (false) {
      //   // //коротко - якщо цей юзер надіслав перше повідомлення в новий чат
      //   // //чомусь версія в else для нього не працює, список чатів повернувся пустий
      //   // console.log('creating a new chat: ', newChatId);
      //   // const currentUser: UserPreviewWithStatus = JSON.parse(localStorage.getItem('user') || '');
      //   // const newChatData: ChatPreview = {
      //   //   chatId: newChatId,
      //   //   name: null,
      //   //   isGroup: false,
      //   //   lastMessage: null,
      //   //   participants: [currentUser, { ...friend, isOnline: false }],
      //   // };
      //   // setChats((chats) => [newChatData, ...chats]);
      //   // setSelectedChat(newChatData);
      //   // lastChatIdRef.current = newChatData.chatId;
      //   // socket.emit('join_chat', newChatData.chatId);
      // } else {
      //   //коротко - якщо цей юзер отримав повідомлення в новому чаті
      //   try {
      //     const data = await chatsService.fetchChats();
      //     setChats(data);
      //     const foundChat = data.find((chat) => chat.chatId === newChatId);
      //     console.log('chats:', data, 'new chat:', foundChat);
      //     if (foundChat) {
      //       setSelectedChat(foundChat);
      //       lastChatIdRef.current = foundChat.chatId;
      //       socket.emit('join_chat', foundChat.chatId);
      //     } else console.log('found chat is null????????:', foundChat);
      //   } catch (error) {
      //     console.error('Error fetching chats:', error);
      //   }
      // }
    };

    socket.on('chat_created', handleChatCreated);

    return () => {
      socket.off('chat_created', handleChatCreated);
      // socket.off('message', handleGetMessage);
    };
  }, [socketRef.current]);

  const findChat = async (friendId: string) => {
    //знаходить чат з другом за його id.
    //дописати з пагінацією, (якщо чат не загрузився на фронті, але на сервері знайшовся)
    const foundChat =
      chats.find((chat) => chat.participants.find((user) => user.id === friendId)) || null;
    if (!foundChat) {
      try {
        const data = await chatsService.fetchChat(friendId);
        if (data) {
          //the data should be a ChatDetails chat
          console.log('found the chat on the backend:', data);
          const fetchedChat: ChatPreview = {
            chatId: data.id,
            name: null,
            isGroup: data.isGroup,
            lastMessage: null,
            participants: data.participants.map((p) => ({
              ...p,
              //not the best idea but it will reset the chat
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

  return (
    <Box
      sx={{
        display: 'flex',
        height: `calc(${window.innerHeight}px - ${headerHeight}px)`,
        // я намагався зробити, щоб сторінка просто займала доступне вертикальне місце,
        // але для цього батьківській компоненті треба додати display: flex, flexDirection: column
        // від яких усі інші сторінки попливуть(
      }}
    >
      {/* бічна панель */}
      <Box
        sx={{
          width: '320px',
          flexShrink: 0,
          bgcolor: 'var(--background-color)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        <TextField
          autoComplete="off"
          placeholder={t('chats.chooseToWrite')}
          variant="outlined"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#888', marginLeft: '10px' }} />
              </InputAdornment>
            ),
            endAdornment: searchValue.length > 0 && (
              <InputAdornment position="end">
                <Close
                  onClick={() => setSearchValue('')}
                  sx={{ color: '#888', mx: '10px', cursor: 'pointer' }}
                />
              </InputAdornment>
            ),
            sx: {
              padding: 0,
              '& input': {
                padding: '1.5px 0px',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              margin: '10px 5px 0 5px',
              padding: 0,
              '& input': {
                paddingTop: 1.5,
                paddingBottom: 1.5,
              },
            },
          }}
        />
        {searchResults.length > 0 && (
          <Box
            sx={{
              alignSelf: 'center',
              position: 'absolute',
              width: '300px',
              marginTop: '60px',
              bgcolor: '#181424',
              boxShadow: 3,
              borderRadius: '10px',
              zIndex: 1000,
              padding: '10px',
              maxHeight: '700px',
              overflowY: 'auto',
              // border: '1px solid red',
            }}
          >
            {searchResults.map((result) => (
              <SearchBlock key={result.id} data={result} onSelect={handleSelectUser} />
            ))}
          </Box>
        )}
        <Typography
          variant="body1"
          sx={{
            fontSize: 25,
            fontWeight: 'bold',
            margin: '10% 0 2% 0',
            color: 'var(--text-color)',
          }}
        >
          {t('chats.chatsLabel')}
        </Typography>
        <Box>
          {chats.map((chat) => (
            <ChatBar
              key={chat.chatId}
              data={chat}
              onSelect={() => {
                setNewChatUser(undefined);
                setSelectedChat(chat);
                lastChatIdRef.current = chat.chatId;
              }}
              sx={
                selectedChat?.chatId === chat.chatId ? { bgcolor: 'var(--background-color)' } : null
              }
              socketRef={socketRef}
            />
          ))}
        </Box>
      </Box>
      <ChatScreen selectedChat={selectedChat} socketRef={socketRef} newChatUser={newChatUser} />
    </Box>
  );
};

export default ChatsPage;
