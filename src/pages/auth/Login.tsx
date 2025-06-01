import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import Logo from '../../components/auth/Logo';
import { formatErrorMessage, logErrorDetails } from '../../services/errorHandling';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

// Interface for form input values
interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // Initialize React Hook Form
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur' // Validate on blur
  });

  // Form submission handler
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setSubmitError(null);
    
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      
      // Make sure authentication state is up to date before navigating
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Add token to default headers to ensure subsequent requests include it
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Login successful, token set in headers:', { tokenExists: !!token });
        
        // Wait a moment for state to update before navigating
        setTimeout(() => {
          navigate('/feed');
        }, 100);
      } else {
        console.error('Login appeared successful but no token was stored');
        setSubmitError('Authentication failed. Please try again.');
      }
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
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Email is invalid'
                }
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
                required: 'Password is required'
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
                {"Немає облікового запису? Зареєструватись"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 