import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PAGES } from '../constants/pages.constants';
import type { SearchUsers } from '../types/user';

interface SearchItemProps {
  result: SearchUsers;
  setSearchValue: (searchValue: string) => void;
  setSearchResults: (searchResults: SearchUsers[]) => void;
}

export default function SearchItem({ result, setSearchValue, setSearchResults }: SearchItemProps) {
  const colors = ['#FF6B6B', '#4ECDC4', '#5D9CEC', '#FFD93D', '#A29BFE', '#E17055', '#20554a'];

  const randomColor = useMemo(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const handleUserSelected = () => {
    setSearchResults([]);
    setSearchValue('');
  };
  return (
    <Link to={`${PAGES.VIEW_PUBLIC_PROFILE}/${result.id}`}>
      <Box
        onClick={handleUserSelected}
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#181424',
          padding: '12px 17px',
          gap: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#2a2340',
          },
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
    </Link>
  );
}
