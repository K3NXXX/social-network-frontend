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
import { useParams } from 'react-router-dom';
import ShowFollowersForm from '../components/users/ShowFollowersForm';
import { usePosts } from '../hooks/usePosts';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { userService } from '../services/userService';
import type { User } from '../types/auth';
import type { UserPublicProfile } from '../types/user';
import GlobalLoader from '../ui/GlobalLoader';
import { NoOutlineButton } from '../ui/NoOutlineButton';

export default function UserPublicProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState<UserPublicProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState(0);
  const displayedTabs = ['Пости', 'Позначене'];
  console.log('user', userData);
  console.log(currentUser);
  console.log(isFollowing);

  const handleChangeTab = (_: any, newValue: number) => {
    setTab(newValue);
  };

  const [isShowFollowersFormOpened, setIsShowFollowersFormOpened] = useState(false);

  const checkIfFollowing = async () => {
    try {
      if (!id) return;
      const currentUser = await authService.getCurrentUser();
      const followings = await userService.getUsersFollowing(currentUser.id);
      const isUserFollowed = followings.some((user: User) => user.id === userData?.id);
      setIsFollowing(isUserFollowed);
      setCurrentUser(currentUser);
    } catch (error) {
      console.log(error);
    }
  };

  // const toggleFollowUser = async (id: string) => {
  //   try {
  //     const isNowFollowing = await userService.followUser(id);
  //     setIsFollowing(isNowFollowing.following);
  //     const updatedData = await userService.getUserPublicProfile(id);
  //     setUserData(updatedData);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const { loading: postLoading, loaderRef } = usePosts(postService.fetchUserPosts);

  useEffect(() => {
    const getUserData = async () => {
      if (!id) return;
      try {
        const data = await userService.getUserPublicProfile(id);
        setUserData(data);
        await checkIfFollowing();
      } catch {
        setUserData(null);
      }
    };
    getUserData();
  }, [id]);

  if (!userData) {
    return <GlobalLoader />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={4}>
        <Box width={220} display="flex" justifyContent="center" alignItems="center">
          <Avatar src={userData.avatarUrl} sx={{ width: 120, height: 120 }} />
        </Box>
        <Box flex={1}>
          <Box display="flex" alignItems="center" flexWrap="wrap" position={'relative'}>
            <Typography fontSize="18px" fontWeight={400}>
              {userData.firstName} {userData.lastName}
            </Typography>
            {userData?.username && (
              <Typography
                fontSize="14px"
                fontWeight={600}
                position="absolute"
                top={26}
                left={0}
                color="#737373"
              >
                @{userData?.username}
              </Typography>
            )}
            <Box display="flex" gap={1} ml={4}>
              <NoOutlineButton variant="contained" size="small">
                Стежити
              </NoOutlineButton>

              <NoOutlineButton variant="contained" size="small">
                Повідомлення
              </NoOutlineButton>
            </Box>
          </Box>

          <Box display="flex" gap={4} marginTop="32px" marginBottom="20px">
            <Box display="flex" gap={0.5}>
              <Typography fontWeight="bold" fontSize="15px">
                {userData.posts.length}
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
                {userData.followers}
              </Typography>
              <Typography color="#737373" fontSize="15px">
                читачі
              </Typography>
            </Box>

            <Box display="flex" gap={0.5}>
              <Typography fontWeight="bold" fontSize="15px">
                {userData.following}
              </Typography>
              <Typography color="#737373" fontSize="15px">
                стежить
              </Typography>
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" alignSelf="start" textAlign="justify">
            <Typography> {userData.bio}</Typography>
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
              {userData.posts.length === 0 && !postLoading ? (
                <Typography align="center" color="#737373">
                  Немає публікацій.
                </Typography>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {userData?.posts?.map((post: any) => (
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
                      <Avatar src={userData.avatarUrl} sx={{ width: 36, height: 36 }} />
                      <Box display="flex" flexDirection="column" alignItems="start">
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                          <Typography fontWeight="bold" fontSize={15} paddingRight="4px">
                            {userData.firstName} {userData.lastName}
                          </Typography>
                          <Typography fontSize={14} fontWeight="normal" color="#737373">
                            @{userData.username}
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
          userId={userData.id}
        />
      )}
    </Container>
  );
}
