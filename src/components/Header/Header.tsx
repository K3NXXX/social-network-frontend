import { Box, Breadcrumbs, Card, Link as MUILink, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PAGES } from '../../constants/pages.constants';
import { useTheme } from '../../contexts/ThemeContext';
import { authService } from '../../services/authService';
import type { User } from '../../types/auth';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const { theme } = useTheme();

  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const result = await authService.getCurrentUser();
        setUser(result);
      } catch (error) {
        console.log('Error getting current user: ', error);
        setUser(null);
      }
    };
    getCurrentUser();
  }, []);

  if (!user) return null;

  return (
    <Card
      sx={{
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--background-color)',
        boxShadow: 'none',
        padding: '20px',
        position: 'sticky',
        top: '0',
        zIndex: 500,
        overflow: 'visible',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            paddingLeft: '10px',
            fontSize: '17px',
            color: theme === 'light' ? '#626166' : '#ffffff',
          }}
        >
          <MUILink
            component={Link}
            to="/"
            underline="hover"
            sx={{
              color: theme === 'light' ? '#626166' : '#ffffff',
              fontWeight: 500,
              fontFamily: 'Ubuntu',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Vetra
          </MUILink>

          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const label = decodeURIComponent(value);

            return isLast ? (
              <Typography
                key={to}
                sx={{
                  fontWeight: 500,
                  fontFamily: 'Ubuntu',
                  textTransform: 'capitalize',
                  fontSize: '17px',
                }}
              >
                {label}
              </Typography>
            ) : (
              <MUILink
                key={to}
                component={Link}
                to={to}
                underline="hover"
                sx={{
                  color: '#2c2452',
                  fontWeight: 500,
                  fontFamily: 'Ubuntu',
                  textTransform: 'capitalize',
                  fontSize: '17px',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {label}
              </MUILink>
            );
          })}
        </Breadcrumbs>

        <Box textAlign="right">
          <Link to={PAGES.PROFILE} style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 500,
                letterSpacing: '0.5px',
                color: theme === 'light' ? '#2c2452' : '#ffffff',
                fontFamily: 'Ubuntu',
              }}
            >
              Welcome back, {user.firstName}!
            </Typography>
          </Link>
        </Box>
      </Box>
    </Card>
  );
}
