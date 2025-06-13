import axiosInstance from './axiosConfig';

const USER_ENDPOINTS = {
  SEARCH_USERS: '/api/user',
  GET_USER_PUBLIC_PROFILE: 'api/user/profile',
  FOLLOW_USER: 'api/follow',
  GET_USER_FOLLOWINGS: 'api/following',
  GET_USER_FOLLOWERS: 'api/followers',
  BLOCK_USER: 'api/block',
  UNBLOCK_USER: 'api/unblock',
  GET_BLOCKED_USERS: 'api/user/blocked-users',
  GET_USER_NOTIFICATIONS: 'api/user/notifications',
  MARK_ALL_AS_READ: 'api/user/notifications/readAll',
};

export const userService = {
  async searchUsers(username: string) {
    const { data } = await axiosInstance.get(USER_ENDPOINTS.SEARCH_USERS, {
      params: { search: username },
    });
    return data;
  },
  async getUserPublicProfile(id: string) {
    const { data } = await axiosInstance.get(`${USER_ENDPOINTS.GET_USER_PUBLIC_PROFILE}/${id}`);
    return data;
  },

  async followUser(id: string) {
    const { data } = await axiosInstance.post(`${USER_ENDPOINTS.FOLLOW_USER}/${id}`);
    return data;
  },

  async getUsersFollowers(id: string) {
    const { data } = await axiosInstance.get(`${USER_ENDPOINTS.GET_USER_FOLLOWERS}/${id}`);
    return data;
  },

  async getUsersFollowing(id: string) {
    const { data } = await axiosInstance.get(`${USER_ENDPOINTS.GET_USER_FOLLOWINGS}/${id}`);
    return data;
  },

  async blockUser(id: string) {
    const { data } = await axiosInstance.post(`${USER_ENDPOINTS.BLOCK_USER}/${id}`);
    return data;
  },

  async unblockUser(id: string) {
    const { data } = await axiosInstance.delete(`${USER_ENDPOINTS.UNBLOCK_USER}/${id}`);
    return data;
  },

  async getBlockedUsers() {
    const { data } = await axiosInstance.get(USER_ENDPOINTS.GET_BLOCKED_USERS);
    return data;
  },

  async getUserNotifications() {
    const { data } = await axiosInstance.get(USER_ENDPOINTS.GET_USER_NOTIFICATIONS);
    return data;
  },

  async markAllAsRead() {
    const { data } = await axiosInstance.get(USER_ENDPOINTS.MARK_ALL_AS_READ);
    return data;
  },
};
