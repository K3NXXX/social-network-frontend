import { Box, Typography, Avatar, TextField, IconButton } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import ChatBar from '../components/ChatBar';
import Message from '../components/Message';
import sendIcon from '../assets/paper-plane.svg';

const ChatsPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<null | string>(null);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
  };

  //тестові дані
  const currentUserId = 'user1';
  const [messages, setMessages] = useState([
    { senderId: 'user1', content: 'Привіт!' },
    { senderId: 'user2', content: 'Привіт! Як ти?' },
    { senderId: 'user1', content: 'Все ок. Чим займаєшся сьогодні?' },
    {
      senderId: 'user2',
      content:
        'Та нічого особливого. Вирішив трохи попрацювати над сайтом, потім, можливо, вийду на прогулянку, якщо не буде дощу.',
    },
    { senderId: 'user1', content: 'Звучить добре.' },
    {
      senderId: 'user1',
      content:
        'До речі, я нарешті додивився той фільм, про який ти говорив. Дуже сподобався фінал, хоча було трохи затягнуто в середині.',
    },
    {
      senderId: 'user2',
      content:
        'Я ж казав, варто було додивитись. Атмосфера просто шикарна, а головний герой дуже харизматичний.',
    },
    { senderId: 'user1', content: 'Так, актор справді крутий. Як думаєш, буде продовження?' },
    {
      senderId: 'user2',
      content:
        'Сумніваюсь. Хіба що у вигляді приквелу або серіалу. Але загалом, думаю, історія завершена.',
    },
    {
      senderId: 'user1',
      content:
        'Окей. До речі, я ще знайшов інтерв’ю з режисером, він пояснює багато речей, які спочатку були незрозумілими. Якщо цікаво — можу скинути.',
    },
    {
      senderId: 'user2',
      content:
        'Було б супер! Я люблю дивитись такі розбори після перегляду фільму — іноді розумієш зовсім інше, ніж під час перегляду.',
    },
    { senderId: 'user1', content: 'Добре, зараз знайду.' },
    { senderId: 'user2', content: '👌' },
  ]);

  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = (content: string) => {
    if (content.length === 0) return;
    setMessages([...messages, { senderId: 'user1', content: content }]);
    setMessageInput('');
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        minWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* бічна панель */}
      <Box
        sx={{
          width: '20%',
          bgcolor: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #dedede',
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontSize: 25, fontWeight: 'bold', margin: '30% 0 5% 5%', color: 'black' }}
        >
          Чати
        </Typography>
        {/* sx={{ flexGrow: 1, overflowY: 'scroll' }} */}
        <Box>
          {['1', '2', '3', '4', '5', '6', '7', '8'].map((chatId) => (
            <ChatBar
              key={chatId}
              chatId={chatId}
              onSelect={handleChatSelect}
              sx={selectedChat === chatId ? { bgcolor: '#e6e6e6' } : null}
            />
          ))}
        </Box>
      </Box>

      {/* чат */}
      {!selectedChat ? (
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
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            bgcolor: 'white',
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
                  ІП
                </Typography>
              </Avatar>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="body1"
                component="p"
                sx={{ color: 'black', fontWeight: 'bold', fontSize: '16px' }}
              >
                {' '}
                Ім'я Прізвище{' '}
              </Typography>
              <Typography variant="body1" component="p" sx={{ color: 'grey', fontSize: '14px' }}>
                {' '}
                Востаннє в мережі 1 год. тому
              </Typography>
            </Box>
          </Box>
          <Box
            ref={scrollRef}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {messages.map(({ senderId, content }, index) => (
              <Message
                key={index}
                content={content}
                isFromCurrentUser={senderId === currentUserId}
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
    </Box>
  );
};

export default ChatsPage;
