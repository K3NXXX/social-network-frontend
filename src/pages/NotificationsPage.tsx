import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Avatar, Box, Button, Card, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  // Підтягуємо існуючі сповіщення
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Фільтрація + сортування за датою
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
      }}
    >
      {/* Заголовок */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 600,
            fontFamily: 'Ubuntu, sans-serif',
          }}
        >
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

      {/* Фільтри */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          px: 3,
          pb: 2,
          mb: 4,
        }}
      >
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
                '&:hover': { background: 'transparent' },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>

      {/* Список сповіщень */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {filteredNotifications.map((notification) => {
          const postId = notification.post?.id;
          return (
            <Box
              key={notification.id}
              sx={{
                borderBottom: '1px solid #d4d4d4',
                py: 2,
                px: 3,
                position: 'relative',
                cursor: postId ? 'pointer' : 'default',
              }}
              onClick={async () => {
                if (postId) {
                  await markOneAsRead(notification.id);
                  navigate(`${PAGES.POST}/${postId}`, {
                    state: { backgroundLocation: location },
                  });
                }
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link
                  to={`${PAGES.VIEW_PUBLIC_PROFILE}/${notification.sender.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Avatar
                    sx={{ width: 60, height: 60 }}
                    src={notification.sender.avatarUrl ?? undefined}
                  >
                    {notification.sender.firstName.charAt(0)}
                  </Avatar>
                </Link>
                <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column' }}>
                  <Link
                    to={`${PAGES.VIEW_PUBLIC_PROFILE}/${notification.sender.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Ubuntu, sans-serif',
                        fontWeight: 500,
                        color: 'black',
                      }}
                    >
                      {notification.message}
                    </Typography>
                  </Link>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Ubuntu, sans-serif',
                        fontWeight: 400,
                        color: 'gray',
                      }}
                    >
                      {formatCreatedAt(notification.createdAt)}
                    </Typography>
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: 'gray',
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: 'Ubuntu, sans-serif',
                        fontWeight: 400,
                        color: 'gray',
                      }}
                    >
                      {{
                        COMMENT: 'New comment',
                        NEW_FOLLOWER: 'New follower',
                        LIKE: 'New like',
                      }[notification.type] || ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: 32,
                  right: 32,
                }}
              >
                {!notification.isRead ? (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#7362cc',
                    }}
                  />
                ) : (
                  <DoneAllIcon sx={{ color: '#7362cc' }} />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
}
