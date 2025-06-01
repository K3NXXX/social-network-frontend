import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './services/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material';
import { useEffect } from 'react';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProfilePage from './pages/ProfilePage';
import FriendsListPage from './pages/FriendsListPage';
import ChatsPage from './pages/ChatsPage';
import SearchPage from './pages/SearchPage';
import FeedPage from './pages/FeedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// AuthWrapper component to handle authentication state and debug issues
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, accessToken, refreshUserData } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
   
    console.log('Auth state:', { 
      isAuthenticated, 
      loading, 
      hasToken: !!accessToken, 
      storedToken: !!localStorage.getItem('accessToken'),
      currentPath: location.pathname
    });
    
   
    const nonAuthPaths = ['/login', '/register'];
    if (!nonAuthPaths.includes(location.pathname) && 
        !isAuthenticated && 
        (accessToken || localStorage.getItem('accessToken'))) {
      console.log('Attempting to refresh authentication state');
      refreshUserData().catch(err => console.error('Failed to refresh auth state:', err));
    }
  }, [location.pathname, isAuthenticated, loading, accessToken, refreshUserData]);
  
  return <>{children}</>;
};

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#6969cb',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AuthWrapper>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/friends" element={<FriendsListPage />} />
              <Route path="/chats" element={<ChatsPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
