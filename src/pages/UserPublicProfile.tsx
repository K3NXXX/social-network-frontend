import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type { User } from '../types/auth';
import type { UserPublicProfile } from '../types/user';
import GlobalLoader from '../ui/GlobalLoader';
import ProfilePage from './ProfilePage';

export default function UserPublicProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState<UserPublicProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const isThisMe = currentUser?.id === userData?.id;

  const checkIfFollowing = async () => {
    try {
      if (!id) return;
      const currentUser = await authService.getCurrentUser();
      const followings = await userService.getUsersFollowing(currentUser.id);
      const isUserFollowed = followings.some((user: User) => user.id === userData?.id);
      setIsFollowing(isUserFollowed);
      setCurrentUser(currentUser);
    } catch (error) {
      console.log(error);
    }
  };

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
        await checkIfFollowing();
      } catch {
        setUserData(null);
      }
    };
    getUserData();
  }, [id]);

  if (!userData) {
    return <GlobalLoader />;
  }

  return (
    <ProfilePage
      isPublicProfile={true}
      publicUserData={userData}
      toggleFollowUser={toggleFollowUser}
      isFollowing={isFollowing}
      isThisMe={isThisMe}
    />
  );
}
