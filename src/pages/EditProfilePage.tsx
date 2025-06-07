import {
  Avatar,
  Box,
  Button,
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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../services/AuthContext.tsx';
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
  const [activeSection, setActiveSection] = useState('edit');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const { t } = useTranslation();

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: '',
    photo: '',
    dateOfBirth: '',
    gender: 'OTHER',
    bio: '',
    location: '',
  });

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Saving profile:', profile);
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

  return (
    <Container maxWidth={false}>
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
                    src={profile.photo}
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
                      {profile.firstName} {profile.lastName}
                    </Typography>
                    <Typography fontSize="14px" fontWeight={400} color="#666">
                      @{profile.username || 'username'}
                    </Typography>
                  </Box>
                </Box>
                <Button variant="contained" size="small">
                  {t('profile.changePhoto')}
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap={3} mb="50px">
                <TextField
                  label={t('profile.firstName')}
                  value={profile.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  InputProps={{
                    sx: {
                      '& .MuiInputBase-input': {
                        px: 2, // 16px
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
                <TextField
                  label={t('profile.username')}
                  value={profile.username}
                  onChange={(e) => handleChange('username', e.target.value)}
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
                    displayEmpty
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
                  {t('profile.saveChangesLabel')}
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
