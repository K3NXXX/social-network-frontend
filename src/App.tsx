import { Box } from '@mui/material';
import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/Header/Header';
import SearchSidebar from './components/Sidebar/SearchSidebar.tsx';
import Sidebar from './components/Sidebar/Sidebar';
import { PAGES } from './constants/pages.constants';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChatsPage from './pages/ChatsPage';
import EditProfilePage from './pages/EditUserPage.tsx';
import FeedPage from './pages/FeedPage';
import NotificationPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import UserPublicProfile from './pages/UserPublicProfile';
import { AuthProvider } from './services/AuthContext';
import FullPostPage from './pages/FullPostPage';
import NotificationProvider from './utils/NotificationProvider.tsx';
import ArchivePage from './pages/ArchivePage.tsx';
import { useGlobalStore } from './zustand/stores/globalStore.ts';
import SidebarMobile from './components/Sidebar/SidebarMobile.tsx';

function App() {
  const { pathname } = useLocation();
  const hideLayout = pathname === PAGES.LOGIN || pathname === PAGES.REGISTER;
  const [searchSidebarCollapsed, setSearchSidebarCollapsed] = useState<boolean>(true);
  const { isBurgerOpen } = useGlobalStore();

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider />
        <Box display="flex" sx={{ width: '100%', minHeight: '100vh' }}>
          {!hideLayout && (
            <Box display={'flex'}>
              <Sidebar
                searchSidebarCollapsed={searchSidebarCollapsed}
                setSearchSidebarCollapsed={setSearchSidebarCollapsed}
              />
              {isBurgerOpen && (
                <SidebarMobile setSearchSidebarCollapsed={setSearchSidebarCollapsed} />
              )}
              <SearchSidebar
                isCollapsed={searchSidebarCollapsed}
                setSearchSidebarCollapsed={setSearchSidebarCollapsed}
              />
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
                <Route path={PAGES.ARCHIVE} element={<ArchivePage />} />
                <Route path={PAGES.CHATS} element={<ChatsPage />} />
                <Route path={PAGES.NOTIFICATIONS} element={<NotificationPage />} />
                <Route path={`${PAGES.POST}/:postId`} element={<FullPostPage />} />
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
