import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import type { SearchUsers } from '../types/user';

interface SearchItemProps {
  result: SearchUsers;
}

export default function SearchItem({ result }: SearchItemProps) {
  const colors = ['#FF6B6B', '#4ECDC4', '#5D9CEC', '#FFD93D', '#A29BFE', '#E17055', '#20554a'];

  const randomColor = useMemo(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#181424',
        padding: '5px 10px',
        gap: 2,
        mb: 1,
        cursor: 'pointer',
      }}
    >
      <Box>
        {result.avatarUrl ? (
          <img
            style={{ borderRadius: '50%', width: 50, height: 50 }}
            src={result.avatarUrl}
            alt="avatar"
          />
        ) : (
          <Box
            sx={{
              borderRadius: '50%',
              width: 50,
              height: 50,
              backgroundColor: randomColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '20px', fontWeight: 700 }}>
              {result.firstName[0]}
            </Typography>
          </Box>
        )}
      </Box>
      <Box display="flex" flexDirection="column">
        <Typography sx={{ color: 'white', fontWeight: 700 }}>
          {result.firstName + ' ' + result.lastName}
        </Typography>

        {result.username ? (
          <Typography sx={{ textAlign: 'left', color: '#aaaaaa', fontFamily: 'Ubuntu' }}>
            @{result.username}
          </Typography>
        ) : (
          ''
        )}
      </Box>
    </Box>
  );
}
