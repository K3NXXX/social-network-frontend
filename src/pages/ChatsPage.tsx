import { Box, Typography, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ChatBar from '../components/chats/ChatBar';
import ChatScreen from '../components/chats/ChatScreen';
import { chatsService } from '../services/chatsService';
import type { ChatPreview, UserPreview, UserPreviewWithStatus } from '../types/chats';
import { io, Socket } from 'socket.io-client';

const ChatsPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [chats, setChats] = useState<ChatPreview[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const lastChatIdRef = useRef<string | null>(null); // для leave_chat івента

  const [friends, setFriends] = useState<UserPreview[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState('');

  //якщо з другом раніше чата не було-
  const [newChatFriend, setNewChatFriend] = useState<UserPreview | undefined>(undefined);
  const newChatFriendRef = useRef<UserPreview | undefined>(undefined);
  useEffect(() => {
    newChatFriendRef.current = newChatFriend;
  }, [newChatFriend]);

  useEffect(() => {
    //завантажуємо дані про чати при відкритті сторінки
    const loadChats = async () => {
      try {
        const data = await chatsService.fetchChats();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    const loadFriends = async () => {
      try {
        const data = await chatsService.fetchAllUsers();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    loadChats();
    loadFriends();

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
        console.log('leaving chat: ', lastChatIdRef.current, ' and chats page');
        socketRef.current?.emit('leave_chat', lastChatIdRef.current);
      }
    };
  }, []);

  //івенти join_chat / leave_chat коли користувач відкриває і міняє чати
  useEffect(() => {
    if (!selectedChat) return;

    if (lastChatIdRef.current && lastChatIdRef.current !== selectedChat.chatId) {
      console.log('leaving chat: ', lastChatIdRef.current);
      socketRef.current?.emit('leave_chat', lastChatIdRef.current);
    }

    lastChatIdRef.current = selectedChat.chatId;
    console.log('joining chat: ', selectedChat.chatId);
    socketRef.current?.emit('join_chat', selectedChat.chatId);
  }, [selectedChat]);

  const handleSelectChange = async (event: SelectChangeEvent) => {
    const friendId = event.target.value;
    setSelectedFriendId(friendId);
    const chat = await findChat(friendId);
    if (chat) setSelectedChat(chat);
    else {
      setSelectedChat(null);
      setNewChatFriend(friends.find((friend) => friend.id === friendId));
    }
  };

  //івент chat_created
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    if (!socket.connected) socket.connect();

    const handleChatCreated = (newChatId: string) => {
      const friend = newChatFriendRef.current;
      if (!friend) {
        console.log('no new chat friend!', friend);
        return;
      }
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
          //the data is a ChatDetails chat (or not?)
          const fetchedChat: ChatPreview = {
            chatId: data.id,
            name: null,
            isGroup: data.isGroup,
            lastMessage: null,
            participants: data.participants.map((p) => ({
              ...p,
              //probably not the best idea???
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
        height: '91.7%',
        // я намагався зробити, щоб сторінка просто займала доступне вертикальне місце,
        // але для цього батьківській компоненті треба додати display: flex, flexDirection: column
        // від яких усі інші сторінки попливуть(
        // flex: 1,
      }}
    >
      {/* бічна панель */}
      <Box
        sx={{
          width: '20%',
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #dedede',
        }}
      >
        <Select
          value={selectedFriendId}
          onChange={handleSelectChange}
          displayEmpty
          sx={{ width: '80%', alignSelf: 'center', marginTop: '5%' }}
        >
          <MenuItem value="" disabled>
            Select a friend to message:
          </MenuItem>
          {friends.map((friend, index) => {
            return (
              <MenuItem key={index} value={friend.id}>
                {`${friend.firstName} ${friend.lastName}`}
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
                setNewChatFriend(undefined);
                setSelectedChat(chat);
              }}
              sx={selectedChat?.chatId === chat.chatId ? { bgcolor: '#e6e6e6' } : null}
              socketRef={socketRef}
            />
          ))}
        </Box>
      </Box>
      <ChatScreen selectedChat={selectedChat} socketRef={socketRef} newChatFriend={newChatFriend} />
    </Box>
  );
};

export default ChatsPage;
