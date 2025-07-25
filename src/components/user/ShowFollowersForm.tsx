import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Box, Dialog, InputAdornment, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PAGES } from '../../constants/pages.constants';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import type { User } from '../../types/auth';
import type { UserFollowers } from '../../types/user';
import { NoOutlineButton } from '../../ui/NoOutlineButton';
import { customScrollBar } from '../../ui/customScrollBar';
import FollowersListSkeleton from '../../ui/skeletons/FollowersListSkeleton';

interface IShowFollowersFormProps {
  isOpened: boolean;
  onClose: (isShowFollowersFormOpened: boolean) => void;
  userId: string;
  setProfile: (data: User) => void;
  blockedUsers: { blocked: User }[] | null;
}

export default function ShowFollowersForm({
  isOpened,
  onClose,
  userId,
  setProfile,
  blockedUsers,
}: IShowFollowersFormProps) {
  const [searchValue, setSearchValue] = useState('');
  const [userFollowers, setUserFollowers] = useState<UserFollowers[] | []>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const isUserBlocked = (userIdToCheck: string) => {
    return blockedUsers?.some((blockedUser) => blockedUser.blocked.id === userIdToCheck);
  };

  const filteredFollowers = userFollowers.filter((follower) => {
    const search = searchValue.toLowerCase().trim();
    const fullName = `${follower.firstName} ${follower.lastName}`.toLowerCase();
    const username = follower.username?.toLowerCase() || '';
    return fullName.includes(search) || username.includes(search);
  });

  const handleFollowToggle = async (followerId: string) => {
    try {
      const result = await userService.followUser(followerId);
      const updatedData = await userService.getUserPublicProfile(userId);
      setProfile(updatedData);
      setUserFollowers((prev) =>
        prev.map((follower) =>
          follower.id === followerId ? { ...follower, isFollowed: result.following } : follower
        )
      );
    } catch (error) {
      console.error('Error following user: ', error);
    }
  };

  useEffect(() => {
    const getUserFollowers = async () => {
      try {
        setIsLoading(true);
        const data = await userService.getUsersFollowers(userId);
        const userData = await authService.getCurrentUser();
        setUserFollowers(data);
        setCurrentUser(userData);
      } catch (error) {
        console.log(error);
        setUserFollowers([]);
      } finally {
        setIsLoading(false);
      }
    };
    getUserFollowers();
  }, [userId]);

  return (
    <Dialog
      open={isOpened}
      onClose={() => onClose(false)}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#181424',
            borderRadius: 3,
            pt: 1.3,
            width: 400,
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          },
        },
      }}
    >
      <CloseIcon
        onClick={() => onClose(false)}
        sx={{
          color: 'white',
          position: 'absolute',
          top: 10,
          right: 12,
          cursor: 'pointer',
          fontSize: 26,
        }}
      />
      <Box
        display="flex"
        justifyContent="center"
        mb={1}
        paddingBottom="10px"
        borderBottom="1px solid #2c2a4a"
      >
        <Typography
          sx={{
            color: '#fff',
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: 16,
            fontWeight: 500,
            userSelect: 'none',
          }}
        >
          {t('profile.followersLabelBig')}
        </Typography>
      </Box>
      <Box>
        <Box sx={{ padding: '0 15px 20px' }}>
          <TextField
            autoComplete="off"
            placeholder={t('searchPlaceholder')}
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <SearchIcon sx={{ color: '#888' }} />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <CancelIcon
                    onClick={() => setSearchValue('')}
                    sx={{
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '20px',
                      '&:hover': { color: '#fff' },
                    }}
                  />
                </InputAdornment>
              ),
              sx: {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                outline: 'none',
                boxShadow: 'none',

                '& input': {
                  padding: '8px 0',
                  color: '#fff',
                  paddingRight: '10px',
                },
                backgroundColor: '#2c2a4a',
                borderRadius: '10px ',
              },
            }}
          />
        </Box>
        <Box
          sx={{
            height: '400px',
            overflow: 'hidden',
            borderRadius: '10px',
            padding: '0 10px 0px 15px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px 0',
              paddingBottom: '20px',
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '15px',
              ...customScrollBar,
            }}
          >
            {isLoading ? (
              [...Array(5)].map((_, index) => <FollowersListSkeleton key={index} />)
            ) : filteredFollowers.length > 0 ? (
              filteredFollowers.map((item) => (
                <Box
                  display="flex"
                  gap="0 20px"
                  alignItems="center"
                  justifyContent="space-between"
                  position="relative"
                  key={item.id}
                  sx={{
                    minHeight: '47px',
                  }}
                >
                  <Link
                    to={`${PAGES.VIEW_PUBLIC_PROFILE}/${item.id}`}
                    style={{ textDecoration: 'none' }}
                    onClick={() => onClose(false)}
                  >
                    <Box display="flex" gap="0 20px" alignItems="center">
                      <Avatar src={item.avatarUrl ? item.avatarUrl : ''} />
                      <Box display="flex" flexDirection="column" gap="2px 0">
                        {item.username && (
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: 'white',
                              fontSize: '15px',
                              cursor: 'pointer',
                            }}
                          >
                            @{item.username}
                          </Typography>
                        )}
                        <Typography sx={{ fontWeight: 500, color: '#bdbdbd', fontSize: '15px' }}>
                          {item.firstName + ' ' + item.lastName}
                        </Typography>
                      </Box>
                    </Box>
                  </Link>
                  {currentUser && currentUser.id !== item.id && !isUserBlocked(item.id) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '5px',
                        right: 0,
                        backgroundColor: '#181424',
                        padding: '3px',
                        borderRadius: '12px',
                      }}
                    >
                      <NoOutlineButton
                        variant="contained"
                        size="small"
                        onClick={() => handleFollowToggle(item.id)}
                        sx={{
                          backgroundColor: item.isFollowed ? '#747474' : 'var(--primary-color)',
                          color: '#fff',
                        }}
                      >
                        {item.isFollowed ? t('profile.followingLabel') : t('profile.followLabel')}
                      </NoOutlineButton>
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Typography sx={{ color: 'white', textAlign: 'center', fontWeight: 500 }}>
                {t('profile.noFollowers')}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
