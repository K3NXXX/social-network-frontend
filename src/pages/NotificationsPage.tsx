import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Avatar, Box, Button, Card, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PAGES } from '../constants/pages.constants';
import { authService } from '../services/authService';
import type { User } from '../types/auth';
import GlobalLoader from '../ui/GlobalLoader';
import { formatCreatedAt } from '../utils/dateUtils';
import { useNotificationStore } from '../zustand/stores/notificationStore';

const filterTypeMap: Record<string, string | null> = {
  Всі: null,
  Вподобання: 'LIKE',
  Коментарі: 'COMMENT',
  Підписки: 'NEW_FOLLOWER',
};

export default function NotificationPage() {
  const [activeFilter, setActiveFilter] = useState('Всі');

  const { notifications, fetchNotifications, markAllAsRead, initSocket } = useNotificationStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const filteredNotifications = notifications?.filter((notification) => {
    const type = filterTypeMap[activeFilter];
    if (!type) return true;
    return notification.type === type;
  });

  const changeNotificationType = (type: string) => {
    if (type === 'COMMENT') return 'New comment';
    if (type === 'NEW_FOLLOWER') return 'New follower';
    if (type === 'LIKE') return 'New like';
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setCurrentUser(currentUser);
      } catch (error) {
        console.log('error getting current user: ', error);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    console.log('🔍 NotificationPage useEffect, currentUser:', currentUser);
  }, [currentUser]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
    if (currentUser?.id) {
      initSocket(currentUser.id);
    }
  }, [fetchNotifications, initSocket, currentUser?.id]);

  if (notifications === null) return <GlobalLoader />;

  return (
    <Card
      sx={{
        backgroundColor: 'var(--secondary-color)',
        maxWidth: '965px',
        py: 4,
        mx: 'auto',
        padding: '30px 0 0 0',
        marginTop: '30px',
        marginBottom: '50px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, padding: '0px 30px' }}>
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 600,
            fontFamily: 'Ubuntu, sans-serif',
            color: 'var(--text-color)',
          }}
        >
          Сповіщення
        </Typography>
        <Button
          onClick={markAllAsRead}
          sx={{
            textTransform: 'none',
            color: 'var(--text-color)',
            opacity: 0.7,
            fontSize: 15,
            fontWeight: 400,
            fontFamily: 'Ubuntu, sans-serif',
            '&:hover': { color: 'var(--primary-color)', opacity: 1, background: 'transparent' },
            '&:focus': { border: 'none', outline: 'none' },
          }}
        >
          Позначити все як прочитане
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, paddingBottom: '20px', padding: '0px 30px' }}>
        {Object.keys(filterTypeMap).map((label) => {
          const isActive = activeFilter === label;
          return (
            <Button
              key={label}
              onClick={() => setActiveFilter(label)}
              disableRipple
              sx={{
                textTransform: 'none',
                px: 0,
                minWidth: 'auto',
                color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
                fontWeight: isActive ? 600 : 400,
                fontSize: 16,
                fontFamily: 'Ubuntu, sans-serif',
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

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {filteredNotifications?.map((notification) => (
          <Box
            key={notification.id}
            sx={{
              borderBottom: '1px solid var(--border-color)',
              padding: '20px 0',
              position: 'relative',
            }}
          >
            <Box sx={{ display: 'flex', gap: '0 20px', padding: '0px 30px' }}>
              <Link to={`${PAGES.VIEW_PUBLIC_PROFILE}/${notification.sender.id}`}>
                <Avatar
                  sx={{ width: '60px', height: '60px' }}
                  src={notification.sender.avatarUrl ?? undefined}
                >
                  {notification.sender.firstName[0]}
                </Avatar>
              </Link>
              <Box
                sx={{
                  paddingTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                }}
              >
                <Link to={`${PAGES.VIEW_PUBLIC_PROFILE}/${notification.sender.id}`}>
                  <Typography
                    sx={{
                      fontFamily: 'Ubuntu, sans-serif',
                      fontWeight: 500,
                      color: 'var(--text-color)',
                    }}
                  >
                    {notification.message}
                  </Typography>
                </Link>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0 10px' }}>
                  <Typography
                    sx={{
                      fontFamily: 'Ubuntu, sans-serif',
                      fontWeight: 400,
                      textAlign: 'start',
                      color: 'var(--text-color)',
                      opacity: 0.6,
                    }}
                  >
                    {formatCreatedAt(notification.createdAt)}
                  </Typography>
                  <Box
                    sx={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--secondary-color)',
                    }}
                  ></Box>
                  <Typography
                    sx={{
                      fontFamily: 'Ubuntu, sans-serif',
                      fontWeight: 400,
                      textAlign: 'start',
                      color: 'var(--secondary-color)',
                    }}
                  >
                    {changeNotificationType(notification.type)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: '45px',
                right: '50px',
              }}
            >
              {!notification.isRead ? (
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                  }}
                ></Box>
              ) : (
                <DoneAllIcon sx={{ color: 'var(--primary-color)' }} />
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
