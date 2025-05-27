interface User {
  firstName: string;
  lastName: string;
  username: string | null;
  avatarUrl: string | null;
}

export interface CommentType {
  id: string;
  content: string;
  createdAt: string;
  user: User;
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
