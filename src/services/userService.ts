import axiosInstance from './axiosConfig';

const USER_ENDPOINTS = {
  SEARCH_USERS: '/api/user',
  GET_USER_PUBLIC_PROFILE: 'api/user/profile',
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
};
