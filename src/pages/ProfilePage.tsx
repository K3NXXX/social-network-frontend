import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Divider,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShowFollowersForm from '../components/users/ShowFollowersForm.tsx';
import { usePosts } from '../hooks/usePosts.tsx';
import { useAuth } from '../services/AuthContext.tsx';
import axiosInstance from '../services/axiosConfig.ts';
import { postService } from '../services/postService.ts';
import type { UserPublicProfile } from '../types/user.ts';
import GlobalLoader from '../ui/GlobalLoader.tsx';
import { NoOutlineButton } from '../ui/NoOutlineButton.tsx';

interface IProfilePageProps {
  isPublicProfile: boolean;
  publicUserData: UserPublicProfile;
  toggleFollowUser: (id: string) => void;
  isFollowing: boolean;
  isThisMe: boolean;
}

export default function ProfilePage({
  isPublicProfile,
  publicUserData,
  toggleFollowUser,
  isFollowing,
  isThisMe,
}: IProfilePageProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isShowFollowersFormOpened, setIsShowFollowersFormOpened] = useState(false);
  const { logout } = useAuth();
  const displayedTabs =
    isPublicProfile && !isThisMe ? ['Пости', 'Позначене'] : ['Пости', 'Збережене', 'Позначене'];

  const navigate = useNavigate();

  const {
    posts,
    // setPosts,
    // page,
    // lastPage,
    loading: postLoading,
    // fetchPosts,
    loaderRef,
  } = usePosts(postService.fetchUserPosts);

  // const displayedPosts = isPublicProfile ? publicUserData?.posts || [] : posts;
  const displayedPosts = posts;
  const handleChangeTab = (_: any, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/user/profile');
        console.log(response.data);
        setProfile(response.data);
      } catch (err: any) {
        console.error('Profile fetch error:', err);
        if (err.response?.status === 401) {
          setError('Сесія завершена. Увійдіть знову.');
          logout?.();
        } else {
          setError('Не вдалося завантажити профіль.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout]);

  if (loading) {
    return <GlobalLoader />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={4}>
        <Box width={220} display="flex" justifyContent="center" alignItems="center">
          <Avatar src={profile.avatarUrl} sx={{ width: 120, height: 120 }} />
        </Box>
        <Box flex={1}>
          <Box display="flex" alignItems="center" flexWrap="wrap" position={'relative'}>
            {isPublicProfile ? (
              <Typography fontSize="18px" fontWeight={400}>
                {publicUserData.firstName} {publicUserData.lastName}
              </Typography>
            ) : (
              <Typography fontSize="18px" fontWeight={400}>
                {profile.firstName} {profile.lastName}
              </Typography>
            )}
            {(isPublicProfile ? publicUserData?.username : profile?.username) && (
              <Typography
                fontSize="14px"
                fontWeight={600}
                position="absolute"
                top={26}
                left={0}
                color="#737373"
              >
                @{isPublicProfile ? publicUserData?.username : profile?.username}
              </Typography>
            )}
            <Box display="flex" gap={1} ml={4}>
              {isPublicProfile && !isThisMe ? (
                <NoOutlineButton
                  onClickCapture={() => toggleFollowUser(publicUserData.id)}
                  variant="contained"
                  size="small"
                  sx={{ backgroundColor: isFollowing ? '#737373' : '' }}
                >
                  Стежити
                </NoOutlineButton>
              ) : (
                <NoOutlineButton
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/profile/edit')}
                >
                  Редагувати профіль
                </NoOutlineButton>
              )}

              {isPublicProfile && !isThisMe ? (
                <NoOutlineButton variant="contained" size="small">
                  Повідомлення
                </NoOutlineButton>
              ) : (
                <NoOutlineButton variant="contained" size="small">
                  Переглянути архів
                </NoOutlineButton>
              )}
              {isPublicProfile && (
                <Box
                  sx={{
                    backgroundColor: '#aaaaaa',
                    padding: '5px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <MoreHorizIcon sx={{ color: 'white' }} />
                </Box>
              )}
            </Box>
          </Box>

          <Box display="flex" gap={4} marginTop="32px" marginBottom="20px">
            <Box display="flex" gap={0.5}>
              <Typography fontWeight="bold" fontSize="15px">
                {isPublicProfile ? publicUserData.posts.length : profile.posts.length}
              </Typography>
              <Typography color="#737373" fontSize="15px">
                публікацій
              </Typography>
            </Box>

            <Box
              onClick={() => {
                setIsShowFollowersFormOpened(true);
              }}
              display="flex"
              gap={0.5}
              sx={{ cursor: 'pointer' }}
            >
              <Typography fontWeight="bold" fontSize="15px">
                {isPublicProfile ? publicUserData.followers : profile.followers}
              </Typography>
              <Typography color="#737373" fontSize="15px">
                підписників
              </Typography>
            </Box>

            <Box display="flex" gap={0.5}>
              <Typography fontWeight="bold" fontSize="15px">
                {isPublicProfile ? publicUserData.following : profile.following}
              </Typography>
              <Typography color="#737373" fontSize="15px">
                підписок
              </Typography>
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" alignSelf="start" textAlign="justify">
            <Typography> {isPublicProfile ? publicUserData.bio : profile.bio}</Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mt: 4 }} />

      <Box>
        <Box display="flex" justifyContent="center">
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            TabIndicatorProps={{
              sx: {
                top: 0,
                height: '1px',
                backgroundColor: 'primary.main',
              },
            }}
          >
            {displayedTabs.map((label, index) => (
              <Tab
                key={label + index}
                label={label}
                sx={{
                  outline: 'none',
                  border: 'none',
                  transition: 'none',
                  '&:focus': {
                    outline: 'none',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&.Mui-selected': {
                    transition: 'none',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box mt={2}>
          {tab === 0 && (
            <>
              {displayedPosts.length === 0 && !postLoading ? (
                <Typography align="center" color="#737373">
                  Немає публікацій.
                </Typography>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {displayedPosts.map((post: any) => (
                    <Box
                      key={post.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        backgroundColor: '#fff',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                      }}
                    >
                      <Avatar src={profile.avatarUrl} sx={{ width: 36, height: 36 }} />
                      <Box display="flex" flexDirection="column" alignItems="start">
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                          <Typography fontWeight="bold" fontSize={15} paddingRight="4px">
                            {profile.firstName} {profile.lastName}
                          </Typography>
                          <Typography fontSize={14} fontWeight="normal" color="#737373">
                            @{profile.username}
                          </Typography>
                          <Typography color="#737373" paddingX="3px">
                            ·
                          </Typography>
                          <Typography fontSize={14} color="#737373">
                            {new Date(post.createdAt).toLocaleString('uk-UA', {
                              day: 'numeric',
                              month: 'long',
                            })}
                          </Typography>
                        </Box>

                        {post.content && (
                          <Typography fontSize={15} textAlign="left">
                            {post.content}
                          </Typography>
                        )}

                        {post.photo && (
                          <Box
                            component="img"
                            src={post.photo}
                            alt="Пост"
                            sx={{
                              width: '100%',
                              borderRadius: 4,
                              objectFit: 'cover',
                              maxHeight: 500,
                              mt: 1,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
              {postLoading && (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress />
                </Box>
              )}
              <div ref={loaderRef} />
            </>
          )}

          {tab === 1 && (
            <Typography align="center" color="#737373">
              Немає збережених публікацій.
            </Typography>
          )}

          {tab === 2 && (
            <Typography align="center" color="#737373">
              Немає позначених публікацій.
            </Typography>
          )}
        </Box>
      </Box>
      {isShowFollowersFormOpened && (
        <ShowFollowersForm
          onClose={() => setIsShowFollowersFormOpened(false)}
          isOpened={isShowFollowersFormOpened}
          userId={profile.id}
        />
      )}
    </Container>
  );
}
