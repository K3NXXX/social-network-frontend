import SettingsIcon from '@mui/icons-material/Settings';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import type { UserPublicProfile } from '../types/user';

export default function UserPublicProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState<UserPublicProfile | null>(null);

  const colors = ['#FF6B6B', '#4ECDC4', '#5D9CEC', '#A29BFE', '#E17055', '#20554a'];
  const randomColor = useMemo(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const transformGender = (gender: string) => {
    if (gender === 'MALE') return 'Чоловіча';
    if (gender === 'FEMALE') return 'Жіноча';
    if (gender === 'OTHER') return 'Інша';
  };

  useEffect(() => {
    const getUserData = async () => {
      if (!id) return;
      try {
        const data = await userService.getUserPublicProfile(id);
        setUserData(data);
      } catch {
        setUserData(null);
      }
    };
    getUserData();
  }, [id]);

  console.log(userData);
  if (!userData) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box
      sx={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '32px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
        {userData.avatarUrl ? (
          <Avatar src={userData.avatarUrl} alt="avatar" sx={{ width: 140, height: 140 }} />
        ) : (
          <Avatar
            sx={{
              width: 140,
              height: 140,
              bgcolor: randomColor,
              fontSize: '40px',
              fontWeight: 700,
            }}
          >
            {userData.firstName[0]}
          </Avatar>
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <Typography sx={{ fontSize: '24px', fontWeight: 700 }}>
              {userData.firstName} {userData.lastName}
            </Typography>

            <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#7C4DFF',
                  textTransform: 'none',
                  fontWeight: 700,
                  padding: '6px 18px',
                  borderRadius: '12px',
                  outline: 'none',
                  boxShadow: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                Стежити
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#616161',
                  textTransform: 'none',
                  fontWeight: 700,
                  padding: '6px 18px',
                  borderRadius: '12px',
                  outline: 'none',
                  boxShadow: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                Повідомлення
              </Button>
              <IconButton
                sx={{
                  backgroundColor: '#BDBDBD',
                  '&:hover': { backgroundColor: '#9E9E9E' },
                  outline: 'none',
                  boxShadow: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                <SettingsIcon sx={{ color: 'white' }} />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'start', gap: '0 20px' }}>
            {userData.username && (
              <Typography
                sx={{
                  fontSize: '16px',
                  color: '#757575',
                  fontFamily: 'Ubuntu',
                  fontWeight: 500,
                }}
              >
                @{userData.username}
              </Typography>
            )}
            <Typography
              sx={{
                fontSize: '16px',
                color: '#757575',
                fontFamily: 'Ubuntu',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Читачі: {userData.followers}
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                color: '#757575',
                fontFamily: 'Ubuntu',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Стежить: {userData.following}
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                color: '#757575',
                fontFamily: 'Ubuntu',
                fontWeight: 500,
              }}
            >
              {userData.posts.length} пости
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '8px' }}>
            {userData.dateOfBirth && (
              <Typography
                sx={{
                  fontSize: '16px',
                  color: '#424242',
                  fontFamily: 'Ubuntu',
                  fontWeight: 400,
                }}
              >
                🎂 {dayjs(userData.dateOfBirth).format('DD.MM.YYYY')}
              </Typography>
            )}
            {userData.gender && (
              <Typography
                sx={{
                  fontSize: '16px',
                  color: '#424242',
                  fontFamily: 'Ubuntu',
                  fontWeight: 400,
                }}
              >
                Стать: {transformGender(userData.gender)}
              </Typography>
            )}
          </Box>
          {userData.bio && (
            <Typography
              sx={{
                fontSize: '16px',
                color: '#424242',
                fontFamily: 'Ubuntu',
                fontWeight: 400,
                textAlign: 'start',
              }}
            >
              Біо: {userData.bio}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
