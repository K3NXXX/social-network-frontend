import React, { useRef, useState } from 'react';
import { Card, Divider } from '@mui/material';

import PostActions from './PostActions';
import PostComments from './PostComments';
import PostContent from './PostContent';
import PostHeader from './PostHeader';

import type { CommentType, PostType } from '../../types/post';
import { useAuth } from '../../services/AuthContext';
import axiosInstance from '../../services/axiosConfig';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface Props {
  post: PostType;
  onDelete: (id: string) => void;
}

const Post: React.FC<Props> = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [commentsCount, setCommentsCount] = useState(post._count.comments);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const take = 5;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchComments = async (pageNumber = 1) => {
    try {
      const res = await axiosInstance.get(`api/comments/post/${post.id}`, {
        params: { page: pageNumber, take },
      });

      if (pageNumber === 1) {
        setComments(res.data.data);
      } else {
        setComments((prev) => [...prev, ...res.data.data]);
      }

      setPage(res.data.page);
      setLastPage(res.data.totalPages);
    } catch (error) {
      console.error('Could not load comments', error);
    }
  };

  const handleLoadMoreComments = () => {
    if (page < lastPage) {
      fetchComments(page + 1);
    }
  };

  useIntersectionObserver(loaderRef, () => {
    if (page < lastPage) {
      handleLoadMoreComments();
    }
  });

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
    setCommentsCount((prev) => prev + 1);
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

  // const handleDeleteComment = (commentId: string) => {
  //   const countCommentsToDelete = (comments: CommentType[], id: string): number => {
  //     let count = 0;
  //     for (const comment of comments) {
  //       if (comment.id === id) {
  //         count += 1;
  //         if (comment.replies && comment.replies.length) {
  //           count += comment.replies.reduce((acc, reply) => acc + countCommentsToDelete([reply], reply.id), 0);
  //         }
  //       } else if (comment.replies && comment.replies.length) {
  //         count += countCommentsToDelete(comment.replies, id);
  //       }
  //     }
  //     return count;
  //   };

  //   const deleteCommentRecursive = (comments: CommentType[], id: string): CommentType[] => {
  //     return comments
  //       .filter((comment) => comment.id !== id)
  //       .map((comment) => ({
  //         ...comment,
  //         replies: comment.replies ? deleteCommentRecursive(comment.replies, id) : [],
  //       }));
  //   };

  //   const countToRemove = countCommentsToDelete(comments, commentId);
  //   setCommentsCount((prev) => prev - countToRemove);

  //   setComments((prevComments) => deleteCommentRecursive(prevComments, commentId));
  // };

  const handleDeleteComment = async () => {
    try {
      fetchComments();
    } catch (error) {
      console.error('Could not delete comment', error);
    }
  };

  return (
    <Card sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', p: 2, mb: 4 }}>
      <PostHeader
        user={post.user}
        createdAt={post.createdAt}
        isOwner={post.userId === user?.id}
        onDelete={handleDeletePost}
      />

      <PostContent content={post.content} photo={post.photo} />

      <Divider sx={{ my: 2, mx: -2 }} />
      <PostActions
        likesCount={likesCount}
        commentsCount={commentsCount}
        liked={liked}
        onToggleLike={handleToggleLike}
        onToggleComments={() => {
          fetchComments();
          setShowComments(!showComments);
        }}
      />
      {showComments && (
        <PostComments
          comments={comments}
          postId={post.id}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          hasMore={page < lastPage}
        />
      )}
    </Card>
  );
};

export default Post;
