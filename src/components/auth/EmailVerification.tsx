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
import { NoOutlineButton } from '../../ui/NoOutlineButton';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

const RESEND_COOLDOWN = 60;

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
      <Typography variant="body1" gutterBottom sx={{ color: 'var(--text-color)' }}>
        {t('auth.emailVerification.codeSentTo')} <strong>{email}</strong>{' '}
        {t('auth.emailVerification.enterCodeBelow')}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2, color: 'var(--primary-color)' }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, color: 'var(--primary-color)' }}>
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
        InputLabelProps={{
          sx: {
            color: 'var(--text-color)',
            '&.Mui-focused': {
              color: 'var(--primary-color)',
            },
            '&.MuiFormLabel-filled': {
              color: 'var(--primary-color)',
            },
          },
        }}
        InputProps={{
          sx: {
            '& input': {
              color: 'var(--text-color)',
            },
            '& input::placeholder': {
              color: 'var(--text-color)',
              opacity: 0.7,
            },
            '& input:-webkit-autofill': {
              boxShadow: '0 0 0px 1000px var(--secondary-color) inset !important',
              WebkitTextFillColor: 'var(--text-color) !important',
              caretColor: 'var(--text-color) !important',
            },
            '& textarea:-webkit-autofill': {
              boxShadow: '0 0 0px 1000px var(--secondary-color) inset !important',
              WebkitTextFillColor: 'var(--text-color) !important',
              caretColor: 'var(--text-color) !important',
            },
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary-color)',
            borderWidth: '1px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-color)',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary-color)',
            borderWidth: '2px',
          },
          '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--error-color)',
          },
        }}
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
        <NoOutlineButton
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading || code.length !== 6}
          sx={{
            backgroundColor: 'var(--primary-color)',
            padding: '10px',
            '&.Mui-disabled': {
              color: 'var(--text-color)',
              opacity: 0.5,
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: 'var(--primary-color)' }} />
          ) : (
            t('auth.emailVerification.confirm')
          )}
        </NoOutlineButton>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onBack}
          disabled={isLoading}
          sx={{ color: 'var(--primary-color)' }}
        >
          {t('auth.emailVerification.backToRegisterForm')}
        </Link>
        <NoOutlineButton
          variant="text"
          onClick={handleResendCode}
          disabled={!canResend || isLoading}
          sx={{
            textTransform: 'none',
            color: 'var(--text-color)',
            '&.Mui-disabled': {
              color: 'var(--text-color)',
              opacity: 0.5,
            },
          }}
        >
          {canResend
            ? t('auth.emailVerification.resendCode')
            : t('auth.emailVerification.availableIn', { seconds: countdown })}
        </NoOutlineButton>
      </Stack>
    </Box>
  );
};

export default EmailVerification;
