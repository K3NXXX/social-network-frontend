import React, { useState } from 'react';
import { Card, Divider } from '@mui/material';

import PostActions from './PostActions';
import PostComments from './PostComments';
import PostContent from './PostContent';
import PostHeader from './PostHeader';

import type { PostType } from '../../types/post';

interface Props {
  post: PostType;
}

const Post: React.FC<Props> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments ?? []);

  const handleToggleLike = () => {
    setLiked((prev: boolean) => !prev);
    setLikesCount((prev: number) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = (text: string) => {
    setComments((prev) => [
      ...prev,
      {
        id: `temp-${prev.length + 1}`, // temporary
        content: text,
        createdAt: 'щойно',
        user: { firstName: 'Я', lastName: '', avatarUrl: null, username: null },
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
