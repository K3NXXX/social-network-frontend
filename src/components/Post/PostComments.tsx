import SendIcon from '@mui/icons-material/Send';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Comment from './Comment';

import { useTranslation } from 'react-i18next';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { postService } from '../../services/postService';
import { userService } from '../../services/userService';
import type { User } from '../../types/auth';
import type { CommentType } from '../../types/post';
import ReplyLoader from './ReplyLoader';

interface Props {
  comments: CommentType[];
  postId: string;
  onAddComment: (comment: CommentType) => void;
  onDeleteComment: (commentId: string) => void;
  hasMore: boolean;
  onAddReplies: (replies: CommentType[]) => void;
  onLoadMore: () => void;
  onUpdateComment: (comment: CommentType) => void;
}

const PostComments: React.FC<Props> = ({
  comments,
  postId,
  onAddComment,
  onDeleteComment,
  hasMore,
  onAddReplies,
  onLoadMore,
  onUpdateComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const { t } = useTranslation();
  const [visibleReplies, setVisibleReplies] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<CommentType | null>(null);
  const [editingComment, setEditingComment] = useState<CommentType | null>(null);
  const [editContent, setEditContent] = useState('');
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [replyPages, setReplyPages] = useState<Record<string, number>>({});
  const take = 5;
  const [user, setUser] = useState<User | null>(null);
  const MAX_NESTING_LEVEL = 1;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profileData = await userService.getUserProfile();
        setUser(profileData);
      } catch (err: any) {
        console.error('Profile fetch error:', err);
      }
    };

    fetchUser();
  }, []);

  const handleSend = async () => {
    if (!newComment.trim()) return;
    try {
      const createdComment = await postService.addComment(
        postId,
        newComment,
        replyingTo?.id ?? null
      );

      if (replyingTo) {
        fetchReplies(replyingTo.id);
      }

      if (user) {
        createdComment.user = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        };
      }
      onAddComment(createdComment);

      if (replyingTo) {
        setVisibleReplies((prev) => new Set(prev).add(replyingTo.id));
      }
    } catch (error) {
      console.error('Could not add comment', error);
    }
    setNewComment('');
    setReplyingTo(null);
  };

  const fetchReplies = async (commentId: string, page: number = 1) => {
    try {
      const replies = await postService.fetchReplies(commentId, page, take);

      if (replies.length > 0) {
        onAddReplies(replies);
        setReplyPages((prev) => ({
          ...prev,
          [commentId]: page,
        }));
      }
    } catch (error) {
      console.error('Could not load replies', error);
    }
  };

  const toggleReplies = async (comment: CommentType) => {
    const isVisible = visibleReplies.has(comment.id);
    const newSet = new Set(visibleReplies);

    if (isVisible) {
      newSet.delete(comment.id);
    } else {
      if (!comment.replies || comment.replies.length === 0) {
        await fetchReplies(comment.id);
      }
      newSet.add(comment.id);
    }

    setVisibleReplies(newSet);
  };

  const handleDelete = async (commentId: string) => {
    try {
      await postService.deleteComment(commentId);
      onDeleteComment(commentId);
    } catch (error) {
      console.error('Could not delete comment', error);
    }
  };

  const handleEdit = async () => {
    if (!editingComment) return;
    try {
      const updatedComment = await postService.updateComment(editingComment.id, editContent);
      onUpdateComment(updatedComment);
    } catch (error) {
      console.error('Could not update comment', error);
    }
    setEditingComment(null);
    setEditContent('');
  };

  const handleEditClick = (comment: CommentType) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  useIntersectionObserver(loaderRef, () => {
    onLoadMore();
  });

  const renderComments = (comments: CommentType[], level: number = 0, renderedIds: Set<string>) => {
    return comments.map((comment) => {
      if (renderedIds.has(comment.id)) return null;
      renderedIds.add(comment.id);

      const isEditing = editingComment?.id === comment.id;
      const isVisible = visibleReplies.has(comment.id);

      return (
        <Box
          key={comment.id}
          sx={{
            pl: {
              xs: 0,
              sm: Math.min(level, MAX_NESTING_LEVEL) * 4,
            },
            mb: 2,
          }}
        >
          <Comment
            comment={comment}
            isOwner={comment.user.id === user?.id}
            onReplyClick={() => setReplyingTo(comment)}
            onDeleteClick={() => handleDelete(comment.id)}
            onEditClick={() => handleEditClick(comment)}
            isEditing={isEditing}
            editContent={editContent}
            onEditContentChange={setEditContent}
            onConfirmEdit={handleEdit}
          />

          {comment._count?.replies > 0 && (
            <Button
              size="small"
              onClick={() => toggleReplies(comment)}
              sx={{
                ml: 6,
                mt: 1,
                textTransform: 'none',
                color: 'var(--primary-color)',
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }}
            >
              {isVisible
                ? t('posts.hideAnswers')
                : `${t('posts.showAnswers')} (${comment._count.replies})`}
            </Button>
          )}

          {isVisible && (
            <>
              {comment.replies?.length > 0 && (
                <Box sx={{ mt: 1 }}>{renderComments(comment.replies, level + 1, renderedIds)}</Box>
              )}

              {comment.replies?.length < comment._count?.replies && (
                <ReplyLoader
                  commentId={comment.id}
                  fetchReplies={fetchReplies}
                  currentPage={replyPages[comment.id] ?? 1}
                />
              )}
            </>
          )}
        </Box>
      );
    });
  };

  function buildCommentsTree(comments: CommentType[]): CommentType[] {
    const map = new Map<string, CommentType & { replies: CommentType[] }>();
    const roots: (CommentType & { replies: CommentType[] })[] = [];

    const seenIds = new Set<string>();

    comments.forEach((comment) => {
      if (!seenIds.has(comment.id)) {
        seenIds.add(comment.id);
        map.set(comment.id, { ...comment, replies: [] });
      }
    });

    map.forEach((comment) => {
      const parentId = comment.parentId;
      if (parentId && map.has(parentId)) {
        const parent = map.get(parentId)!;
        if (!parent.replies.some((r) => r.id === comment.id)) {
          parent.replies.push(comment);
        }
      } else if (!parentId) {
        roots.push(comment);
      }
    });

    return roots;
  }

  const commentTree = buildCommentsTree(comments);

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{
          maxHeight: '50vh',
          overflowY: 'auto',
          pr: 1,
        }}
      >
        {(() => {
          const renderedIds = new Set<string>();
          return renderComments(commentTree, 0, renderedIds);
        })()}

        {hasMore && <div ref={loaderRef} style={{ height: '1px' }} />}
      </Box>

      {replyingTo && (
        <Box
          sx={{
            mt: 2,
            p: 1,
            borderLeft: '4px solid #6969cb',
            borderRadius: 2,
            backgroundColor: 'var(--background-color)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box
            sx={{
              textAlign: 'left',
              maxWidth: { xs: '25vh', sm: '50vh' },
              wordBreak: 'break-word',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.5,
                color: 'var(--text-color)',
              }}
            >
              {t('posts.commentReply')}
            </Typography>
            <Box
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: 2,
                p: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--text-color)',
                }}
              >
                <strong>{`${replyingTo.user.firstName} ${replyingTo.user.lastName}`}</strong>: "
                {replyingTo.content}"
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            color="error"
            onClick={() => setReplyingTo(null)}
            sx={{
              alignSelf: 'center',
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: 'none',
              },
            }}
          >
            {t('posts.commentCancel')}
          </Button>
        </Box>
      )}

      <Stack direction="row" spacing={1} alignItems="center" mt={2}>
        <Avatar src={user?.avatarUrl ?? undefined}>
          {!user?.avatarUrl &&
            `${user?.firstName?.[0]?.toUpperCase() ?? ''}${user?.lastName?.[0]?.toUpperCase() ?? ''}`}
        </Avatar>
        <TextField
          fullWidth
          multiline
          size="medium"
          variant="outlined"
          placeholder={t('posts.addCommentLabel')}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          InputProps={{
            sx: {
              '& textarea': {
                color: 'var(--text-color)',
              },
              '& textarea::placeholder': {
                color: 'var(--text-color)',
                opacity: 0.7,
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '1px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--border-color)',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '2px',
            },
            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--error-color)',
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          sx={{
            color: 'var(--primary-color)',
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
              boxShadow: 'none',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default PostComments;
