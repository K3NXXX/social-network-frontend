import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './services/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProfilePage from './pages/ProfilePage';
import FriendsListPage from './pages/FriendsListPage';
import ChatsPage from './pages/ChatsPage';
import SearchPage from './pages/SearchPage';
import FeedPage from './pages/FeedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
