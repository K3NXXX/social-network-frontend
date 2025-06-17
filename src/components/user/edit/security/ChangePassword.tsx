import { type FC, useState } from 'react';
import { Box, Button, IconButton, Modal, Paper, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../../../services/axiosConfig';
import { NoOutlineButton } from '../../../../ui/NoOutlineButton';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChangePassword: FC<Props> = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const { t } = useTranslation();

  const handleSave = async () => {
    try {
      await axiosInstance.patch('/api/user/account', {
        currentPassword,
        newPassword,
      });
      setMessage(t('profile.edit.passwordChanged'));
      setMessageType('success');

      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage(err.response?.data?.message || t('profile.edit.passwordError'));
      setMessageType('error');
    }
  };

  const handleClose = () => {
    onClose();
    setCurrentPassword('');
    setNewPassword('');
    setMessage('');
    setMessageType(null);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        sx={{
          width: '450px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          p: 3,
          borderRadius: 4,
          backgroundColor: 'var(--secondary-color)',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontSize="20px" fontWeight={600} sx={{ color: 'var(--text-color)' }}>
            {t('profile.edit.changePassword')}
          </Typography>
          <IconButton
            sx={{
              '&:focus': { outline: 'none' },
              '&:focus-visible': { outline: 'none' },
            }}
            onClick={handleClose}
          >
            <CloseIcon sx={{ color: 'var(--text-color)' }} />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          type="password"
          placeholder={t('profile.edit.currentPassword')}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={!!message && messageType === 'error'}
          sx={{
            mb: 2,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color) !important',
              borderWidth: '1px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--border-color)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '2px',
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--error-color)',
            },
          }}
          InputProps={{
            sx: {
              '& .MuiInputBase-input': {
                px: 2,
                py: '10px',
                color: 'var(--text-color)',
                '&::-webkit-calendar-picker-indicator': {
                  filter: 'brightness(0)',
                  cursor: 'pointer',
                },
              },
              '& input:-webkit-autofill': {
                boxShadow: '0 0 0px 1000px var(--secondary-color) inset !important',
                WebkitTextFillColor: 'var(--text-color) !important',
                caretColor: 'var(--text-color) !important',
              },
              borderRadius: '10px',
            },
          }}
        />
        <TextField
          fullWidth
          type="password"
          placeholder={t('profile.edit.newPassword')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!message && messageType === 'error'}
          helperText={
            messageType === 'error' ? (
              <Typography fontSize="11px" component="span">
                {message}
              </Typography>
            ) : messageType === 'success' ? (
              <Typography fontSize="11px" component="span" color="green">
                {message}
              </Typography>
            ) : (
              ''
            )
          }
          InputProps={{
            sx: {
              '& .MuiInputBase-input': {
                px: 2,
                py: '10px',
                color: 'var(--text-color)',
              },
              '&::-webkit-calendar-picker-indicator': {
                filter: 'brightness(0)',
                cursor: 'pointer',
              },
              borderRadius: '10px',
            },
          }}
          sx={{
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color) !important',
              borderWidth: '1px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--border-color)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '2px',
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--error-color)',
            },
          }}
        />
        <NoOutlineButton
          fullWidth
          variant="contained"
          sx={{ mt: 2, backgroundColor: 'var(--primary-color)' }}
          onClick={handleSave}
          disabled={!currentPassword && !newPassword}
        >
          {t('profile.edit.save')}
        </NoOutlineButton>
      </Paper>
    </Modal>
  );
};

export default ChangePassword;
