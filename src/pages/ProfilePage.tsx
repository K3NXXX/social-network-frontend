import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useAuth } from '../services/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import EditProfileModal from '../components/profile/EditProfileModal';
import axiosInstance from '../services/axiosConfig.ts';

const ProfilePage = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth(); // якщо хочеш вийти при 401

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/user/profile');
        setProfileData(response.data);
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h5">Завантаження профілю...</Typography>
      </Box>
    );
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

  if (!profileData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6">Дані профілю не знайдено.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  border: '4px solid #6969cb',
                }}
                src={profileData.avatarUrl || '/default-avatar.png'}
                alt={`${profileData.firstName} ${profileData.lastName}`}
              >
                {profileData.firstName?.[0]}
                {profileData.lastName?.[0]}
              </Avatar>

              <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                {profileData.firstName} {profileData.lastName}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                @{profileData.username || 'username'}
              </Typography>

              {profileData.bio && (
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 1, mb: 2 }}>
                  {profileData.bio}
                </Typography>
              )}

              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                fullWidth
              >
                Редагувати профіль
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', mb: 2 }}
            >
              <Box>
                <Typography variant="h6">{profileData.posts.length || 0}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Дописів
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">{(profileData && profileData.following) || 0}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Підписки
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">{(profileData && profileData.followers) || 0}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Підписники
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {profileData.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  📍
                </Typography>
                <Typography variant="body2">{profileData.location}</Typography>
              </Box>
            )}

            {profileData.dateOfBirth && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  🎂
                </Typography>
                <Typography variant="body2">
                  {new Date(profileData.dateOfBirth).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            {profileData.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  📅
                </Typography>
                <Typography variant="body2">
                  Дата реєстрації: {new Date(profileData.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Card>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '67%' } }}>
          <Card sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Дописи" />
              <Tab label="Фото" />
              <Tab label="Друзі" />
              <Tab label="Інфо" />
            </Tabs>
          </Card>

          <Box>
            {tabValue === 0 && (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1">У користувача поки немає дописів.</Typography>
              </Box>
            )}

            {tabValue === 1 && (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1">У користувача поки немає фото.</Typography>
              </Box>
            )}

            {tabValue === 2 && (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1">У користувача поки немає друзів.</Typography>
              </Box>
            )}

            {tabValue === 3 && (
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Основна інформація
                </Typography>
                <Box>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Box sx={{ width: '30%' }}>
                      <Typography variant="body2" color="text.secondary">
                        Повне ім'я
                      </Typography>
                    </Box>
                    <Box sx={{ width: '70%' }}>
                      <Typography variant="body2">
                        {profileData.firstName} {profileData.lastName}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Box sx={{ width: '30%' }}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                    </Box>
                    <Box sx={{ width: '70%' }}>
                      <Typography variant="body2">{profileData.email}</Typography>
                    </Box>
                  </Box>

                  {profileData.gender && (
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <Box sx={{ width: '30%' }}>
                        <Typography variant="body2" color="text.secondary">
                          Стать
                        </Typography>
                      </Box>
                      <Box sx={{ width: '70%' }}>
                        <Typography variant="body2">{profileData.gender}</Typography>
                      </Box>
                    </Box>
                  )}

                  {profileData.dateOfBirth && (
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <Box sx={{ width: '30%' }}>
                        <Typography variant="body2" color="text.secondary">
                          Дата народження
                        </Typography>
                      </Box>
                      <Box sx={{ width: '70%' }}>
                        <Typography variant="body2">
                          {new Date(profileData.dateOfBirth).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {profileData.location && (
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <Box sx={{ width: '30%' }}>
                        <Typography variant="body2" color="text.secondary">
                          Місцезнаходження
                        </Typography>
                      </Box>
                      <Box sx={{ width: '70%' }}>
                        <Typography variant="body2">{profileData.location}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Card>
            )}
          </Box>
        </Box>
      </Box>

      {profileData && (
        <EditProfileModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          userData={profileData}
        />
      )}
    </Container>
  );
};

export default ProfilePage;
