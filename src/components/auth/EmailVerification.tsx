import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Link,
} from '@mui/material';
import { authService } from '../../services/authService';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerificationComplete,
  onBack,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code || code.length !== 6) {
      setError('Будь ласка, введіть 6-значний код підтвердження');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.verifyEmail(code);
      setSuccess(response.message);
      setTimeout(onVerificationComplete, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Помилка підтвердження електронної пошти');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.resendVerificationCode(email);
      setCountdown(60);
      setCanResend(false);
      setSuccess(response.message);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Не вдалося надіслати код підтвердження');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleVerify} sx={{ mt: 1, width: '100%' }}>
      <Typography variant="body1" gutterBottom>
        На вашу електронну адресу <strong>{email}</strong> було надіслано код підтвердження. Будь
        ласка, введіть його нижче для завершення реєстрації.
      </Typography>

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

      <TextField
        margin="normal"
        required
        fullWidth
        id="verificationCode"
        label="Код підтвердження"
        name="verificationCode"
        autoComplete="off"
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*',
          maxLength: 6,
        }}
        disabled={isLoading}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Підтвердити'}
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onBack}
          disabled={isLoading}
        >
          Назад до форми реєстрації
        </Link>

        <Button
          variant="text"
          onClick={handleResendCode}
          disabled={!canResend || isLoading}
          sx={{ textTransform: 'none' }}
        >
          {canResend ? 'Надіслати код ще раз' : `Доступно через ${countdown}с`}
        </Button>
      </Stack>
    </Box>
  );
};

export default EmailVerification;
