import axiosInstance from './axiosConfig';

const USER_ENDPOINTS = {
  SEARCH_USERS: '/api/user',
  GET_USER_PUBLIC_PROFILE: 'api/user/profile',
  FOLLOW_USER: 'api/follow',
  GET_USER_FOLLOWINGS: 'api/following',
  GET_USER_FOLLOWERS: 'api/followers',
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

  async getUsersFollowing(id: string) {
    const { data } = await axiosInstance.get(`${USER_ENDPOINTS.GET_USER_FOLLOWINGS}/${id}`);
    return data;
  },
};
