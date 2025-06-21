import axios from 'axios';
import axiosInstance from './axiosConfig';
import type { ChatDetails, ChatPreview, MessageData, UserPreview } from '../types/chats';

const ENDPOINTS = {
  CHAT: 'api/chat/',
  CHATS: 'api/chat/i',
  MESSAGES: 'api/chat/messages/',
  USERS: 'api/user/all',
};

export const chatsService = {
  getUser(): any {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  async fetchChats(): Promise<ChatPreview[]> {
    try {
      const response = await axiosInstance.get(ENDPOINTS.CHATS);
      return response.data;
    } catch (error) {
      console.error('Chats fetching error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server error response:', error.response.data);
          throw new Error(error.response.data?.message || 'Failed to fetch chats');
        } else if (error.request) {
          console.error('No response from server', error.request);
          throw new Error('No response from server');
        } else {
          console.error('Request error:', error.message);
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw error;
    }
  },

  async fetchMessages(
    receiverId: string
  ): Promise<{ messages: MessageData[]; hasNextPage: boolean }> {
    try {
      const response = await axiosInstance.get(`${ENDPOINTS.MESSAGES}${receiverId}`);
      return response.data;
    } catch (error) {
      console.error('Messages fetching error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server error response:', error.response.data);
          throw new Error(error.response.data?.message || 'Failed to fetch messages');
        } else if (error.request) {
          console.error('No response from server', error.request);
          throw new Error('No response from server');
        } else {
          console.error('Request error:', error.message);
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw error;
    }
  },

  async fetchAllUsers(): Promise<UserPreview[]> {
    try {
      const response = await axiosInstance.get(ENDPOINTS.USERS);
      return response.data;
    } catch (error) {
      console.error('user fetching error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server error response:', error.response.data);
          throw new Error(error.response.data?.message || 'Failed to fetch user');
        } else if (error.request) {
          console.error('No response from server', error.request);
          throw new Error('No response from server');
        } else {
          console.error('Request error:', error.message);
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw error;
    }
  },

  async fetchChat(receiverId: string): Promise<ChatDetails> {
    try {
      const response = await axiosInstance.get(`${ENDPOINTS.CHAT}${receiverId}`);
      return response.data;
    } catch (error) {
      console.error('Chat fetching error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server error response:', error.response.data);
          throw new Error(error.response.data?.message || 'Failed to fetch a chat');
        } else if (error.request) {
          console.error('No response from server', error.request);
          throw new Error('No response from server');
        } else {
          console.error('Request error:', error.message);
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw error;
    }
  },
};
