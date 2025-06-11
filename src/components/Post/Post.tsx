import React, { useRef, useState } from 'react';
import { Card, Divider } from '@mui/material';

import PostActions from './PostActions';
import PostComments from './PostComments';
import PostContent from './PostContent';
import PostHeader from './PostHeader';

import type { CommentType, PostType } from '../../types/post';
import { useAuth } from '../../services/AuthContext';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { postService } from '../../services/postService';
import EditPostModal from './EditPostModal';

interface Props {
  post: PostType;
  onDelete: (id: string) => void;
}

const Post: React.FC<Props> = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [commentsCount, setCommentsCount] = useState(post._count.comments);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const take = 5;
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const [saved, setSaved] = useState(post.saved ?? false);

  const fetchComments = async (pageNumber = 1) => {
    try {
      const res = await postService.fetchPostComments(post.id, pageNumber, take);
      const rootComments = res.data.filter((c) => c.parentId === null);

      if (pageNumber === 1) {
        setComments(rootComments);
      } else {
        setComments((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newComments = rootComments.filter((c) => !existingIds.has(c.id));
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

  const handleAddComment = (newComment: CommentType) => {
    setComments((prevComments) => {
      return [...prevComments, newComment];
    });
    setCommentsCount((prev) => prev + 1);
  };

  const handleDeletePost = async () => {
    try {
      const message = await postService.deletePost(post.id);
      console.log(message);
      onDelete(post.id);
    } catch (err) {
      console.error(err);
    }
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

  const handleToggleSave = async () => {
    try {
      if (saved) {
        await postService.unsavePost(post.id);
      } else {
        await postService.savePost(post.id);
      }
      setSaved((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', p: 2, mb: 4 }}>
      <PostHeader
        user={post.user}
        createdAt={post.createdAt}
        isOwner={post.user.id === user?.id}
        onDelete={handleDeletePost}
        onEdit={() => setEditOpen(true)}
      />

      <EditPostModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        post={currentPost}
        onUpdate={handleUpdatePost}
      />

      <PostContent content={currentPost.content} photo={currentPost.photo} />

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
    </Card>
  );
};

export default Post;
