import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FriendsListPage from './pages/FriendsListPage';
import ChatsPage from './pages/ChatsPage';
import SearchPage from './pages/SearchPage';
import FeedPage from './pages/FeedPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/friends" element={<FriendsListPage />} />
      <Route path="/chats" element={<ChatsPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
}

export default AppRoutes;
