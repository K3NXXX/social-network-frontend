import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import Logo from '../../components/auth/Logo';
import { formatErrorMessage, logErrorDetails } from '../../services/errorHandling';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Logo size="large" />
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Увійти до СоцМережі
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
                required: "Електронна пошта обов'язкова",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Невірний формат електронної пошти',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Електронна пошта"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Пароль обов'язковий",
                minLength: {
                  value: 6,
                  message: 'Пароль має бути не менше 6 символів',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={loading}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Увійти'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {'Немає облікового запису? Зареєструватись'}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
