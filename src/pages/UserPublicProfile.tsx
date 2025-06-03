import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import type { UserPublicProfile } from '../types/user';

export default function UserPublicProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState<UserPublicProfile | null>(null);

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
  }, [userData]);

  if (!userData) {
    return <Box>Loading...</Box>;
  }
  return <h1>{userData.email}</h1>;
}
