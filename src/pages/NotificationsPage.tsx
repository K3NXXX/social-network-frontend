import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Avatar, Box, Button, Card, Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PAGES } from '../constants/pages.constants';
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
  const { notifications, fetchNotifications, markAllAsRead, markOneAsRead } =
    useNotificationStore();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const changeNotificationType = (type: string) => {
    if (type === 'COMMENT') return 'New comment';
    if (type === 'NEW_FOLLOWER') return 'New follower';
    if (type === 'LIKE') return 'New like';
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
    <Card sx={{ maxWidth: 965, mx: 'auto', mt: 4, mb: 6, py: 4 }}>
      {/* Заголовок */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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
            '&:hover': { color: '#7362cc', background: 'transparent' },
          }}
        >
          Позначити все як прочитане
        </Button>
      </Box>

      {/* Таби */}
      <Box sx={{ px: 3, display: 'flex', gap: 3, mb: 1 }}>
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
                minWidth: 'auto',
                fontSize: 16,
                fontFamily: 'Ubuntu, sans-serif',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#7362cc' : '#555',
                borderBottom: isActive ? '2px solid #7362cc' : '2px solid transparent',
                borderRadius: 0,
                '&:hover': { background: 'transparent' },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>
      <Divider />

      {/* Список */}
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
              borderBottom: '1px solid #e0e0e0',
              cursor:
                notification.type === 'NEW_FOLLOWER' || notification.post?.id
                  ? 'pointer'
                  : 'default',
              position: 'relative',
              '&:hover':
                notification.type === 'NEW_FOLLOWER' || notification.post?.id
                  ? { backgroundColor: '#fafafa' }
                  : {},
            }}
          >
            {/* Аватар */}
            <Link
              to={`${PAGES.VIEW_PUBLIC_PROFILE}/${notification.sender.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ textDecoration: 'none', marginRight: 16 }}
            >
              <Avatar
                sx={{ width: 60, height: 60 }}
                src={notification.sender.avatarUrl ?? undefined}
              >
                {notification.sender.firstName.charAt(0)}
              </Avatar>
            </Link>

            {/* Текст */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                to={`${PAGES.VIEW_PUBLIC_PROFILE}/${notification.sender.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: 'none' }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Ubuntu, sans-serif',
                    fontWeight: 500,
                    color: 'black',
                    textAlign: 'left',
                  }}
                >
                  {notification.message}
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
                  {formatCreatedAt(notification.createdAt)}
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

            <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
              {notification.isRead ? (
                <DoneAllIcon sx={{ color: '#7362cc' }} />
              ) : (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#7362cc',
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
