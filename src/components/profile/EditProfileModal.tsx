import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Box,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  InputAdornment
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import type { User } from '../../types/auth';
import axios from 'axios';
import axiosInstance from '../../services/axiosConfig';
import { useAuth } from '../../services/AuthContext';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  userData: User;
}

interface ProfileFormData {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  bio: string;
  firstName: string;
  lastName: string;
  username: string;
  location: string;
  dateOfBirth: Date | null;
  gender: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose, userData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  const { refreshUserData, logout } = useAuth();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    email: userData?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    bio: userData?.bio || '',
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    username: userData?.username || '',
    location: userData?.location || '',
    dateOfBirth: userData?.dateOfBirth ? new Date(userData.dateOfBirth) : null,
    gender: userData?.gender || '',
  });
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date,
    }));
  };
  
  const handleTogglePasswordVisibility = (field: string) => {
    if (field === 'currentPassword') {
      setShowPassword(!showPassword);
    } else if (field === 'newPassword') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setAvatarUploading(true);
      setError(null);
      
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      
      await axiosInstance.patch('/api/user/uploadAvatar', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess('Аватар успішно оновлено');
      if (refreshUserData) await refreshUserData();
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Помилка при завантаженні аватару');
      } else {
        setError('Помилка при завантаженні аватару');
      }
    } finally {
      setAvatarUploading(false);
    }
  };
  
  const handleDeleteAvatar = async () => {
    try {
      setAvatarUploading(true);
      setError(null);
      
      await axiosInstance.delete('/api/user/deleteAvatar');
      
      setSuccess('Аватар успішно видалено');
      if (refreshUserData) await refreshUserData();
      
    } catch (error) {
      console.error('Error deleting avatar:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Помилка при видаленні аватару');
      } else {
        setError('Помилка при видаленні аватару');
      }
    } finally {
      setAvatarUploading(false);
    }
  };
  
  const validateForm = () => {
    if (activeTab === 0) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('Ім\'я та прізвище є обов\'язковими полями');
        return false;
      }
    } else if (activeTab === 1) {
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setError('Паролі не співпадають');
        return false;
      }
      
      if (formData.newPassword && !formData.currentPassword) {
        setError('Введіть поточний пароль для зміни пароля');
        return false;
      }
      
      if (!formData.currentPassword) {
        setError('Поточний пароль потрібен для збереження змін');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updateData: Record<string, any> = {
        currentPassword: formData.currentPassword,
      };
      
      if (activeTab === 0) {
        
        if (formData.bio !== userData?.bio) updateData.bio = formData.bio;
        if (formData.firstName !== userData?.firstName) updateData.firstName = formData.firstName;
        if (formData.lastName !== userData?.lastName) updateData.lastName = formData.lastName;
        if (formData.username !== userData?.username) updateData.username = formData.username;
        if (formData.location !== userData?.location) updateData.location = formData.location;
        if (formData.dateOfBirth !== userData?.dateOfBirth) {
          updateData.dateOfBirth = formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null;
        }
        if (formData.gender !== userData?.gender) updateData.gender = formData.gender;
      } else if (activeTab === 1) {

        if (formData.email !== userData?.email) updateData.email = formData.email;
        if (formData.newPassword) updateData.newPassword = formData.newPassword;
      }
      
      await axiosInstance.patch('/api/user/update', updateData);
      
      setSuccess('Профіль успішно оновлено');
      if (refreshUserData) await refreshUserData();
      

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Помилка при оновленні профілю');
      } else {
        setError('Помилка при оновленні профілю');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Помилка при виході з акаунту');
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Особиста інформація" />
          <Tab label="Налаштування акаунту" />
        </Tabs>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={userData?.avatarUrl || undefined}
                    alt={`${userData?.firstName} ${userData?.lastName}`}
                    sx={{ width: 100, height: 100 }}
                  >
                    {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                  </Avatar>
                  
                  {avatarUploading && (
                    <CircularProgress
                      size={100}
                      thickness={2}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        color: 'primary.main',
                      }}
                    />
                  )}
                  
                  <Box sx={{ display: 'flex', mt: 1, justifyContent: 'center' }}>
                    <input
                      accept="image/*"
                      id="avatar-upload"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleAvatarUpload}
                      disabled={avatarUploading}
                    />
                    <label htmlFor="avatar-upload">
                      <IconButton 
                        component="span" 
                        color="primary" 
                        disabled={avatarUploading}
                      >
                        <AddAPhotoIcon />
                      </IconButton>
                    </label>
                    
                    {userData?.avatarUrl && (
                      <IconButton 
                        color="error" 
                        onClick={handleDeleteAvatar}
                        disabled={avatarUploading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>
              
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="Ім'я"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                
                <TextField
                  required
                  fullWidth
                  label="Прізвище"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Ім'я користувача"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">@</InputAdornment>
                }}
              />
              
              <TextField
                fullWidth
                label="Про себе"
                name="bio"
                multiline
                rows={3}
                value={formData.bio || ''}
                onChange={handleInputChange}
              />
              
              <TextField
                fullWidth
                label="Місцезнаходження"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: '50%' }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Дата народження"
                      value={formData.dateOfBirth}
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                
                <Box sx={{ width: '50%' }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Стать</FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleInputChange}
                    >
                      <FormControlLabel value="MALE" control={<Radio />} label="Чоловіча" />
                      <FormControlLabel value="FEMALE" control={<Radio />} label="Жіноча" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>
              
              <Box>
                <TextField
                  required
                  fullWidth
                  label="Поточний пароль"
                  name="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleTogglePasswordVisibility('currentPassword')}>
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  * Потрібно для збереження змін
                </Typography>
              </Box>
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              
              <TextField
                required
                fullWidth
                label="Поточний пароль"
                name="currentPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleTogglePasswordVisibility('currentPassword')}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                fullWidth
                label="Новий пароль"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleTogglePasswordVisibility('newPassword')}>
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                fullWidth
                label="Підтвердження нового паролю"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleTogglePasswordVisibility('confirmPassword')}>
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  fullWidth
                  onClick={handleLogout}
                >
                  Вихід з акаунту
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Скасувати
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Зберегти зміни'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal; 