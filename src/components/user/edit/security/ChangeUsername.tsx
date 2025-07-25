import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Paper, TextField, Typography } from '@mui/material';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../../services/axiosConfig';
import { NoOutlineButton } from '../../../../ui/NoOutlineButton';

interface Props {
  open: boolean;
  onClose: () => void;
  onUsernameUpdated: (newUsername: string) => void;
}

const ChangeUsername: FC<Props> = ({ open, onClose, onUsernameUpdated }) => {
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const { t } = useTranslation();

  const isValidInstagramUsername = (username: string) => {
    const regex = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{1,20}$/;
    const onlyNumbers = /^\d+$/;
    const startsWithNumber = /^\d/;

    return regex.test(username) && !onlyNumbers.test(username) && !startsWithNumber.test(username);
  };

  const handleSave = async () => {
    if (!isValidInstagramUsername(newUsername)) {
      setMessage(t('profile.edit.incorrectUsername'));
      setMessageType('error');
      return;
    }

    try {
      await axiosInstance.patch('/api/user/account', { newUsername });
      setMessage(t('profile.edit.usernameChanged'));
      setMessageType('success');

      onUsernameUpdated(newUsername);

      setNewUsername('');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Помилка при зміні username');
      setMessageType('error');
    }
  };

  const handleClose = () => {
    onClose();
    setNewUsername('');
    setMessage('');
    setMessageType(null);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        sx={{
          maxWidth: '500px',
          width: '90%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          p: 3,
          borderRadius: 4,
          backgroundColor: 'var(--secondary-color)',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontSize="20px" fontWeight={600} sx={{ color: 'var(--text-color)' }}>
            {t('profile.edit.username')}
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

        <Typography fontSize="15px" mb={2} sx={{ color: 'var(--text-color)' }}>
          {t('profile.edit.enterNewUsername')}
        </Typography>

        <TextField
          fullWidth
          placeholder={t('profile.edit.username')}
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
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
                '&::-webkit-calendar-picker-indicator': {
                  filter: 'brightness(0)',
                  cursor: 'pointer',
                },
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
          disabled={!newUsername}
        >
          {t('profile.edit.save')}
        </NoOutlineButton>
      </Paper>
    </Modal>
  );
};

export default ChangeUsername;
