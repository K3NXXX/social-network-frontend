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
  genre: string;
  isActive: string;
  isOnline: boolean;
  isVerified: boolean;
  lastLogin: boolean;
  location: string;
}
