import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Avatar, Box, Button, Card, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PAGES } from '../constants/pages.constants';
import { userService } from '../services/userService';
import type { Notification } from '../types/notifications';
import GlobalLoader from '../ui/GlobalLoader';
import { formatCreatedAt } from '../utils/dateUtils';

const filterTypeMap: Record<string, string | null> = {
  Всі: null,
  Вподобання: 'LIKE',
  Коментарі: 'COMMENT',
  Підписки: 'NEW_FOLLOWER',
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [activeFilter, setActiveFilter] = useState('Всі');

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

  const markAllAsRead = async () => {
    try {
      await userService.markAllAsRead();
      const updated = notifications?.map((n) => ({ ...n, isRead: true })) ?? [];
      setNotifications(updated);
    } catch (error) {
      console.log('error marking all as read: ', error);
    }
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const result = await userService.getUserNotifications();
        setNotifications(result);
      } catch (error) {
        console.error('error getting notifications: ', error);
        setNotifications(null);
      }
    };
    getNotifications();
  }, []);

  if (!notifications) return <GlobalLoader />;

  return (
    <Card
      sx={{
        maxWidth: '965px',
        py: 4,
        mx: 'auto',
        padding: '30px 0 0 0',
        marginTop: '30px',
        marginBottom: '50px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, padding: '0px 30px' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: 'Ubuntu, sans-serif' }}>
          Сповіщення
        </Typography>
        <Button
          onClick={markAllAsRead}
          sx={{
            textTransform: 'none',
            color: 'gray',
            fontSize: 15,
            fontWeight: 400,
            fontFamily: 'Ubuntu, sans-serif',
            '&:hover': { color: '#7362cc', background: 'transparent' },
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
                color: isActive ? '#7362cc' : '#555',
                fontWeight: isActive ? 600 : 400,
                fontSize: 16,
                fontFamily: 'Ubuntu, sans-serif',
                borderBottom: isActive ? '2px solid #7362cc' : '2px solid transparent',
                borderRadius: 0,
                '&:hover': {
                  color: '#7362cc',
                  background: 'transparent',
                },
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
            sx={{ borderBottom: '1px solid #d4d4d4', padding: '20px 0', position: 'relative' }}
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
                    sx={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: 500, color: 'black' }}
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
                      color: 'gray',
                    }}
                  >
                    {formatCreatedAt(notification.createdAt)}
                  </Typography>
                  <Box
                    sx={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'gray',
                    }}
                  ></Box>
                  <Typography
                    sx={{
                      fontFamily: 'Ubuntu, sans-serif',
                      fontWeight: 400,
                      textAlign: 'start',
                      color: 'gray',
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
                    backgroundColor: '#7362cc',
                  }}
                ></Box>
              ) : (
                <DoneAllIcon sx={{ color: '#7362cc' }} />
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
