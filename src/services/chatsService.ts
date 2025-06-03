import axios from 'axios';
import axiosInstance from './axiosConfig';
import type { ChatDetails, ChatPreview, MessageData, UserPreview } from '../types/chats';

export const chatsService = {
  getUser(): any {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  async fetchChats(): Promise<ChatPreview[]> {
    try {
      const response = await axiosInstance.get(`api/chat/i`);
      console.log('data about chats:', response.data);
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

  async fetchMessages(receiverId: string): Promise<MessageData[]> {
    try {
      const response = await axiosInstance.get(`api/chat/messages/${receiverId}`);
      console.log('data about messages:', response.data);
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
      const response = await axiosInstance.get(`api/user/all`);
      console.log('data about users:', response.data);
      return response.data;
    } catch (error) {
      console.error('users fetching error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server error response:', error.response.data);
          throw new Error(error.response.data?.message || 'Failed to fetch users');
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
      const response = await axiosInstance.get(`api/chat/${receiverId}`);
      console.log('data about the chat:', response.data);
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
