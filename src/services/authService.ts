import axios from 'axios';
import axiosInstance from './axiosConfig';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  RegisterResponse,
  ResendVerificationResponse,
  User,
  VerificationResponse,
} from '../types/auth';

const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  REGISTER_CONFIRM: '/api/auth/register/confirm',
  REGISTER_RESEND: '/api/auth/register/resend',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
};

const setSession = (accessToken: string, user: User): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
};

const handleError = (error: unknown, defaultMessage: string): never => {
  console.error(defaultMessage, error);
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      throw new Error(
        Array.isArray(error.response.data.message)
          ? error.response.data.message.join('. ')
          : error.response.data.message
      );
    }
    if (error.response) {
      throw new Error(`${defaultMessage}: ${error.response.statusText}`);
    }
    if (error.request) {
      throw new Error('No response from server. Please check if the backend is running.');
    }
  }
  throw error instanceof Error ? error : new Error(defaultMessage);
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Sending login request:', {
        email: credentials.email,
        passwordProvided: !!credentials.password,
      });
      const response = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
      console.log('Login response:', response.data);

      if (response.data && response.data.accessToken) {
        setSession(response.data.accessToken, response.data.user);
        return response.data;
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      throw handleError(error, 'Login failed');
    }
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      console.log('Sending registration request:', credentials);
      const response = await axiosInstance.post<RegisterResponse>(
        AUTH_ENDPOINTS.REGISTER,
        credentials
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'Registration failed');
    }
  },

  async verifyEmail(code: string): Promise<VerificationResponse> {
    try {
      const response = await axiosInstance.post<VerificationResponse>(
        AUTH_ENDPOINTS.REGISTER_CONFIRM,
        { code }
      );

      if (response.data.accessToken && response.data.user) {
        setSession(response.data.accessToken, response.data.user);
        return response.data;
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      throw handleError(error, 'Email verification failed');
    }
  },

  async resendVerificationCode(email: string): Promise<ResendVerificationResponse> {
    try {
      const response = await axiosInstance.post<ResendVerificationResponse>(
        AUTH_ENDPOINTS.REGISTER_RESEND,
        { email }
      );
      return response.data;
    } catch (error) {
      throw handleError(error, 'Failed to resend verification code');
    }
  },

  logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const response = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH);

      if (response.data && response.data.accessToken) {
        setSession(response.data.accessToken, response.data.user);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};
