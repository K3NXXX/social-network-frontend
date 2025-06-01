import axios from 'axios';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth.ts';
import axiosInstance from './axiosConfig.ts';

const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
};

const setSession = (accessToken: string, user: any) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

const handleError = (error: unknown, defaultMessage: string): Error => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.request) {
      return new Error('No response from server. Check internet connection.');
    }
    return new Error(`Request error: ${error.message}`);
  }
  return new Error(defaultMessage);
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);

      const { accessToken, user } = response.data;
      if (accessToken && user) {
        setSession(accessToken, user);
        return { accessToken, user };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Login error:', error);
      throw handleError(error, 'Login failed');
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, credentials);

      const { accessToken, user } = response.data;
      if (accessToken && user) {
        setSession(accessToken, user);
        return { accessToken, user };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Registration error:', error);
      throw handleError(error, 'Registration failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn('Logout request error:', error);
    } finally {
      clearSession();
    }
  },

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const response = await axiosInstance.post(
        AUTH_ENDPOINTS.REFRESH,
        {},
        { withCredentials: true }
      );

      const { accessToken, user } = response.data;
      if (accessToken && user) {
        setSession(accessToken, user);
        return { accessToken, user };
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  },

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};
