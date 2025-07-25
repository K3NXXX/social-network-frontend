import { Box, Breadcrumbs, Card, Link as MUILink, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { PAGES } from '../../constants/pages.constants';
import { useTheme } from '../../contexts/ThemeContext';
import { authService } from '../../services/authService';
import type { User } from '../../types/auth';
import Logo from '../../ui/Logo';
import { useGlobalStore } from '../../zustand/stores/globalStore';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const { toggleBurger } = useGlobalStore();

  const pathnames = location.pathname.split('/').filter((x) => x);
  const isPublicProfile = location.pathname.startsWith('/user/profile/');

  const translateSegment = (segment: string) => {
    const mapping: Record<string, string> = {
      '': t('breadcrumb.home'),
      profile: t('breadcrumb.profile'),
      user: t('breadcrumb.user'),
      feed: t('breadcrumb.feed'),
      chats: t('breadcrumb.chats'),
      notifications: t('breadcrumb.notifications'),
      edit: t('breadcrumb.edit'),
      archive: t('breadcrumb.archive'),
      post: t('breadcrumb.post'),
    };
    return mapping[segment.toLowerCase()] || decodeURIComponent(segment);
  };

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
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: 500,
        overflow: 'visible',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            pl: 1,
            fontSize: { xs: '15px', sm: '17px' },
            color: theme === 'light' ? '#626166' : '#ffffff',
            flexWrap: 'wrap',
            '@media (max-width:500px)': {
              display: 'none',
            },
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
              fontSize: { xs: '15px', sm: '17px' },
            }}
          >
            Vetra
          </MUILink>

          {isPublicProfile ? (
            <Typography
              sx={{
                color: theme === 'light' ? '#626166' : '#ffffff',
                fontWeight: 500,
                fontFamily: 'Ubuntu',
                fontSize: { xs: '15px', sm: '17px' },
              }}
            >
              {t('breadcrumb.publicProfile')}
            </Typography>
          ) : (
            pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              const label = translateSegment(value);

              return isLast ? (
                <Typography
                  key={to}
                  sx={{
                    color: theme === 'light' ? '#626166' : '#ffffff',
                    fontWeight: 500,
                    fontFamily: 'Ubuntu',
                    textTransform: 'capitalize',
                    fontSize: { xs: '15px', sm: '17px' },
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
                    color: theme === 'light' ? '#2c2452' : '#ffffff',
                    fontWeight: 500,
                    fontFamily: 'Ubuntu',
                    textTransform: 'capitalize',
                    fontSize: { xs: '15px', sm: '17px' },
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {label}
                </MUILink>
              );
            })
          )}
        </Breadcrumbs>

        <Box
          sx={{
            '@media (max-width:500px)': {
              display: 'none',
            },
          }}
          textAlign="right"
        >
          <Link to={PAGES.PROFILE} style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                fontSize: { xs: '15px', sm: '17px' },
                fontWeight: 500,
                letterSpacing: '0.5px',
                color: theme === 'light' ? '#2c2452' : '#ffffff',
                fontFamily: 'Ubuntu',
              }}
            >
              {t('welcome')} {user.firstName}!
            </Typography>
          </Link>
        </Box>

        <Box
          sx={{
            display: 'none',
            '@media (max-width:500px)': {
              display: 'flex',
            },
          }}
        >
          <Logo />
        </Box>

        <Box
          onClick={() => toggleBurger()}
          sx={{
            display: 'none',
            flexDirection: 'column',
            gap: '7px 0',
            '@media (max-width:500px)': {
              display: 'flex',
              flexDirection: 'column',
              gap: '7px 0',
            },
          }}
        >
          <Box
            sx={{ width: '35px', height: '3px', borderRadius: '12px', backgroundColor: '#9885f4' }}
          ></Box>
          <Box
            sx={{ width: '35px', height: '3px', borderRadius: '12px', backgroundColor: '#9885f4' }}
          ></Box>
          <Box
            sx={{ width: '35px', height: '3px', borderRadius: '12px', backgroundColor: '#9885f4' }}
          ></Box>
        </Box>
      </Box>
    </Card>
  );
}
