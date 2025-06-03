import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { sidebarList } from '../../lists/sidebar.list';
import Logo from '../../ui/Logo';

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '300px',
        background: '#181424',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 500,
      }}
    >
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="0 12px"
      >
        <Logo />
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
          }}
        >
          <ArrowForwardIosIcon sx={{ color: 'white', fontSize: '14px' }} />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        {sidebarList
          .filter((item) => item.id !== 6)
          .map((item) => {
            const isActivePath = pathname === item.url;
            return (
              <Link key={item.id} to={item.url}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '10px 8px',
                    borderRadius: 4,
                    width: '100%',
                    marginBottom: '10px',
                    backgroundColor: isActivePath ? '#2a2340' : '',
                    '&:hover': {
                      backgroundColor: '#2a2340',
                    },
                  }}
                >
                  <item.icon sx={{ color: 'white', fontSize: '30px' }} />
                  <Typography sx={{ color: 'white', fontSize: '17px' }}>{item.label}</Typography>
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
                gap: '20px',
                padding: '10px 8px',
                borderRadius: 4,
                width: '100%',
                '&:hover': {
                  backgroundColor: '#2a2340',
                },
              }}
            >
              <item.icon sx={{ color: 'white', fontSize: '30px' }} />
              <Typography sx={{ color: 'white', fontSize: '17px' }}>{item.label}</Typography>
            </Box>
          </Link>
        ))}
    </Box>
  );
}
