import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from './authService.ts';

interface AuthContextType {
  isAuthenticated: boolean | null;
  loading: boolean;
  initialized: boolean;
  user: any;
  login: typeof authService.login;
  logout: typeof authService.logout;
  refreshUserData: typeof authService.refreshToken;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const loadUser = async () => {
    setLoading(true);
    try {
      const session = await authService.refreshToken();
      if (session) {
        setUser(session.user);
        setAccessToken(session.accessToken);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setAccessToken(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (...args: Parameters<typeof authService.login>) => {
    const session = await authService.login(...args);
    setUser(session.user);
    setAccessToken(session.accessToken);
    setIsAuthenticated(true);
    return session;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        initialized,
        user,
        login,
        logout,
        refreshUserData: authService.refreshToken,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
