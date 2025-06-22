import {
  Box,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileSection from '../components/user/edit/ProfileSection.tsx';
import SecuritySection from '../components/user/edit/security/SecuritySection.tsx';
import { useAuth } from '../services/AuthContext.tsx';
import axiosInstance from '../services/axiosConfig.ts';

const sidebarItems = [
  { key: 'edit', label: 'Редагувати профіль' },
  { key: 'security', label: 'Безпека' },
];

const EditUserPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [activeSection, setActiveSection] = useState('edit');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const { logout } = useAuth();
  const { t } = useTranslation();

  const allowedFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'bio', 'location'];

  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updateProfile = allowedFields.reduce(
        (acc, key) => {
          if (profile[key] !== undefined) acc[key] = profile[key];
          return acc;
        },
        {} as Record<string, any>
      );

      await axiosInstance.patch('/api/user/profile', updateProfile);
      await fetchProfile();
      setMessage(t('profile.edit.success'));
      setMessageType('success');
    } catch (error: any) {
      const msg = error.response?.data?.message || t('profile.edit.error');
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
      await axiosInstance.patch('/api/user/update/avatar', formData);
      await fetchProfile();
    } catch {
      setMessage(t('profile.edit.errorUploadingAvatar'));
      setMessageType('error');
    }
  };

  const handlePhotoDelete = async () => {
    try {
      await axiosInstance.delete('/api/user/delete/avatar');
      await fetchProfile();
    } catch {
      setMessage(t('profile.edit.errorDeletingAvatar'));
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
      setEmail(response.data.email);
      setUsername(response.data.username);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError(t('profile.edit.sessionExpired'));
        logout?.();
      } else {
        setError(t('profile.edit.loadingProfileError'));
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
        <CircularProgress sx={{ color: 'var(--primary-color)' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {message && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: messageType === 'success' ? '#d0f0d0' : '#ffe0e0',
            color: messageType === 'success' ? '#005500' : '#aa0000',
            borderRadius: '12px',
            p: 0,
            py: 1.5,
            boxShadow: 3,
            zIndex: 1300,
            padding: '0 10px',
          }}
        >
          <Typography fontSize="14px" fontFamily={'Ubuntu, sans-serif'}>
            {message}
          </Typography>
        </Box>
      )}

      <Box display="flex">
        <Box sx={{ width: 240, borderRight: '1px solid var(--border-color)', px: 2 }}>
          <Typography fontSize="18px" fontWeight="bold" my={2} textAlign="left" px={2}>
            {t('profile.settingsLabel')}
          </Typography>
          <List>
            {sidebarItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  selected={activeSection === item.key}
                  onClick={() => setActiveSection(item.key)}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                      borderRadius: '8px',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={t(`profile.sidebar.${item.key}`)}
                    primaryTypographyProps={{
                      fontSize: '15px',
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Container sx={{ width: '40%' }}>
          {activeSection === 'edit' && profile && (
            <ProfileSection
              profile={profile}
              name={name}
              handleChange={handleChange}
              handlePhotoUpload={handlePhotoUpload}
              handlePhotoDelete={handlePhotoDelete}
              handleSubmit={handleSubmit}
            />
          )}
          {activeSection === 'security' && (
            <SecuritySection
              email={email}
              username={username}
              onEmailChange={setEmail}
              onUsernameChange={setUsername}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default EditUserPage;
