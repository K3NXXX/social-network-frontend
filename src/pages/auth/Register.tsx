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
  Fade,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import Logo from '../../components/auth/Logo';
import EmailVerification from '../../components/auth/EmailVerification';
import { formatErrorMessage, logErrorDetails } from '../../services/errorHandling';
import { authService } from '../../services/authService';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const { loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.firstName.trim()) {
      errors.firstName = "Ім'я обов'язкове";
      valid = false;
    } else if (formData.firstName.length < 2) {
      errors.firstName = "Ім'я має бути довшим за 1 символ";
      valid = false;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Прізвище обов'язкове";
      valid = false;
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Прізвище має бути довшим за 1 символ';
      valid = false;
    }

    if (!formData.email) {
      errors.email = "Електронна пошта обов'язкова";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Електронна пошта невірна';
      valid = false;
    }

    if (!formData.password) {
      errors.password = "Пароль обов'язковий";
      valid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Пароль має бути довшим за 7 символів';
      valid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Паролі не співпадають';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    try {
      const { email } = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setPendingEmail(email);
      setIsVerificationStep(true);
      setSubmitError(null);
    } catch (error) {
      logErrorDetails(error);
      setSubmitError(formatErrorMessage(error));
    }
  };

  const handleVerificationComplete = () => {
    navigate('/');
  };

  const handleBackToForm = () => {
    setIsVerificationStep(false);
    setSubmitError(null);
  };

  const handleSubmit = isVerificationStep ? () => {} : handleRegister;

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
            Зареєструватись у СоцМережі
          </Typography>

          {submitError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box sx={{ width: '100%' }}>
            {isVerificationStep ? (
              <Fade in={isVerificationStep}>
                <div>
                  <EmailVerification
                    email={pendingEmail}
                    onVerificationComplete={handleVerificationComplete}
                    onBack={handleBackToForm}
                  />
                </div>
              </Fade>
            ) : (
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1, width: '100%' }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="Ім'я"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Прізвище"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Електронна пошта"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Підтвердження пароля"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Зареєструватись'}
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <Link component={RouterLink} to="/login" variant="body2">
                    {'Вже маєте обліковий запис? Увійти'}
                  </Link>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
