export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  username: string | null;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  isOnline: boolean;
  lastLogin: string | null;
  amountOfPosts: number;
  isActive: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
} 