import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Fade,
  IconButton,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import EmailVerification from '../../components/auth/EmailVerification';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../services/AuthContext';
import { authService } from '../../services/authService';
import { formatErrorMessage, logErrorDetails } from '../../services/errorHandling';
import Logo from '../../ui/Logo';
import { NoOutlineButton } from '../../ui/NoOutlineButton';
import { PAGES } from '../../constants/pages.constants';

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
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

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
      errors.firstName = t('auth.firstNameRequired');
      valid = false;
    } else if (formData.firstName.length < 2) {
      errors.firstName = t('auth.firstNameTooShort');
      valid = false;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = t('auth.lastNameRequired');
      valid = false;
    } else if (formData.lastName.length < 2) {
      errors.lastName = t('auth.lastNameTooShort');
      valid = false;
    }

    if (!formData.email) {
      errors.email = t('auth.emailRequired');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('auth.emailInvalid');
      valid = false;
    }

    if (!formData.password) {
      errors.password = t('auth.passwordRequired');
      valid = false;
    } else if (formData.password.length < 8) {
      errors.password = t('auth.passwordTooShort');
      valid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = t('auth.confirmPasswordRequired');
      valid = false;
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = t('auth.passwordsDoNotMatch');
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

  return (
    <Container component="main" maxWidth="xs">
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
            borderRadius: '12px',
            backgroundColor: 'var(--secondary-color)',
          }}
        >
          <Logo size="30px" />
          <Typography
            component="h1"
            variant="h5"
            sx={{
              mb: 3,
              textAlign: 'center',
              color: 'var(--text-color)',
              fontSize: { xs: '1.6rem' },
              letterSpacing: '0.3px',
              fontFamily: 'Ubuntu',
            }}
          >
            {t('auth.createProfileLabel')}
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
                onSubmit={handleRegister}
                noValidate
                sx={{ mt: 1, width: '100%' }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label={t('auth.firstName')}
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
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
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label={t('auth.lastName')}
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
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
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={t('auth.email')}
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
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
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={t('auth.password')}
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
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
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label={t('auth.confirmPassword')}
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
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
                <NoOutlineButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: 'var(--primary-color)', padding: '10px' }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'var(--primary-color)' }} />
                  ) : (
                    t('auth.register')
                  )}
                </NoOutlineButton>
                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component={RouterLink}
                    to={PAGES.LOGIN}
                    variant="body2"
                    sx={{ color: 'var(--primary-color)' }}
                  >
                    {t('auth.alreadyHaveAccount')}
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
