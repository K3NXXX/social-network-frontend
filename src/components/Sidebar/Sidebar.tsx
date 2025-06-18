import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PAGES } from '../../constants/pages.constants';
import { useTheme } from '../../contexts/ThemeContext';
import i18n from '../../internationalization/i18n';
import { sidebarList } from '../../lists/sidebar.list';
import { authService } from '../../services/authService';
import Logo from '../../ui/Logo';
import SidebarListItem from './SidebarListItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNotificationStore } from '../../zustand/stores/notificationStore';
import { useEffect } from 'react';
interface SidebarProps {
  searchSidebarCollapsed: boolean;
  setSearchSidebarCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setSearchSidebarCollapsed, searchSidebarCollapsed }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const { t } = useTranslation();

  console.log(i18n.language);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(nextLang);
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const logout = () => {
    authService.logout();
    navigate(PAGES.LOGIN, { replace: true });
  };
  const { notifications, fetchNotifications, initSocket } = useNotificationStore();

  const unreadNotifications = (notifications ?? []).filter((n) => !n.isRead);
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: isCollapsed ? '80px' : '300px',
        background: '#181424',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 500,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Logo + Collapse */}
      <Box
        mb={3}
        display="flex"
        justifyContent={isCollapsed ? 'center' : 'space-between'}
        alignItems="center"
        px={isCollapsed ? 0 : 1.5}
      >
        {!isCollapsed && <Logo />}
        <Box
          sx={{
            cursor: 'pointer',
            p: 1.5,
            borderRadius: 1,
            transition: 'background-color 0.3s ease',
            '&:hover': { backgroundColor: '#2a2340' },
            display: 'flex',
            justifyContent: 'center',
          }}
          onClick={toggleCollapse}
        >
          <ArrowForwardIosIcon
            sx={{
              color: 'white',
              fontSize: 14,
              transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </Box>
      </Box>

      {/* Меню без стандартного Notifications */}
      <Box sx={{ flexGrow: 1 }}>
        {sidebarList
          .filter(
            (item) =>
              item.id !== 7 && // мова
              item.id !== 8 && // logout
              item.url !== PAGES.NOTIFICATIONS
          )
          .map((item) => {
            const isActive = pathname === item.url;
            if (item.id !== 5) {
              return (
                <Link
                  key={item.id}
                  to={item.url!}
                  style={{ textDecoration: 'none', width: '100%' }}
                >
                  <SidebarListItem
                    item={item}
                    onClickCallback={undefined}
                    backgroundColor={isActive ? '#2a2340' : ''}
                    isCollapsed={isCollapsed}
                  />
                </Link>
              );
            }
            // item.id === 5 — пошук
            return (
              <SidebarListItem
                key={item.id}
                item={item}
                onClickCallback={() => {
                  setIsCollapsed(!isCollapsed);
                  setSearchSidebarCollapsed(!searchSidebarCollapsed);
                }}
                backgroundColor={searchSidebarCollapsed ? '' : '#2a2340'}
                isCollapsed={isCollapsed}
              />
            );
          })}

        {/* Кастомний пункт Notifications з бейджем */}
        <Link to={PAGES.NOTIFICATIONS} style={{ textDecoration: 'none', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: isCollapsed ? 0 : 2.5,
              p: 1,
              borderRadius: 1,
              position: 'relative',
              mb: 1,
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#2a2340' },
              justifyContent: isCollapsed ? 'center' : 'flex-start',
            }}
          >
            <NotificationsNoneIcon sx={{ color: 'white', fontSize: 30 }} />
            {!isCollapsed && (
              <Typography sx={{ color: 'white', fontSize: 17 }}>
                {t('sidebar.notifications')}
              </Typography>
            )}
            {unreadNotifications.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 20,
                  height: 20,
                  bgcolor: '#9885f4',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 700 }}>
                  {unreadNotifications.length}
                </Typography>
              </Box>
            )}
          </Box>
        </Link>
      </Box>

      {/* Перемикач теми */}
      <Box
        onClick={toggleTheme}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isCollapsed ? 0 : 2.5,
          p: 1,
          borderRadius: 1,
          mb: 1,
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#2a2340' },
          justifyContent: isCollapsed ? 'center' : 'flex-start',
        }}
      >
        {theme === 'light' ? (
          <DarkModeIcon sx={{ color: 'white', fontSize: 30 }} />
        ) : (
          <LightModeIcon sx={{ color: 'white', fontSize: 30 }} />
        )}
        {!isCollapsed && (
          <Typography sx={{ color: 'white', fontSize: 17 }}>
            {theme === 'light' ? t('sidebar.themeSwitchLight') : t('sidebar.themeSwitchDark')}
          </Typography>
        )}
      </Box>

      {/* Logout */}
      {sidebarList
        .filter((item) => item.id === 8)
        .map((item) => (
          <Link key={item.id} to={item.url!} style={{ textDecoration: 'none', width: '100%' }}>
            <SidebarListItem
              item={item}
              onClickCallback={logout}
              backgroundColor=""
              isCollapsed={isCollapsed}
            />
          </Link>
        ))}
    </Box>
  );
};

export default Sidebar;
