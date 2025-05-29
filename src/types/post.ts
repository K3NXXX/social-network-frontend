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
  likes: Like[];
  replies: CommentType[];
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
}
