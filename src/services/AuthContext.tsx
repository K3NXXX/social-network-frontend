import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from './authService';
import type { AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = authService.getAccessToken();
        const refreshToken = authService.getRefreshToken();
        const user = authService.getCurrentUser();
        
        if (accessToken && user) {
          setAuth({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } else {
          setAuth({
            ...initialAuthState,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setAuth({
          ...initialAuthState,
          loading: false,
        });
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      const response = await authService.login(credentials);
      
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred during login',
      }));
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      const response = await authService.register(credentials);
      
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred during registration',
      }));
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAuth({
      ...initialAuthState,
      loading: false,
    });
  };

  const value = {
    ...auth,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 