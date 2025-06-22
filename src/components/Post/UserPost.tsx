import React, { useRef, useState } from 'react';
import EditPostModal from './EditPostModal.tsx';
import PostActions from './PostActions.tsx';
import PostComments from './PostComments.tsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx';
import { postService } from '../../services/postService.ts';
import { Avatar, Box, Typography } from '@mui/material';
import type { CommentType, PostType } from '../../types/post.ts';

interface Props {
  post: PostType;
  onDelete?: (id: string) => void;
  onUnsave?: (id: string) => void;
}

const UserPosts: React.FC<Props> = ({ post, onUnsave }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [commentsCount, setCommentsCount] = useState(post._count.comments);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const take = 5;
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [saved, setSaved] = useState(post.saved ?? false);

  const fetchComments = async (pageNumber = 1) => {
    try {
      const res = await postService.fetchPostComments(post.id, pageNumber, take);
      if (pageNumber === 1) {
        setComments(res.data);
      } else {
        setComments((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newComments = res.data.filter((c) => !existingIds.has(c.id));
          return [...prev, ...newComments];
        });
      }
      setPage(res.page);
      setLastPage(res.totalPages);
    } catch (error) {
      console.error(error);
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

  const handleToggleLike = async () => {
    try {
      const { liked } = await postService.togglePostLike(post.id);
      setLiked(liked);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleSave = async () => {
    try {
      if (saved) {
        await postService.unsavePost(post.id);
        onUnsave?.(post.id);
      } else {
        await postService.savePost(post.id);
      }
      setSaved((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
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

  const handleDeleteComment = (commentId: string) => {
    setComments((prevComments) =>
      prevComments
        .filter((comment) => comment.id !== commentId)
        .map((comment) => ({
          ...comment,
          replies: comment.replies?.filter((reply) => reply.id !== commentId) || [],
        }))
    );
    setCommentsCount((prev) => prev - 1);
  };

  const handleAddReplies = (replies: CommentType[]) => {
    setComments((prevComments) => {
      const existingIds = new Set(prevComments.map((c) => c.id));
      const newReplies = replies.filter((r) => !existingIds.has(r.id));
      return [...prevComments, ...newReplies];
    });
  };

  const handleUpdateComment = (updatedComment: CommentType) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === updatedComment.id) {
          return { ...comment, ...updatedComment };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === updatedComment.id ? { ...reply, ...updatedComment } : reply
            ),
          };
        }
        return comment;
      })
    );
  };

  const handleUpdatePost = (updatedPost: PostType) => {
    setCurrentPost(updatedPost);
  };

  return (
    <Box
      key={post.id}
      sx={{
        p: 1.5,
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Avatar src={post.user.avatarUrl || ''} sx={{ width: 36, height: 36 }} />
      <Box display="flex" flexDirection="column" alignItems="start">
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Typography fontWeight="bold" fontSize={15} paddingRight="4px">
            {post.user.firstName} {post.user.lastName}
          </Typography>
          <Typography fontSize={14} fontWeight="normal" color="#737373">
            @{post.user.username}
          </Typography>
          <Typography color="#737373" paddingX="3px">
            ·
          </Typography>
          <Typography fontSize={14} color="#737373">
            {new Date(post.createdAt).toLocaleString('uk-UA', {
              day: 'numeric',
              month: 'long',
            })}
          </Typography>
        </Box>

        <EditPostModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          post={currentPost}
          onUpdate={handleUpdatePost}
        />

        {post.content && (
          <Typography fontSize={15} textAlign="left">
            {post.content}
          </Typography>
        )}

        {post.photo && (
          <Box
            component="img"
            src={post.photo}
            alt="Пост"
            sx={{
              width: '100%',
              borderRadius: 4,
              objectFit: 'cover',
              maxHeight: 500,
              mt: 1,
            }}
          />
        )}

        <PostActions
          likesCount={likesCount}
          commentsCount={commentsCount}
          liked={liked}
          onToggleLike={handleToggleLike}
          onToggleComments={() => {
            fetchComments();
            setShowComments(!showComments);
          }}
          saved={saved}
          onToggleSave={handleToggleSave}
        />
        {showComments && (
          <PostComments
            comments={comments}
            postId={post.id}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            hasMore={page < lastPage}
            onAddReplies={handleAddReplies}
            onLoadMore={handleLoadMoreComments}
            onUpdateComment={handleUpdateComment}
          />
        )}
      </Box>
    </Box>
  );
};

export default UserPosts;
