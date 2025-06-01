import axios from 'axios';
import axiosInstance from './axiosConfig';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';


const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh'
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Sending login request:', { email: credentials.email, passwordProvided: !!credentials.password });
      const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);
      console.log('Login response:', response.data);
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return {
          accessToken: response.data.accessToken,
          user: response.data.user
        };
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server error response:', error.response.data);
          throw new Error(error.response.data?.message || 'Login failed');
        } else if (error.request) {
          console.error('No response from server', error.request);
          throw new Error('No response from server. Please check if the backend is running.');
        } else {
          console.error('Request error:', error.message);
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw error;
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      console.log('Sending registration request:', credentials);
      const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, credentials);
      console.log('Registration response:', response.data);
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return {
          accessToken: response.data.accessToken,
          user: response.data.user
        };
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server error response:', error.response.data);
          throw new Error(error.response.data?.message || 'Registration failed');
        } else if (error.request) {
          console.error('No response from server', error.request);
          throw new Error('No response from server. Please check if the backend is running.');
        } else {
          console.error('Request error:', error.message);
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
     
      axiosInstance.post(AUTH_ENDPOINTS.LOGOUT).catch(error => {
        console.error('Logout request error:', error);
      });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const response = await axios.post(
        `${axiosInstance.defaults.baseURL}${AUTH_ENDPOINTS.REFRESH}`,
        {},
        { withCredentials: true } 
      );
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return {
          accessToken: response.data.accessToken,
          user: response.data.user
        };
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  },

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}; 