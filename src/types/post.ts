export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  avatarUrl: string | null;
}

export interface CommentType {
  id: string;
  content: string;
  userId: string;
  postId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  _count: CommentsCount;
  replies: CommentType[];
  liked?: boolean;
}

interface Like {
  userId: string;
}

export interface PostType {
  id: string;
  content: string;
  privacy: string;
  photo: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  comments: CommentType[];
  likes: Like[];
  _count: PostCount;
  liked: boolean;
  saved: boolean;
}

export interface PostCount {
  comments: number;
  likes: number;
}

export interface CommentsCount {
  replies: number;
  likes: number;
}
