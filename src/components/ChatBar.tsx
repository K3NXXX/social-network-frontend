import { Avatar, Box, Typography, type SxProps } from '@mui/material';
import React from 'react';

interface ChatBarProps {
  chatId: string;
  onSelect: (chatId: string) => void;
  sx?: SxProps;
}

const ChatBar: React.FC<ChatBarProps> = ({ chatId, onSelect, sx }) => {
  const baseStyles = {
    width: '100%',
    display: 'flex',
    height: 85,
    cursor: 'pointer',
    ':hover': { bgcolor: '#e6e6e6' },
    transition: 'background-color 0.2s ease',
  };

  return (
    <Box onClick={() => onSelect(chatId)} sx={{ ...baseStyles, ...sx }}>
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
          ІП
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
          sx={{ color: 'black', fontWeight: 'bold', fontSize: '20px' }}
        >
          {' '}
          Ім'я Прізвище{' '}
        </Typography>
        <Typography variant="body1" component="p" sx={{ color: 'grey' }}>
          {' '}
          Останнє повідомлення{' '}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatBar;
