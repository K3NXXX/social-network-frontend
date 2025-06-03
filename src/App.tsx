import { Box, ThemeProvider, createTheme } from '@mui/material';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import { PAGES } from './constants/pages.constants';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChatsPage from './pages/ChatsPage';
import FeedPage from './pages/FeedPage';
import FriendsListPage from './pages/FriendsListPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import { AuthProvider } from './services/AuthContext';
import NotificationPage from './pages/NotificationsPage';

function App() {
  const { pathname } = useLocation();
  const hideLayout = pathname === PAGES.LOGIN || pathname === PAGES.REGISTER;
  const theme = createTheme({
    palette: {
      primary: {
        main: '#6969cb',
      },
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            fontWeight: 'bolder',
            textTransform: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Box display="flex">
          {!hideLayout && <Sidebar />}
          <Box sx={{ width: '100%' }}>
            {!hideLayout && <Header />}
            <Routes>
              <Route path={PAGES.LOGIN} element={<Login />} />
              <Route path={PAGES.REGISTER} element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to={PAGES.HOME} replace />} />
                <Route path={PAGES.PROFILE} element={<ProfilePage />} />
                <Route path={PAGES.HOME} element={<FeedPage />} />
                <Route path={PAGES.FRIENDS} element={<FriendsListPage />} />
                <Route path={PAGES.CHATS} element={<ChatsPage />} />
                <Route path={PAGES.SEARCH} element={<SearchPage />} />
                <Route path={PAGES.NOTIFICATIONS} element={<NotificationPage />} />
              </Route>
              <Route path="*" element={<Navigate to={PAGES.LOGIN} replace />} />
            </Routes>
          </Box>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
