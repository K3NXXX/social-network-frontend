import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { ChangeEvent, FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

const RESEND_COOLDOWN = 60; // seconds

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerificationComplete,
  onBack,
}) => {
  const { t } = useTranslation();

  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!code || code.length !== 6) {
      setError(t('auth.emailVerification.enter6DigitCode'));
      return;
    }
    try {
      setIsLoading(true);
      const response = await authService.verifyEmail(code);
      setSuccess(response.message || t('auth.emailVerification.accountVerified'));
      setTimeout(onVerificationComplete, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('auth.emailVerification.verificationError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccess(null);
    try {
      setIsLoading(true);
      await authService.resendVerificationCode(email);
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
      setSuccess(t('auth.emailVerification.newCodeSent'));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('auth.emailVerification.resendError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
  };

  return (
    <Box component="form" onSubmit={handleVerify} sx={{ mt: 1, width: '100%' }}>
      <Typography variant="body1" gutterBottom>
        {t('auth.emailVerification.codeSentTo')} <strong>{email}</strong>{' '}
        {t('auth.emailVerification.enterCodeBelow')}
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
        label={t('auth.emailVerification.verificationCode')}
        name="verificationCode"
        autoComplete="off"
        autoFocus
        value={code}
        onChange={handleCodeChange}
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
          {isLoading ? <CircularProgress size={24} /> : t('auth.emailVerification.confirm')}
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
          {t('auth.emailVerification.backToRegisterForm')}
        </Link>
        <Button
          variant="text"
          onClick={handleResendCode}
          disabled={!canResend || isLoading}
          sx={{ textTransform: 'none' }}
        >
          {canResend
            ? t('auth.emailVerification.resendCode')
            : t('auth.emailVerification.availableIn', { seconds: countdown })}
        </Button>
      </Stack>
    </Box>
  );
};

export default EmailVerification;
