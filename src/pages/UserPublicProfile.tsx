import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type { User } from '../types/auth';
import type { UserPublicProfile } from '../types/user';
import ProfilePage from './ProfilePage';

export default function UserPublicProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState<UserPublicProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const isThisMe = currentUser?.id === userData?.id;
  const [blockedMessage, setBlockedMessage] = useState(false);
  const toggleFollowUser = async (id: string) => {
    try {
      const isNowFollowing = await userService.followUser(id);
      setIsFollowing(isNowFollowing.following);
      const updatedData = await userService.getUserPublicProfile(id);
      setUserData(updatedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      if (!id) return;
      try {
        const data = await userService.getUserPublicProfile(id);
        setUserData(data);
      } catch (error: any) {
        if (error.response.data.message === 'You are blocked by this user.') {
          setBlockedMessage(true);
        }
        console.log('error getting user profile', error);
        setUserData(null);
      }
    };
    getUserData();
  }, [id]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!userData) return;
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) return;
        const followings = await userService.getUsersFollowing(currentUser.id);
        const isUserFollowed = followings.some((user: User) => user.id === userData.id);
        setIsFollowing(isUserFollowed);
        setCurrentUser(currentUser);
      } catch (error) {
        console.log(error);
      }
    };

    checkIfFollowing();
  }, [userData]);

  if (!userData && !blockedMessage) {
    return <CircularProgress sx={{ color: 'var(--primary-color)' }} />;
  }

  if (blockedMessage) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <p style={{ color: 'gray', fontSize: '18px' }}>
          Цей користувач заблокував вас. Ви не можете переглядати його профіль.
        </p>
      </div>
    );
  }

  return (
    <ProfilePage
      isPublicProfile={true}
      publicUserData={userData}
      setPublicUserData={setUserData}
      toggleFollowUser={toggleFollowUser}
      isFollowing={isFollowing}
      isThisMe={isThisMe}
    />
  );
}
