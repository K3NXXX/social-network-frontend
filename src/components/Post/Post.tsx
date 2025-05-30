import React, { useState } from 'react';
import { Card, Divider } from '@mui/material';

import PostActions from './PostActions';
import PostComments from './PostComments';
import PostContent from './PostContent';
import PostHeader from './PostHeader';

import type { CommentType, PostType } from '../../types/post';
import { useAuth } from '../../services/AuthContext';
import axiosInstance from '../../services/axiosConfig';

interface Props {
  post: PostType;
  onDelete: (id: string) => void;
}

const Post: React.FC<Props> = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`api/comments/post/${post.id}`);
      setComments(res.data);
    } catch (error) {
      console.error('Could not load comments', error);
    }
  };

  const handleToggleLike = () => {
    setLiked((prev: boolean) => !prev);
    setLikesCount((prev: number) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = (newComment: CommentType) => {
    setComments((prevComments) => {
      if (newComment.parentId) {
        return prevComments.map((comment) => {
          if (comment.id === newComment.parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          return comment;
        });
      } else {
        return [...prevComments, { ...newComment, replies: [] }];
      }
    });
  };

  const handleDeletePost = async () => {
    try {
      const result = await axiosInstance.delete(`/api/posts/${post.id}`);
      console.log(result.data.message); // make a notification later
      onDelete(post.id);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleEditPost = () => {
    console.log('Edit post:', post.id);
  };

  return (
    <Card sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', p: 2, mb: 4 }}>
      <PostHeader
        user={post.user}
        createdAt={post.createdAt}
        isOwner={post.userId === user?.id}
        onDelete={handleDeletePost}
        onEdit={handleEditPost}
      />
      <PostContent content={post.content} photo={post.photo} />
      <Divider sx={{ my: 2, mx: -2 }} />
      <PostActions
        likesCount={likesCount}
        commentsCount={post.comments.length}
        liked={liked}
        onToggleLike={handleToggleLike}
        onToggleComments={() => {
          fetchComments();
          setShowComments(!showComments);
        }}
      />
      {showComments && (
        <PostComments comments={comments} postId={post.id} onAddComment={handleAddComment} />
      )}
    </Card>
  );
};

export default Post;
