import axiosInstance from './axiosConfig';

const USER_ENDPOINTS = {
  SEARCH_USERS: '/api/user',
};

export const userService = {
  async searchUsers(username: string) {
    const { data } = await axiosInstance.get(USER_ENDPOINTS.SEARCH_USERS, {
      params: { search: username },
    });
    return data;
  },
};
