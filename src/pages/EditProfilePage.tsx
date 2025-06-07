import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig.ts';

const GENDERS = [
  { value: 'MALE', label: 'Чоловік' },
  { value: 'FEMALE', label: 'Жінка' },
  { value: 'OTHER', label: 'Інше' },
];

const sidebarItems = [
  { key: 'edit', label: 'Редагувати профіль' },
  { key: 'privacy', label: 'Приватність акаунту' },
  { key: 'security', label: 'Безпека' },
];

export default function EditProfileLayout() {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('edit');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const { logout } = useAuth();

  const allowedFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'bio', 'location'];

  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updateProfile = allowedFields.reduce(
        (acc, key) => {
          if ((profile as Record<string, any>)[key] !== undefined) {
            acc[key] = (profile as Record<string, any>)[key];
          }
          return acc;
        },
        {} as Record<string, any>
      );

      await axiosInstance.patch('/api/user/profile', updateProfile);

      await fetchProfile();
      setMessage('Профіль успішно оновлено!');
      setMessageType('success');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Не вдалося зберегти зміни.';
      setMessage(msg);
      setMessageType('error');
    } finally {
      setTimeout(() => {
        setMessage('');
        setMessageType(null);
      }, 4000);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosInstance.patch('/api/user/update/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchProfile();
    } catch (err) {
      setMessage('Помилка при завантаженні фото');
      setMessageType('error');
    }
  };

  const handlePhotoDelete = async () => {
    try {
      await axiosInstance.delete('/api/user/delete/avatar');
      await fetchProfile();
    } catch (err) {
      setMessage('Помилка при видаленні фото');
      setMessageType('error');
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/user/profile');
      const formattedDate = response.data.dateOfBirth
        ? new Date(response.data.dateOfBirth).toISOString().split('T')[0]
        : '';

      setProfile({ ...response.data, dateOfBirth: formattedDate });
      setName(response.data.firstName + ' ' + response.data.lastName);
      setError(null);
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
  }, [logout]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <CircularProgress />
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

  return (
    <Container maxWidth={false}>
      {message && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: messageType === 'success' ? '#d0f0d0' : '#ffe0e0',
            color: messageType === 'success' ? '#005500' : '#aa0000',
            border: '1px solid',
            borderColor: messageType === 'success' ? '#91e291' : '#f5a4a4',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            boxShadow: 3,
            zIndex: 1300,
            animation: 'slideDown 0.3s ease-out',
          }}
        >
          <Typography fontSize="14px" fontWeight={500}>
            {message}
          </Typography>
        </Box>
      )}

      <Box display="flex">
        <Box
          sx={{
            width: 240,
            minHeight: '100vh',
            borderRight: '1px solid #e0e0e0',
            px: 2,
          }}
        >
          <Typography textAlign="start" px="10px" fontSize="18px" fontWeight="bold" my={2}>
            {t('profile.settingsLabel')}
          </Typography>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            {sidebarItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  onClick={() => setActiveSection(item.key)}
                  disableRipple
                  sx={{
                    borderRadius: '10px',
                    backgroundColor: activeSection === item.key ? 'action.hover' : 'transparent',
                    color: 'black',
                    '&:hover': {
                      backgroundColor: activeSection === item.key ? 'action.hover' : 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={t(`profile.sidebar.${item.key}`)}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Container maxWidth="sm">
          {activeSection === 'edit' && (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
                mt={2}
                mb="32px"
                bgcolor="action.hover"
                p="16px"
                borderRadius="16px"
              >
                <Box display="flex">
                  <Avatar
                    src={profile.avatarUrl}
                    sx={{ width: 60, height: 60, border: '1px solid #999' }}
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    justifyContent="center"
                    ml="16px"
                  >
                    <Typography fontSize="16px" fontWeight={700}>
                      {name}
                    </Typography>
                    {profile.username && (
                      <Typography fontSize="14px" fontWeight={400} color="#666">
                        @{profile.username}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box display="flex" gap={1}>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    onClick={handlePhotoDelete}
                  >
                    Видалити фото
                  </Button>
                  <Button component="label" variant="contained" size="small">
                    Змінити фото
                    <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                  </Button>
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap={3} mb="50px">
                <TextField
                  label={t('profile.firstName')}
                  value={profile.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  InputProps={{
                    sx: {
                      '& .MuiInputBase-input': {
                        px: 2,
                        py: '10px',
                      },
                      borderRadius: '10px',
                    },
                  }}
                />
                <TextField
                  label={t('profile.lastName')}
                  value={profile.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  InputProps={{
                    sx: {
                      '& .MuiInputBase-input': {
                        px: 2,
                        py: '10px',
                      },
                      borderRadius: '10px',
                    },
                  }}
                />
              </Box>

              <Typography
                fontSize="15px"
                fontWeight="bold"
                color="black"
                textAlign="left"
                px="2px"
                py="16px"
              >
                {t('profile.birthDate')}
              </Typography>
              <Box display="flex" flexDirection="column">
                <TextField
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={profile.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  InputProps={{
                    sx: {
                      '& .MuiInputBase-input': {
                        px: 2,
                        py: '10px',
                        '&::-webkit-calendar-picker-indicator': {
                          filter: 'brightness(0)',
                          cursor: 'pointer',
                        },
                      },
                      borderRadius: '10px',
                    },
                  }}
                />
                <Typography
                  fontSize="15px"
                  fontWeight="bold"
                  color="black"
                  textAlign="left"
                  px="2px"
                  py="16px"
                  mt="32px"
                >
                  {t('profile.gender')}
                </Typography>
                <FormControl fullWidth>
                  <Select
                    labelId="gender-label"
                    value={profile.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    fullWidth
                    sx={{
                      borderRadius: '10px',
                      '& .MuiSelect-select': {
                        px: 2,
                        py: '10px',
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: '10px',
                        },
                      },
                    }}
                  >
                    {GENDERS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(`profile.genders.${option.value.toLowerCase()}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography
                  fontSize="15px"
                  fontWeight="bold"
                  color="black"
                  textAlign="left"
                  px="2px"
                  py="16px"
                  mt="32px"
                >
                  {t('profile.location')}
                </Typography>
                <TextField
                  placeholder="м. Львів"
                  value={profile.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  InputProps={{
                    sx: {
                      '& .MuiInputBase-input': {
                        px: 2,
                        py: '10px',
                        '&::-webkit-calendar-picker-indicator': {
                          filter: 'brightness(0)',
                          cursor: 'pointer',
                        },
                      },
                      borderRadius: '10px',
                    },
                  }}
                />
              </Box>

              <Typography
                fontSize="15px"
                fontWeight="bold"
                color="black"
                textAlign="left"
                px="2px"
                py="16px"
                mt="32px"
              >
                {t('profile.bio')}
              </Typography>
              <TextField
                placeholder="Біо"
                multiline
                rows={2}
                fullWidth
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                InputProps={{
                  sx: {
                    borderRadius: '10px',
                  },
                }}
              />

              <Box my={4} display="flex" justifyContent="end" alignItems="center">
                <Button variant="contained" onClick={handleSubmit}>
                  Зберегти
                </Button>
              </Box>
            </>
          )}

          {activeSection === 'privacy' && (
            <Typography variant="body1">
              🔒 Тут буде налаштування приватності акаунту (в розробці)
            </Typography>
          )}

          {activeSection === 'security' && (
            <Typography variant="body1">🛡️ Тут буде сторінка безпеки (в розробці)</Typography>
          )}
        </Container>
      </Box>
    </Container>
  );
}
