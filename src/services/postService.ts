import axiosInstance from './axiosConfig';
import type { CommentType, PostType } from '../types/post';

const POST_ENDPOINTS = {
  POSTS: '/api/posts',
  USER_POSTS: '/api/posts/user',
  PUBLIC_USER_POSTS: (id: string) => `/api/posts/user/${id}`,
  FEED_POSTS: '/api/posts/feed',
  DISCOVER_POSTS: '/api/posts/discover',
  SINGLE_POST: (id: string) => `/api/posts/${id}`,

  CREATE_POST: '/api/posts',
  DELETE_POST: (id: string) => `/api/posts/${id}`,

  COMMENTS: '/api/comments',
  POST_COMMENTS: (postId: string) => `/api/comments/post/${postId}`,
  SINGLE_COMMENT: (id: string) => `/api/comments/${id}`,
  COMMENT_REPLIES: (id: string) => `/api/comments/${id}/replies`,
  UPDATE_COMMENT: (id: string) => `/api/comments/${id}`,
  DELETE_COMMENT: (id: string) => `/api/comments/${id}`,

  TOGGLE_LIKE: (postId: string) => `/api/likes/post/${postId}`,
};

export const postService = {
  async fetchPosts(
    pageNumber = 1,
    take = 5
  ): Promise<{
    data: PostType[];
    page: number;
    lastPage: number;
  }> {
    try {
      const response = await axiosInstance.get(POST_ENDPOINTS.POSTS, {
        params: {
          page: pageNumber,
          take,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  },

  async fetchUserPosts(
    pageNumber = 1,
    take = 5
  ): Promise<{
    data: PostType[];
    page: number;
    lastPage: number;
  }> {
    try {
      const response = await axiosInstance.get(POST_ENDPOINTS.USER_POSTS, {
        params: { page: pageNumber, take },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
      throw error;
    }
  },

  async fetchPublicUserPosts(
    userId: string,
    pageNumber = 1,
    take = 5
  ): Promise<{
    data: PostType[];
    page: number;
    lastPage: number;
  }> {
    try {
      const response = await axiosInstance.get(POST_ENDPOINTS.PUBLIC_USER_POSTS(userId), {
        params: { page: pageNumber, take },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
      throw error;
    }
  },

  async fetchFeedPosts(
    pageNumber = 1,
    take = 5
  ): Promise<{
    data: PostType[];
    page: number;
    lastPage: number;
  }> {
    try {
      const response = await axiosInstance.get(POST_ENDPOINTS.FEED_POSTS, {
        params: { page: pageNumber, take },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch feed posts:', error);
      throw error;
    }
  },

  async fetchDiscoverPosts(
    pageNumber = 1,
    take = 5
  ): Promise<{
    data: PostType[];
    page: number;
    lastPage: number;
  }> {
    try {
      const response = await axiosInstance.get(POST_ENDPOINTS.DISCOVER_POSTS, {
        params: { page: pageNumber, take },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch discover posts:', error);
      throw error;
    }
  },

  async fetchSinglePost(postId: string): Promise<PostType> {
    try {
      const response = await axiosInstance.get(POST_ENDPOINTS.SINGLE_POST(postId));
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch post with id ${postId}:`, error);
      throw error;
    }
  },

  async createPost(content: string, imageFile: File | null): Promise<PostType> {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (imageFile) {
        formData.append('file', imageFile);
      }
      const response = await axiosInstance.post(POST_ENDPOINTS.CREATE_POST, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  async deletePost(postId: string): Promise<string> {
    try {
      const response = await axiosInstance.delete(POST_ENDPOINTS.DELETE_POST(postId));
      return response.data.message;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  async fetchPostComments(
    postId: string,
    pageNumber = 1,
    take = 5
  ): Promise<{
    data: CommentType[];
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await axiosInstance.get(POST_ENDPOINTS.POST_COMMENTS(postId), {
        params: { page: pageNumber, take },
      });
      return response.data;
    } catch (error) {
      console.error('Could not load comments', error);
      throw error;
    }
  },

  async toggleLike(postId: string): Promise<{ liked: boolean }> {
    try {
      const response = await axiosInstance.post(POST_ENDPOINTS.TOGGLE_LIKE(postId));
      return response.data;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  },

  async addComment(postId: string, content: string, parentId: string | null = null) {
    try {
      const res = await axiosInstance.post(POST_ENDPOINTS.COMMENTS, {
        content,
        postId,
        parentId,
      });
      return res.data;
    } catch (error) {
      console.error('Could not add comment', error);
      throw error;
    }
  },

  async fetchReplies(commentId: string, page = 1, take = 10) {
    try {
      const res = await axiosInstance.get(POST_ENDPOINTS.COMMENT_REPLIES(commentId), {
        params: { page, take },
      });
      return res.data.data;
    } catch (error) {
      console.error('Could not load replies', error);
      throw error;
    }
  },

  async deleteComment(commentId: string) {
    try {
      const res = await axiosInstance.delete(POST_ENDPOINTS.DELETE_COMMENT(commentId));
      return res.data;
    } catch (error) {
      console.error('Could not delete comment', error);
      throw error;
    }
  },

  async updateComment(commentId: string, content: string) {
    try {
      const res = await axiosInstance.patch(POST_ENDPOINTS.UPDATE_COMMENT(commentId), {
        content,
      });
      return res.data;
    } catch (error) {
      console.error('Could not update comment', error);
      throw error;
    }
  },

  async updatePost(
    postId: string,
    content: string,
    imageFile: File | null,
    removePhoto: boolean
  ): Promise<PostType> {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (imageFile) {
        formData.append('file', imageFile);
      }
      formData.append('removePhoto', String(removePhoto));

      const response = await axiosInstance.patch(POST_ENDPOINTS.SINGLE_POST(postId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${postId}:`, error);
      throw error;
    }
  },
};
