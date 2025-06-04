import { Close } from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, InputAdornment, TextField, Typography } from '@mui/material';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import type { SearchUsers } from '../../types/user';
import Logo from '../../ui/Logo';
import SearchItem from '../../ui/SearchItem';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUsers[] | []>([]);

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

  return (
    <Card
      sx={{
        borderBottom: '1px solid #e0e0e0',
        boxShadow: 'none',
        padding: '15px 20px',
        position: 'sticky',
        top: '0',
        zIndex: 500,
        overflow: 'visible',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box justifySelf="start">
          <Logo />
        </Box>

        <Box position="relative" display="flex" alignItems="center" gap="0 20px">
          <Box justifySelf="end" display="flex" gap="0 30px">
            <Box sx={{ cursor: 'pointer' }} position="relative">
              <NotificationsNoneIcon sx={{ cursor: 'pointer' }} />
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#9885f4',
                  borderRadius: 50,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                top="-11px"
                right="-14px"
                position="absolute"
              >
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                  3
                </Typography>
              </Box>
            </Box>
            <Box sx={{ cursor: 'pointer' }} position="relative" display="flex" alignItems="center">
              <ChatBubbleOutlineIcon sx={{ fontSize: '20px' }} />
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#9885f4',
                  borderRadius: 50,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                top="-11px"
                right="-18px"
                position="absolute"
              >
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                  1
                </Typography>
              </Box>
            </Box>
            <Box sx={{ cursor: 'pointer' }}>
              <PersonOutlineIcon sx={{ cursor: 'pointer' }} />
            </Box>
          </Box>
          <TextField
            placeholder="Пошук..."
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
                borderRadius: '20px',
                padding: 0,
                width: '350px',
                '& input': {
                  padding: '1.5px 0px',
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
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
                position: 'absolute',
                left: 150,
                width: '70%',
                top: '60px',
                bgcolor: '#181424',
                boxShadow: 3,
                borderRadius: '10px',
                zIndex: 1000,
                padding: '10px',
                maxHeight: '700px',
                overflowY: 'auto',
              }}
            >
              {searchResults.map((result) => (
                <SearchItem
                  key={result.id}
                  result={result}
                  setSearchValue={setSearchValue}
                  setSearchResults={setSearchResults}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
}
