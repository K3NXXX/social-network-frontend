import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar, Box, Container, Divider, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UserPosts from '../components/Post/UserPosts.tsx';
import ShowFollowersForm from '../components/user/ShowFollowersForm.tsx';
import ShowFollowingsForm from '../components/user/ShowFollowingsForm.tsx';
import { useAuth } from '../services/AuthContext.tsx';
import axiosInstance from '../services/axiosConfig.ts';
import type { UserPublicProfile } from '../types/user.ts';
import GlobalLoader from '../ui/GlobalLoader.tsx';
import { NoOutlineButton } from '../ui/NoOutlineButton.tsx';
import { PAGES } from '../constants/pages.constants.ts';

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
  const [error, setError] = useState<string | null>(null);
  const [isShowFollowersFormOpened, setIsShowFollowersFormOpened] = useState(false);
  const [isShowFollowingsFormOpened, setIsShowFollowingsFormOpened] = useState(false);
  const { logout } = useAuth();
  const [tab, setTab] = useState(0);
  const { t } = useTranslation();
  const displayedTabs =
    isPublicProfile && !isThisMe
      ? [t('profile.tabs.posts'), t('profile.tabs.tagged')]
      : [t('profile.tabs.posts'), t('profile.tabs.saved'), t('profile.tabs.tagged')];

  const navigate = useNavigate();

  const handleChangeTab = (_: any, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/user/profile');
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
    <Container maxWidth={false} sx={{ maxWidth: '935px', py: 4 }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={4}>
        <Box width={220} display="flex" justifyContent="center" alignItems="center">
          <Avatar
            src={isPublicProfile ? publicUserData?.avatarUrl : profile?.avatarUrl}
            sx={{ width: 120, height: 120 }}
          />
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
                  sx={{ background: isFollowing ? 'gray' : '#6969BC', textTransform: 'none' }}
                >
                  {isFollowing ? t('profile.followingLabel') : t('profile.followLabel')}
                </NoOutlineButton>
              ) : (
                <NoOutlineButton
                  variant="contained"
                  size="small"
                  onClick={() => navigate(PAGES.EDIT_PROFILE)}
                  sx={{ background: '#6969BC', textTransform: 'none' }}
                >
                  {t('profile.editProfileLabel')}
                </NoOutlineButton>
              )}

              {isPublicProfile && !isThisMe ? (
                <NoOutlineButton
                  variant="contained"
                  size="small"
                  sx={{ background: '#6969BC', textTransform: 'none' }}
                >
                  {t('profile.messageLabel')}
                </NoOutlineButton>
              ) : (
                <NoOutlineButton
                  variant="contained"
                  size="small"
                  sx={{ background: '#6969BC', textTransform: 'none' }}
                >
                  {t('profile.viewArchiveLabel')}
                </NoOutlineButton>
              )}
              {isPublicProfile && (
                <Box
                  sx={{
                    backgroundColor: 'var(--background-color)',
                    padding: '5px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <MoreHorizIcon sx={{ color: 'var(--text-color)' }} />
                </Box>
              )}
            </Box>
          </Box>

          <Box display="flex" gap={4} marginTop="32px" marginBottom="20px">
            <Box display="flex" gap={0.5}>
              <Typography fontWeight="bold" fontSize="15px">
                {isPublicProfile ? publicUserData.posts : profile.posts}
              </Typography>
              <Typography color="#737373" fontSize="15px">
                {t('profile.postsLabel')}
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
                {t('profile.followersLabel')}
              </Typography>
            </Box>

            <Box
              onClick={() => {
                setIsShowFollowingsFormOpened(true);
              }}
              display="flex"
              gap={0.5}
              sx={{ cursor: 'pointer' }}
            >
              <Typography fontWeight="bold" fontSize="15px">
                {isPublicProfile ? publicUserData.following : profile.following}
              </Typography>
              <Typography color="#737373" fontSize="15px">
                {t('profile.followingsLabel')}
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
                backgroundColor: 'var(--primary-color)',
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
                  color: 'var(--text-color)',
                  '&:focus': {
                    outline: 'none',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&.Mui-selected': {
                    transition: 'none',
                    color: 'var(--primary-color)',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box mt={2}>
          {tab === 0 && (
            <>
              <UserPosts isPublicProfile={isPublicProfile} publicUserData={publicUserData} />
            </>
          )}

          {tab === 1 && (
            <Typography align="center" color="#737373">
              {t('profile.noSavedPostsLabel')}
            </Typography>
          )}

          {tab === 2 && (
            <Typography align="center" color="#737373">
              {t('profile.noTaggedPostsLabel')}
            </Typography>
          )}
        </Box>
      </Box>
      {isShowFollowersFormOpened && (
        <ShowFollowersForm
          onClose={() => setIsShowFollowersFormOpened(false)}
          isOpened={isShowFollowersFormOpened}
          userId={isPublicProfile ? publicUserData.id : profile.id}
          setProfile={setProfile}
        />
      )}

      {isShowFollowingsFormOpened && (
        <ShowFollowingsForm
          onClose={() => setIsShowFollowingsFormOpened(false)}
          isOpened={isShowFollowingsFormOpened}
          userId={isPublicProfile ? publicUserData.id : profile.id}
          setProfile={setProfile}
        />
      )}
    </Container>
  );
}
