import { Box, IconButton, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import ChangeEmail from './ChangeEmail';
import ChangeUsername from './ChangeUsername';
import ChangePassword from './ChangePassword.tsx';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Props {
  email: string;
  username: string;
  onEmailChange: (newEmail: string) => void;
  onUsernameChange: (newUsername: string) => void;
}

const SecuritySection = ({ email, username, onEmailChange, onUsernameChange }: Props) => {
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openUsernameModal, setOpenUsernameModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  return (
    <Box height="calc(100vh - 94px)">
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          borderRadius: 4,
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          textAlign: 'left',
          backgroundColor: 'var(--secondary-color)',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={2}
          sx={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
          onClick={() => setOpenEmailModal(true)}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'var(--text-color)' }}>
              Email
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-color)' }}>
              {email}
            </Typography>
          </Box>
          <IconButton size="small">
            <ArrowForwardIosIcon fontSize="small" sx={{ color: 'var(--text-color)' }} />
          </IconButton>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={2}
          sx={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
          onClick={() => setOpenUsernameModal(true)}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'var(--text-color)' }}>
              Username
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-color)' }}>
              {username}
            </Typography>
          </Box>
          <IconButton size="small">
            <ArrowForwardIosIcon fontSize="small" sx={{ color: 'var(--text-color)' }} />
          </IconButton>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={2}
          sx={{ cursor: 'pointer' }}
          onClick={() => setOpenPasswordModal(true)}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'var(--text-color)' }}>
              Password
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-color)' }}>
              Змінити пароль
            </Typography>
          </Box>
          <IconButton size="small">
            <ArrowForwardIosIcon fontSize="small" sx={{ color: 'var(--text-color)' }} />
          </IconButton>
        </Box>
      </Paper>

      <ChangeEmail
        open={openEmailModal}
        onClose={() => setOpenEmailModal(false)}
        onEmailUpdated={(newEmail) => {
          onEmailChange(newEmail);
        }}
      />

      <ChangeUsername
        open={openUsernameModal}
        onClose={() => setOpenUsernameModal(false)}
        onUsernameUpdated={(newUsername) => {
          onUsernameChange(newUsername);
        }}
      />
      <ChangePassword open={openPasswordModal} onClose={() => setOpenPasswordModal(false)} />
    </Box>
  );
};

export default SecuritySection;
