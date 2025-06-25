import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Box, Typography } from '@mui/material';
import 'animate.css';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PAGES } from '../../constants/pages.constants';
import { useTheme } from '../../contexts/ThemeContext';
import i18n from '../../internationalization/i18n';
import { sidebarList } from '../../lists/sidebar.list';
import { authService } from '../../services/authService';
import Logo from '../../ui/Logo';
import { useGlobalStore } from '../../zustand/stores/globalStore';
import { useNotificationStore } from '../../zustand/stores/notificationStore';
import SidebarListItem from './SidebarListItem';

interface SidebarMobileProps {
  setSearchSidebarCollapsed: (value: boolean) => void;
}

const SidebarMobile: React.FC<SidebarMobileProps> = ({ setSearchSidebarCollapsed }) => {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setBurgerOpen } = useGlobalStore();

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
      className="animate__animated animate__fadeInLeft"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '270px',
        background: '#181424',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 502,
        transition: 'transform 0.3s ease-in-out',
        '@media (max-width:500px)': {
          display: 'flex',
        },
      }}
    >
      <Box mb={3} display="flex" justifyContent={'space-between'} alignItems="center" px={1.5}>
        {<Logo />}
        <Box
          sx={{
            '@media (max-width:1000px)': {
              display: 'none',
            },
            cursor: 'pointer',
            p: 1.5,
            borderRadius: '16px',
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
              transform: 'rotate(0deg)',
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
                  onClick={() => setBurgerOpen(false)}
                  key={item.id}
                  to={item.url!}
                  style={{ textDecoration: 'none', width: '100%' }}
                >
                  <SidebarListItem
                    item={item}
                    onClickCallback={undefined}
                    backgroundColor={isActive ? '#2a2340' : ''}
                  />
                </Link>
              );
            }

            return (
              <SidebarListItem
                onClickCallback={() => {
                  setSearchSidebarCollapsed(false);
                  setBurgerOpen(false);
                }}
                backgroundColor={isActive ? '#2a2340' : ''}
                key={item.id}
                item={item}
              />
            );
          })}

        <Link
          onClick={() => setBurgerOpen(false)}
          to={PAGES.NOTIFICATIONS}
          style={{ textDecoration: 'none', width: '100%' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              p: 1,
              borderRadius: '16px',
              mb: 1,
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#2a2340' },
              justifyContent: 'flex-start',
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

            <Typography sx={{ color: 'white', fontSize: 17 }}>
              {t('sidebar.notifications')}
            </Typography>
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
                gap: '20px',
                padding: '10px 8px',
                borderRadius: 4,
                width: '100%',
                marginBottom: '10px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#2a2340',
                },
                justifyContent: 'flex-start',
              }}
            >
              <item.icon sx={{ color: 'white', fontSize: 30 }} />

              <Typography
                sx={{
                  color: 'white',
                  fontSize: '17px',
                  opacity: 1,
                  width: 'auto',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.3s ease, width 0.3s ease',
                }}
              >
                {t(item.labelKey)}
              </Typography>
            </Box>
          ))}
      </Box>

      <Box
        onClick={toggleTheme}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '10px 8px',
          borderRadius: 4,
          width: '100%',
          marginBottom: '10px',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#2a2340',
          },
          justifyContent: 'flex-start',
        }}
      >
        {theme === 'light' ? (
          <DarkModeIcon sx={{ color: 'white', fontSize: '30px' }} />
        ) : (
          <LightModeIcon sx={{ color: 'white', fontSize: '30px' }} />
        )}

        <Typography
          sx={{
            color: 'white',
            fontSize: '17px',
            opacity: 1,
            width: 'auto',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.3s ease, width 0.3s ease',
          }}
        >
          {theme === 'light' ? t('sidebar.themeSwitchLight') : t('sidebar.themeSwitchDark')}
        </Typography>
      </Box>

      {sidebarList
        .filter((item) => item.id === 8)
        .map((item) => (
          <Link
            onClick={() => setBurgerOpen(false)}
            key={item.id}
            to={item.url!}
            style={{ textDecoration: 'none', width: '100%' }}
          >
            <SidebarListItem item={item} onClickCallback={logout} backgroundColor="" />
          </Link>
        ))}
    </Box>
  );
};

export default SidebarMobile;
