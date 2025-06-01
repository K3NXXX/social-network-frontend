import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from './authService';
import type { AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';
import axios from 'axios';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
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

  const loadUser = async () => {
    try {
      setAuth(prev => ({ ...prev, loading: true }));
      
      
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
       
        try {
          const parsedUser = JSON.parse(storedUser);
          
      
          setAuth({
            user: parsedUser,
            accessToken: storedToken,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          
         
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          
          try {
            const response = await axios.post(
              'https://vetra-8c5dfe3bdee7.herokuapp.com/api/auth/refresh',
              {},
              { withCredentials: true }
            );

            if (response.data && response.data.accessToken) {
             
              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('user', JSON.stringify(response.data.user));
              
              
              axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
              
              
              setAuth(prev => ({
                ...prev,
                user: response.data.user,
                accessToken: response.data.accessToken,
                isAuthenticated: true,
              }));
            }
          } catch (refreshError) {
            console.log('Token refresh failed but continuing with existing token:', refreshError);
            
          }
          
          return; 
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);

          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      }
      
      
      try {
        const response = await axios.post(
          'https://vetra-8c5dfe3bdee7.herokuapp.com/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        if (response.data && response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          
          setAuth({
            user: response.data.user,
            accessToken: response.data.accessToken,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } else {
          
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          
          setAuth({
            ...initialAuthState,
            loading: false,
          });
        }
      } catch (error) {
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        console.error('Error refreshing token:', error);
        setAuth({
          ...initialAuthState,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      setAuth({
        ...initialAuthState,
        loading: false,
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      const response = await authService.login(credentials);
      
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
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

  const logout = async () => {
    try {
      setAuth(prev => ({ ...prev, loading: true }));
      await authService.logout();
    } finally {
      setAuth({
        ...initialAuthState,
        loading: false,
      });
      window.location.href = '/login';
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await axios.post(
        'https://vetra-8c5dfe3bdee7.herokuapp.com/api/auth/refresh',
        {},
        { withCredentials: true }
      );

      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setAuth(prev => ({
          ...prev,
          user: response.data.user,
          accessToken: response.data.accessToken,
          isAuthenticated: true,
          error: null,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      
    }
  };

  const value = {
    ...auth,
    login,
    register,
    logout,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 