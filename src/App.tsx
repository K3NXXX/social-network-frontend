import { Box, ThemeProvider, createTheme } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChatsPage from './pages/ChatsPage';
import FeedPage from './pages/FeedPage';
import FriendsListPage from './pages/FriendsListPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import { AuthProvider } from './services/AuthContext';

function App() {
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
          <Sidebar />
          <Box sx={{ width: '100%' }}>
            <Header />
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
          </Box>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
