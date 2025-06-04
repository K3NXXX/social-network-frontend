import { Box, Typography, Select, MenuItem, type SelectChangeEvent, Avatar } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ChatBar from '../components/chats/ChatBar';
import ChatScreen from '../components/chats/ChatScreen';
import { chatsService } from '../services/chatsService';
import type { ChatPreview, UserPreview, UserPreviewWithStatus } from '../types/chats';
import { io, Socket } from 'socket.io-client';

const ChatsPage: React.FC = () => {
  const currentUser = chatsService.getUser();

  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [chats, setChats] = useState<ChatPreview[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const lastChatIdRef = useRef<string | null>(null); // для leave_chat івента

  const [users, setUsers] = useState<UserPreview[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(''); // для елемента Select

  //якщо з користувачем раніше чата не було-
  const [newChatUser, setNewChatUser] = useState<UserPreview | undefined>(undefined);
  const newChatUserRef = useRef<UserPreview | undefined>(undefined);

  //висота Header для обчислення висоти цього екрана
  const [headerHeight, setHeaderHeight] = useState(0);
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
        const data = await chatsService.fetchAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
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

  const handleSelectChange = async (event: SelectChangeEvent) => {
    const userId = event.target.value;
    setSelectedUserId(userId);
    const chat = await findChat(userId);
    if (chat) setSelectedChat(chat);
    else {
      setSelectedChat(null);
      setNewChatUser(users.find((user) => user.id === userId));
    }
  };

  //івент chat_created
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    if (!socket.connected) socket.connect();

    const handleChatCreated = (newChatId: string) => {
      const friend = newChatUserRef.current;
      if (!friend) return;
      console.log('creating a new chat: ', newChatId);
      const currentUser: UserPreviewWithStatus = JSON.parse(localStorage.getItem('user') || '');
      const newChatData: ChatPreview = {
        chatId: newChatId,
        name: null,
        isGroup: false,
        lastMessage: null,
        participants: [currentUser, { ...friend, isOnline: false }],
      };
      setChats((chats) => [newChatData, ...chats]);
      setSelectedChat(newChatData);
      lastChatIdRef.current = newChatData.chatId;
      socket.emit('join_chat', newChatData.chatId);
    };

    socket.on('chat_created', handleChatCreated);

    return () => {
      socket.off('chat_created', handleChatCreated);
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
          console.log('found the chat on the backend:', data);
          //the data should be a ChatDetails chat
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
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #dedede',
        }}
      >
        <Select
          value={selectedUserId}
          onChange={handleSelectChange}
          displayEmpty
          sx={{ width: '90%', alignSelf: 'center', marginTop: '5%' }}
        >
          <MenuItem value="" disabled>
            Виберіть, кому написати:
          </MenuItem>
          {users.map((user, index) => {
            if (user.id === currentUser.id) return;
            return (
              <MenuItem key={index} value={user.id}>
                <Box display={'flex'} sx={{ width: '260px' }}>
                  <Avatar
                    src={user?.avatarUrl ?? undefined}
                    sx={{
                      height: 40,
                      bgcolor: '#9885f4',
                      fontSize: 12,
                      marginRight: 1,
                    }}
                  >
                    {user?.avatarUrl
                      ? null
                      : `${user?.firstName[0].toUpperCase()}${user?.lastName[0].toUpperCase()}`}
                  </Avatar>
                  <Typography
                    sx={{
                      color: 'black',
                      fontWeight: 500,
                      fontSize: '20px',
                      alignSelf: 'center',
                    }}
                  >
                    {`${user?.firstName} ${user?.lastName}`}
                  </Typography>
                </Box>
              </MenuItem>
            );
          })}
        </Select>
        <Typography
          variant="body1"
          sx={{ fontSize: 25, fontWeight: 'bold', margin: '30% 0 5% 0%', color: 'black' }}
        >
          Чати
        </Typography>
        <Box>
          {chats.map((chat, i) => (
            <ChatBar
              key={i}
              data={chat}
              onSelect={() => {
                setNewChatUser(undefined);
                setSelectedChat(chat);
              }}
              sx={selectedChat?.chatId === chat.chatId ? { bgcolor: '#e6e6e6' } : null}
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
