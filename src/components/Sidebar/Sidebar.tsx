import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sidebarList } from '../../lists/sidebar.list';
import Logo from '../../ui/Logo';

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: isCollapsed ? '80px' : '300px', // ширина залежить від стану
        background: '#181424',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 500,
        transition: 'width 0.3s ease', // плавна анімація
        overflow: 'hidden',
      }}
    >
      <Box
        mb={3}
        display="flex"
        justifyContent={isCollapsed ? 'center' : 'space-between'} // центруємо іконку, якщо колапс
        alignItems="center"
        padding={isCollapsed ? '0' : '0 12px'}
      >
        {!isCollapsed && <Logo />} {/* Логотип ховаємо при колапсі */}
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
          onClick={toggleCollapse}
        >
          <ArrowForwardIosIcon
            sx={{
              color: 'white',
              fontSize: '14px',
              transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', // поворот стрілочки
              transition: 'transform 0.3s ease',
            }}
          />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        {sidebarList
          .filter((item) => item.id !== 6)
          .map((item) => {
            const isActivePath = pathname === item.url;
            return (
              <Link key={item.id} to={item.url} style={{ textDecoration: 'none', width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isCollapsed ? 0 : '20px', // зменшуємо відступи при колапсі
                    padding: '10px 8px',
                    borderRadius: 4,
                    width: '100%',
                    marginBottom: '10px',
                    backgroundColor: isActivePath ? '#2a2340' : '',
                    '&:hover': {
                      backgroundColor: '#2a2340',
                    },
                    justifyContent: isCollapsed ? 'center' : 'flex-start', // центр іконок при колапсі
                  }}
                >
                  <item.icon sx={{ color: 'white', fontSize: '30px' }} />
                  {!isCollapsed && (
                    <Typography sx={{ color: 'white', fontSize: '17px' }}>{item.label}</Typography>
                  )}
                </Box>
              </Link>
            );
          })}
      </Box>

      {sidebarList
        .filter((item) => item.id === 6)
        .map((item) => (
          <Link key={item.id} to={item.url} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 8px',
                borderRadius: 4,
                width: '100%',
                gap: isCollapsed ? 0 : '20px',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                '&:hover': {
                  backgroundColor: '#2a2340',
                },
              }}
            >
              <item.icon sx={{ color: 'white', fontSize: '30px' }} />
              {!isCollapsed && (
                <Typography sx={{ color: 'white', fontSize: '17px' }}>{item.label}</Typography>
              )}
            </Box>
          </Link>
        ))}
    </Box>
  );
}
