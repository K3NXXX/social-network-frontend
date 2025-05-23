import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FriendsListPage from './pages/FriendsListPage';
import ChatsPage from './pages/ChatsPage';
import SearchPage from './pages/SearchPage';
import FeedPage from './pages/FeedPage';

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
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/friends" element={<FriendsListPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/search" element={<SearchPage />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
