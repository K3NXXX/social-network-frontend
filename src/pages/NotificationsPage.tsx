import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotificationStore } from '../zustand/stores/notificationStore';
import GlobalLoader from '../ui/GlobalLoader';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useTheme } from '../contexts/ThemeContext';
import { PAGES } from '../constants/pages.constants';
import { formatCreatedAt } from '../utils/dateUtils';
import { Avatar, Box, Button, Card, Divider, Typography } from '@mui/material';
import type { Notification } from '../types/notifications';

export default function NotificationPage() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('Всі');
  const { theme } = useTheme();
  const { notifications, fetchNotifications, markAllAsRead, markOneAsRead } =
    useNotificationStore();

  const navigate = useNavigate();
  const location = useLocation();

  const filterTypeMap: Record<string, string | null> = {
    [t('notification.filters.all')]: null,
    [t('notification.filters.likes')]: 'LIKE',
    [t('notification.filters.comments')]: 'COMMENT',
    [t('notification.filters.followers')]: 'NEW_FOLLOWER',
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const changeNotificationType = (type: string) => {
    return t(`notification.types.${type}`);
  };

  const getNotificationMessage = (n: Notification) => {
    return t(`notification.messages.${n.type}`, { name: n.sender.firstName });
  };

  const handleRowClick = async (n: (typeof notifications)[0]) => {
    await markOneAsRead(n.id);

    if (n.type === 'NEW_FOLLOWER') {
      navigate(`${PAGES.VIEW_PUBLIC_PROFILE}/${n.sender.id}`);
    } else if (n.post?.id) {
      navigate(`${PAGES.POST}/${n.post.id}`, {
        state: { backgroundLocation: location },
      });
    }
  };

  const filteredNotifications = (notifications ?? [])
    .filter((n) => {
      const type = filterTypeMap[activeFilter];
      return !type || n.type === type;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (notifications === null) {
    return <GlobalLoader />;
  }

  return (
    <Card
      sx={{
        maxWidth: 965,
        mx: 'auto',
        mt: 4,
        mb: 6,
        py: 4,
        backgroundColor: 'var(--secondary-color)',
        borderRadius: '12px',
        m: { xs: 1.5, sm: 3 },
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 600,
            fontFamily: 'Ubuntu, sans-serif',
            color: 'var(--text-color)',
          }}
        >
          {t('notification.title')}
        </Typography>
        <Button
          onClick={markAllAsRead}
          sx={{
            textTransform: 'none',
            color: 'var(--text-color)',
            fontSize: 15,
            fontWeight: 400,
            '&:hover': { color: 'var(--primary-color)', opacity: 1, background: 'transparent' },
            '&:focus': { border: 'none', outline: 'none' },
          }}
        >
          {t('notification.markAllAsRead')}
        </Button>
      </Box>

      <Box
        sx={{
          px: 3,
          display: 'flex',
          gap: 3,
          mb: 1,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {Object.keys(filterTypeMap).map((label) => {
          const isActive = label === activeFilter;
          return (
            <Button
              key={label}
              disableRipple
              onClick={() => setActiveFilter(label)}
              sx={{
                textTransform: 'none',
                px: 0,
                color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
                minWidth: 'auto',
                fontSize: 16,
                fontFamily: 'Ubuntu, sans-serif',
                fontWeight: isActive ? 600 : 400,
                borderBottom: isActive ? '2px solid var(--primary-color)' : '2px solid transparent',
                borderRadius: 0,
                '&:hover': {
                  color: 'var(--primary-color)',
                  background: 'transparent',
                },
                '&:focus': { border: 'none', outline: 'none' },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>
      <Divider />

      <Box>
        {filteredNotifications.map((notification) => (
          <Box
            key={notification.id}
            onClick={() => handleRowClick(notification)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 3,
              py: 2,
              borderBottom: '1px solid var(--border-color)',
              cursor:
                notification.type === 'NEW_FOLLOWER' || notification.post?.id
                  ? 'pointer'
                  : 'default',
              position: 'relative',
              '&:hover':
                notification.type === 'NEW_FOLLOWER' || notification.post?.id
                  ? { backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fafafa' }
                  : {},
            }}
          >
            <Link
              to={`${PAGES.VIEW_PUBLIC_PROFILE}/${notification.sender.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ textDecoration: 'none', marginRight: 16 }}
            >
              <Avatar
                sx={{
                  width: { xs: 48, sm: 60 },
                  height: { xs: 48, sm: 60 },
                }}
                src={notification.sender.avatarUrl ?? undefined}
              >
                {notification.sender.firstName.charAt(0)}
              </Avatar>
            </Link>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                to={`${PAGES.VIEW_PUBLIC_PROFILE}/${notification.sender.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: 'none' }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 14, sm: 16 },
                    fontFamily: 'Ubuntu, sans-serif',
                    fontWeight: 500,
                    color: 'var(--text-color)',
                    textAlign: 'left',
                  }}
                >
                  {getNotificationMessage(notification)}
                </Typography>
              </Link>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography
                  sx={{
                    fontFamily: 'Ubuntu, sans-serif',
                    fontWeight: 400,
                    color: 'gray',
                    fontSize: 14,
                  }}
                >
                  {formatCreatedAt(notification.createdAt, i18n.language as 'uk' | 'en')}
                </Typography>
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'gray' }} />
                <Typography
                  sx={{
                    fontFamily: 'Ubuntu, sans-serif',
                    fontWeight: 400,
                    color: 'gray',
                    fontSize: 14,
                  }}
                >
                  {changeNotificationType(notification.type)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ position: 'absolute', top: 30, right: 30 }}>
              {notification.isRead ? (
                <DoneAllIcon sx={{ color: '#7362cc' }} />
              ) : (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    position: 'absolute',
                    top: '15px',
                    left: '-16px',
                  }}
                />
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
