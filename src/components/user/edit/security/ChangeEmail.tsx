import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Paper, TextField, Typography } from '@mui/material';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../../services/axiosConfig';
import { NoOutlineButton } from '../../../../ui/NoOutlineButton';

interface Props {
  open: boolean;
  onClose: () => void;
  onEmailUpdated: (newEmail: string) => void;
}

const ChangeEmail: FC<Props> = ({ open, onClose, onEmailUpdated }) => {
  const [newEmail, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'enter' | 'code'>('enter');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const { t } = useTranslation();

  const handleSendCode = async () => {
    try {
      await axiosInstance.patch('/api/user/account', { newEmail });
      setMessage('');
      setStep('code');
    } catch (err: any) {
      setMessage(err.response?.data?.message || t('profile.edit.errorCode'));
      setMessageType('error');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axiosInstance.post('/api/user/account/email', { code });
      setMessage(t('profile.edit.emailUpdated'));
      setMessageType('success');

      onEmailUpdated(newEmail);

      setEmail('');
      setCode('');
      setStep('enter');
    } catch (err: any) {
      setMessage(err.response?.data?.message || t('profile.edit.invalidCode'));
      setMessageType('error');
    }
  };

  const handleClose = () => {
    onClose();
    setStep('enter');
    setMessage('');
    setMessageType(null);
    setEmail('');
    setCode('');
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        sx={{
          width: '500px',
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
            {t('profile.edit.checkEmail')}
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

        {step === 'enter' ? (
          <>
            <Typography fontSize="15px" mb={2} sx={{ color: 'var(--text-color)' }}>
              {t('profile.edit.enterEmail')}
            </Typography>
            <TextField
              fullWidth
              placeholder={t('profile.edit.email')}
              value={newEmail}
              onChange={(e) => setEmail(e.target.value)}
              error={!!message && messageType === 'error'}
              helperText={messageType === 'error' ? message : ''}
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
              onClick={handleSendCode}
              disabled={!newEmail}
            >
              {t('profile.edit.sendCode')}
            </NoOutlineButton>
          </>
        ) : (
          <>
            <Typography fontSize="15px" mb={2}>
              {t('profile.edit.sentTo')} {newEmail}
            </Typography>
            <TextField
              fullWidth
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
              sx={{ mt: 2 }}
              onClick={handleVerifyCode}
              disabled={!code}
            >
              Continue
            </NoOutlineButton>
          </>
        )}
      </Paper>
    </Modal>
  );
};

export default ChangeEmail;
