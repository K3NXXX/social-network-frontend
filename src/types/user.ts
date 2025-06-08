export interface SearchUsers {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string;
}

export interface UserPublicProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  dateOfBirth: string;
  email: string;
  following: number;
  followers: number;
  gender: string;
  isActive: string;
  isOnline: boolean;
  isVerified: boolean;
  lastLogin: boolean;
  location: string;
  posts: [];
}

export interface UserFollowers {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  avatarUrl: string | null;
  createdAt: string;
  isFollowed: string;
}

export interface UserFollowings {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  avatarUrl: string | null;
  isFollowed: boolean;
  createdAt: string;
}
