import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { formatErrorMessage, logErrorDetails } from '../../services/errorHandling';
import Logo from '../../ui/Logo';
import { useTheme } from '../../contexts/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setSubmitError(null);
      await login(data);
      navigate('/feed');
    } catch (error) {
      logErrorDetails(error);
      setSubmitError(formatErrorMessage(error));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: 'absolute',
            bottom: 30,
            right: 30,
            color: 'var(--text-color)',
            '&:hover': {
              color: 'var(--primary-color)',
            },
            '&:active': {
              border: 'none',
              outline: 'none',
            },
            '&:focus': {
              border: 'none',
              outline: 'none',
            },
          }}
        >
          {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: '12px',
            backgroundColor: 'var(--secondary-color)',
          }}
        >
          <Logo size={'30px'} />
          <Typography
            component="h1"
            variant="h5"
            sx={{
              mb: 3,
              textAlign: 'center',
              color: 'var(--text-color)',
              fontSize: { xs: '1.6rem', sm: '1.6rem' },
              letterSpacing: '0.3px',
              fontFamily: 'Ubuntu',
            }}
          >
            {t('auth.login')}
          </Typography>

          {submitError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1, width: '100%' }}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: t('auth.emailRequired'),
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: t('auth.emailInvalid'),
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={t('auth.email')}
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
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
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: t('auth.passwordRequired'),
                minLength: {
                  value: 8,
                  message: t('auth.passwordTooShort'),
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label={t('auth.password')}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={loading}
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
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: 'var(--primary-color)' }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'var(--primary-color)' }} />
              ) : (
                t('auth.loginLabel')
              )}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{ color: 'var(--primary-color)' }}
              >
                {t('auth.noProfile')}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
export default Login;
