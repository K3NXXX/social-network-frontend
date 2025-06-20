import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PAGES } from '../../constants/pages.constants';
import { useTheme } from '../../contexts/ThemeContext';
import i18n from '../../internationalization/i18n';
import { sidebarList } from '../../lists/sidebar.list';
import { authService } from '../../services/authService';
import Logo from '../../ui/Logo';
import { useNotificationStore } from '../../zustand/stores/notificationStore';
import SidebarListItem from './SidebarListItem';

interface SidebarProps {
  searchSidebarCollapsed: boolean;
  setSearchSidebarCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ searchSidebarCollapsed, setSearchSidebarCollapsed }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const { notifications, fetchNotifications, initSocket, disconnectSocket } =
    useNotificationStore();

  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.id) {
      fetchNotifications();
      initSocket(user.id);
    }
    return () => {
      disconnectSocket();
    };
  }, [fetchNotifications, initSocket, disconnectSocket]);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const logout = () => {
    disconnectSocket();
    authService.logout();
    navigate(PAGES.LOGIN, { replace: true });
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: isCollapsed ? 80 : 300,
        background: '#181424',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 500,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
      }}
    >
      <Box
        mb={3}
        display="flex"
        justifyContent={isCollapsed ? 'center' : 'space-between'}
        alignItems="center"
        px={isCollapsed ? 0 : 1.5}
      >
        {!isCollapsed && <Logo />}
        <Box
          onClick={() => {
            toggleCollapse();
            setSearchSidebarCollapsed(true);
          }}
          sx={{
            cursor: 'pointer',
            p: 1.5,
            borderRadius: 1,
            transition: 'background-color 0.3s ease',
            '&:hover': { backgroundColor: '#2a2340' },
            display: 'flex',
            justifyContent: 'center',
          }}
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

      <Box sx={{ flexGrow: 1 }}>
        {sidebarList
          .filter((item) => item.id !== 7 && item.id !== 8 && item.url !== PAGES.NOTIFICATIONS)
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

            return (
              <SidebarListItem
                key={item.id}
                item={item}
                onClickCallback={() => {
                  setSearchSidebarCollapsed(!searchSidebarCollapsed);
                  setIsCollapsed(false);
                }}
                backgroundColor={searchSidebarCollapsed ? '' : '#2a2340'}
                isCollapsed={isCollapsed}
              />
            );
          })}

        <Link to={PAGES.NOTIFICATIONS} style={{ textDecoration: 'none', width: '100%' }}>
          <Box
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
            <Box sx={{ position: 'relative' }}>
              <NotificationsNoneIcon sx={{ color: 'white', fontSize: 30 }} />
              {unreadCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 18,
                    height: 18,
                    bgcolor: '#9885f4',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 700,
                      position: 'relative',
                      top: 1.3,
                      left: 0.3,
                    }}
                  >
                    {unreadCount}
                  </Typography>
                </Box>
              )}
            </Box>
            {!isCollapsed && (
              <Typography sx={{ color: 'white', fontSize: 17 }}>
                {t('sidebar.notifications')}
              </Typography>
            )}
          </Box>
        </Link>
        {sidebarList
          .filter((item) => item.id === 7)
          .map((item) => (
            <Box
              key={item.id}
              onClick={toggleLanguage}
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
              <item.icon sx={{ color: 'white', fontSize: 30 }} />
              {!isCollapsed && (
                <Typography sx={{ color: 'white', fontSize: 17 }}>{t(item.labelKey)}</Typography>
              )}
            </Box>
          ))}
      </Box>

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
