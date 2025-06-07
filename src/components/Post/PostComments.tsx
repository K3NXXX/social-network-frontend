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
import React, { useRef, useState } from 'react';
import Comment from './Comment';

import { useTranslation } from 'react-i18next';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useAuth } from '../../services/AuthContext';
import { postService } from '../../services/postService';
import type { CommentType } from '../../types/post';

interface Props {
  comments: CommentType[];
  postId: string;
  onAddComment: (comment: CommentType) => void;
  onDeleteComment: (commentId: string) => void;
  hasMore: boolean;
  onAddReplies: (parentId: string, replies: CommentType[]) => void;
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
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const { t } = useTranslation();
  const [visibleReplies, setVisibleReplies] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<CommentType | null>(null);
  const [editingComment, setEditingComment] = useState<CommentType | null>(null);
  const [editContent, setEditContent] = useState('');
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!newComment.trim()) return;
    try {
      const createdComment = await postService.addComment(
        postId,
        newComment,
        replyingTo?.id ?? null
      );
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

  const fetchReplies = async (commentId: string) => {
    try {
      const replies = await postService.fetchReplies(commentId, 1, 10);
      onAddReplies(commentId, replies);
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
        <Stack spacing={2} sx={{ mt: 2 }}>
          {comments.map((c) => (
            <Box key={c.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Comment
                  comment={c}
                  onReplyClick={() => setReplyingTo(c)}
                  onDeleteClick={() => handleDelete(c.id)}
                  isOwner={c.userId === user?.id}
                  onEditClick={() => handleEditClick(c)}
                  isEditing={editingComment?.id === c.id}
                  editContent={editContent}
                  onEditContentChange={(value) => setEditContent(value)}
                  onConfirmEdit={handleEdit}
                />

                {c._count?.replies > 0 && (
                  <Button size="small" onClick={() => toggleReplies(c)} sx={{ mt: 1, ml: 7 }}>
                    {visibleReplies.has(c.id)
                      ? t('posts.hideAnswers')
                      : `${t('posts.hideAnswers')} (${c._count.replies})`}
                  </Button>
                )}
              </Box>

              {visibleReplies.has(c.id) && (
                <Stack spacing={1} sx={{ ml: 7, mt: 1 }}>
                  {(c.replies || []).map((reply) => (
                    <Box key={reply.id}>
                      <Comment
                        comment={reply}
                        onReplyClick={() => setReplyingTo(reply)}
                        onDeleteClick={() => handleDelete(reply.id)}
                        isOwner={reply.userId === user?.id}
                        onEditClick={() => handleEditClick(reply)}
                        isEditing={editingComment?.id === reply.id}
                        editContent={editContent}
                        onEditContentChange={(value) => setEditContent(value)}
                        onConfirmEdit={handleEdit}
                      />
                      {reply._count?.replies > 0 && (
                        <Button
                          size="small"
                          onClick={() => toggleReplies(reply)}
                          sx={{ mt: 1, ml: 7 }}
                        >
                          {visibleReplies.has(reply.id)
                            ? t('posts.hideAnswers')
                            : `${t('posts.showAnswers')} (${reply._count.replies})`}
                        </Button>
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          ))}
        </Stack>

        {hasMore && <div ref={loaderRef} style={{ height: '1px' }} />}
      </Box>

      {replyingTo && (
        <Box
          sx={{
            mt: 2,
            p: 1,
            borderLeft: '4px solid #6969cb',
            borderRadius: 2,
            backgroundColor: '#f1f1f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5 }}>
              {t('posts.commentReply')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{`${replyingTo.user.firstName} ${replyingTo.user.lastName}`}</strong>: "
              {replyingTo.content}"
            </Typography>
          </Box>
          <Button
            size="small"
            color="error"
            onClick={() => setReplyingTo(null)}
            sx={{ alignSelf: 'center' }}
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
          sx={{
            backgroundColor: '#F8F8FC',
          }}
        />
        <IconButton onClick={handleSend} sx={{ color: 'primary.main' }}>
          <SendIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default PostComments;
