import React, { useState } from 'react';
import { Card, Divider } from '@mui/material';

import PostActions from './PostActions';
import PostComments from './PostComments';
import PostContent from './PostContent';
import PostHeader from './PostHeader';

const mockPost = {
  id: 'e6eda8d9-00aa-4cb2-acc8-353859aa47d6',
  content: 'my dog',
  privacy: 'PUBLIC',
  photo: null,
  userId: '2b0edd10-2ebb-4f22-9922-b60af3318dd0',
  createdAt: '2025-05-23T11:46:15.462Z',
  updatedAt: '2025-05-23T11:46:15.462Z',
  user: {
    firstName: 'denys',
    lastName: 'pavlov',
    username: null,
    avatarUrl: null,
  },
  comments: [],
  likes: [],
};

const Post: React.FC = () => {
  const post = mockPost;
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      content: 'Чудово!',
      createdAt: '1 год. тому',
      user: { firstName: 'Олег', lastName: 'Семенюк', avatarUrl: null },
    },
    {
      id: 2,
      content: 'Підтримую ідею.',
      createdAt: '45 хв. тому',
      user: { firstName: 'Ірина', lastName: 'Коваль', avatarUrl: null },
    },
  ]);

  const handleToggleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = (text: string) => {
    setComments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        content: text,
        createdAt: 'щойно',
        user: { firstName: 'Я', lastName: '', avatarUrl: null },
      },
    ]);
  };

  return (
    <Card sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', p: 2, mb: 4 }}>
      <PostHeader user={post.user} createdAt={post.createdAt} />
      <PostContent content={post.content} photo={post.photo} />
      <Divider sx={{ my: 2, mx: -2 }} />
      <PostActions
        likesCount={likesCount}
        commentsCount={comments.length}
        liked={liked}
        onToggleLike={handleToggleLike}
        onToggleComments={() => setShowComments(!showComments)}
      />
      {showComments && <PostComments comments={comments} onAddComment={handleAddComment} />}
    </Card>
  );
};

export default Post;
