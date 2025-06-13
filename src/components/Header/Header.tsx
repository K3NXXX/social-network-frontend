import { Close } from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, InputAdornment, TextField, Typography } from '@mui/material';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PAGES } from '../../constants/pages.constants';
import { userService } from '../../services/userService';
import type { Notification } from '../../types/notifications';
import type { SearchUsers } from '../../types/user';
import Logo from '../../ui/Logo';
import SearchItem from '../../ui/SearchItem';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUsers[] | []>([]);
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[] | null>(null);

  const unreadNotifications = notifications?.filter((n) => !n.isRead);

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
    const getNotifications = async () => {
      try {
        const result = await userService.getUserNotifications();
        setNotifications(result);
      } catch (error) {
        console.error('error getting notifications: ', error);
        setNotifications(null);
      }
    };
    getNotifications();
  }, []);

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
              <Link style={{ color: 'black' }} to={PAGES.NOTIFICATIONS}>
                <NotificationsNoneIcon sx={{ cursor: 'pointer' }} />
                {unreadNotifications && unreadNotifications?.length > 0 && (
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
                      {unreadNotifications?.length}
                    </Typography>
                  </Box>
                )}
              </Link>
            </Box>
            <Box sx={{ cursor: 'pointer' }} position="relative" display="flex" alignItems="center">
              <Link to={PAGES.CHATS} style={{ textDecoration: 'none' }}>
                <ChatBubbleOutlineIcon sx={{ fontSize: '20px', color: 'black' }} />
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
              </Link>
            </Box>
            <Box sx={{ cursor: 'pointer' }}>
              <Link style={{ textDecoration: 'none' }} to={PAGES.PROFILE}>
                <PersonOutlineIcon sx={{ cursor: 'pointer', color: 'black' }} />
              </Link>
            </Box>
          </Box>
          <TextField
            autoComplete="off"
            placeholder={t('searchPlaceholder')}
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
