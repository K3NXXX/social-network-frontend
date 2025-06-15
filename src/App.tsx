import { Box } from '@mui/material';
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
import NotificationPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import UserPublicProfile from './pages/UserPublicProfile';
import { AuthProvider } from './services/AuthContext';
import EditProfilePage from './pages/EditUserPage.tsx';
import SearchSidebar from './components/Sidebar/SearchSidebar.tsx';
import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext.tsx';

function App() {
  const { pathname } = useLocation();
  const hideLayout = pathname === PAGES.LOGIN || pathname === PAGES.REGISTER;
  const [searchSidebarCollapsed, setSearchSidebarCollapsed] = useState<boolean>(true);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Box display="flex" sx={{ width: '100%', minHeight: '100vh' }}>
          {!hideLayout && (
            <Box display={'flex'}>
              <Sidebar
                searchSidebarCollapsed={searchSidebarCollapsed}
                setSearchSidebarCollapsed={setSearchSidebarCollapsed}
              />
              <SearchSidebar isCollapsed={searchSidebarCollapsed} />
            </Box>
          )}
          <Box sx={{ width: '100%' }}>
            {!hideLayout && <Header />}
            <Routes>
              <Route path={PAGES.LOGIN} element={<Login />} />
              <Route path={PAGES.REGISTER} element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to={PAGES.HOME} replace />} />
                <Route path={PAGES.PROFILE} element={<ProfilePage />} />
                <Route path={PAGES.EDIT_PROFILE} element={<EditProfilePage />} />
                <Route path={PAGES.HOME} element={<FeedPage />} />
                <Route path={PAGES.FRIENDS} element={<FriendsListPage />} />
                <Route path={PAGES.CHATS} element={<ChatsPage />} />
                <Route path={PAGES.SEARCH} element={<SearchPage />} />
                <Route path={PAGES.NOTIFICATIONS} element={<NotificationPage />} />
                <Route path={`${PAGES.VIEW_PUBLIC_PROFILE}/:id`} element={<UserPublicProfile />} />
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
