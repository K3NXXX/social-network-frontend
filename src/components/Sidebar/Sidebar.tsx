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

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: isCollapsed ? '80px' : '300px',
        background: '#181424',
        padding: '20px',
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
        padding={isCollapsed ? '0' : '0 12px'}
      >
        {!isCollapsed && <Logo />}
        <Box
          sx={{
            cursor: 'pointer',
            padding: '12px',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: '#2a2340',
            },
            display: 'flex',
            justifyContent: 'center',
          }}
          onClick={() => {
            toggleCollapse();
            setSearchSidebarCollapsed(true);
          }}
        >
          <ArrowForwardIosIcon
            sx={{
              color: 'white',
              fontSize: '14px',
              transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        {sidebarList
          .filter((item) => item.id !== 7 && item.id !== 8)
          .map((item) => {
            const isActivePath = pathname === item.url;
            if (item.id !== 5)
              return (
                <Link
                  key={item.id}
                  to={item.url!}
                  style={{ textDecoration: 'none', width: '100%' }}
                >
                  <SidebarListItem
                    item={item}
                    onClickCallback={undefined}
                    backgroundColor={isActivePath ? '#2a2340' : ''}
                    isCollapsed={isCollapsed}
                  />
                </Link>
              );
            else
              return (
                <SidebarListItem
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

        {sidebarList
          .filter((item) => item.id === 7)
          .map((item) => (
            <Box
              key={item.id}
              onClick={toggleLanguage}
              sx={{
                textDecoration: 'none',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isCollapsed ? 0 : '20px',
                  padding: '10px 8px',
                  borderRadius: 4,
                  width: '100%',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  '&:hover': {
                    backgroundColor: '#2a2340',
                  },
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                }}
              >
                <item.icon sx={{ color: 'white', fontSize: '30px' }} />
                {!isCollapsed && (
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: '17px',
                      opacity: isCollapsed ? 0 : 1,
                      width: isCollapsed ? 0 : 'auto',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      transition: 'opacity 0.3s ease, width 0.3s ease',
                    }}
                  >
                    {t(item.labelKey)}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
      </Box>

      <Box
        onClick={toggleTheme}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: isCollapsed ? 0 : '20px',
          padding: '10px 8px',
          borderRadius: 4,
          width: '100%',
          marginBottom: '10px',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#2a2340',
          },
          justifyContent: isCollapsed ? 'center' : 'flex-start',
        }}
      >
        {theme === 'light' ? (
          <DarkModeIcon sx={{ color: 'white', fontSize: '30px' }} />
        ) : (
          <LightModeIcon sx={{ color: 'white', fontSize: '30px' }} />
        )}
        {!isCollapsed && (
          <Typography
            sx={{
              color: 'white',
              fontSize: '17px',
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.3s ease, width 0.3s ease',
            }}
          >
            {theme === 'light' ? t('sidebar.themeSwitchLight') : t('sidebar.themeSwitchDark')}
          </Typography>
        )}
      </Box>

      {sidebarList
        .filter((item) => item.id === 8)
        .map((item) => (
          <Link key={item.id} to={item.url!} style={{ textDecoration: 'none' }}>
            <SidebarListItem
              item={item}
              onClickCallback={logout}
              backgroundColor={''}
              isCollapsed={isCollapsed}
            />
          </Link>
        ))}
    </Box>
  );
};

export default Sidebar;
