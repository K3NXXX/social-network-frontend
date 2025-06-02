import React, { useRef, useState } from 'react';
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
import SendIcon from '@mui/icons-material/Send';
import Comment from './Comment';

import type { CommentType } from '../../types/post';
import { useAuth } from '../../services/AuthContext';
import axiosInstance from '../../services/axiosConfig';

interface Props {
  comments: CommentType[];
  postId: string;
  onAddComment: (comment: CommentType) => void;
  onDeleteComment: (commentId: string) => void;
  hasMore: boolean;
}

const PostComments: React.FC<Props> = ({
  comments,
  postId,
  onAddComment,
  onDeleteComment,
  hasMore,
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [visibleReplies, setVisibleReplies] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<CommentType | null>(null);
  const [editingComment, setEditingComment] = useState<CommentType | null>(null);
  const [editContent, setEditContent] = useState('');
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axiosInstance.post(`/api/comments`, {
        content: newComment,
        postId,
        parentId: replyingTo?.id ?? null,
      });
      const createdComment = res.data;
      onAddComment(createdComment);
    } catch (error) {
      console.error('Could not add comment', error);
    }
    setNewComment('');
    setReplyingTo(null);
  };

  const toggleReplies = async (commentId: string) => {
    setVisibleReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await axiosInstance.delete(`/api/comments/${commentId}`);
      console.log(res);
      onDeleteComment(commentId);
    } catch (error) {
      console.error('Error loading replies', error);
    }
  };

  const handleEdit = async () => {
    if (!editingComment) return;
    try {
      const res = await axiosInstance.patch(`/api/comments/${editingComment.id}`, {
        content: editContent,
      });
      const updatedComment = res.data;
      onDeleteComment(editingComment.id);
      onAddComment(updatedComment);
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

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2} sx={{ mt: 2 }}>
        {comments
          .filter((c) => !c.parentId)
          .map((c) => (
            <Box key={c.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Comment
                  comment={c}
                  onReplyClick={() => setReplyingTo(c)}
                  onDeleteClick={() => handleDelete(c.id)}
                  isOwner={c.user?.id === user?.id}
                  onEditClick={() => handleEditClick(c)}
                  isEditing={editingComment?.id === c.id}
                  editContent={editContent}
                  onEditContentChange={(value) => setEditContent(value)}
                  onConfirmEdit={handleEdit}
                />

                {c.replies && c.replies.length > 0 && (
                  <Button size="small" onClick={() => toggleReplies(c.id)} sx={{ mt: 1, ml: 7 }}>
                    {visibleReplies.has(c.id)
                      ? 'Сховати відповіді'
                      : `Показати відповіді (${c.replies.length})`}
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
                        isOwner={reply.user?.id === user?.id}
                        onEditClick={() => handleEditClick(reply)}
                        isEditing={editingComment?.id === reply.id}
                        editContent={editContent}
                        onEditContentChange={(value) => setEditContent(value)}
                        onConfirmEdit={handleEdit}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          ))}
      </Stack>
      {hasMore && <div ref={loaderRef} style={{ height: '1px' }} />}

      {replyingTo && (
        <Box
          sx={{
            mt: 2,
            p: 1,
            borderRadius: 2,
            backgroundColor: '#f1f1f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2">
            Відповідь на коментар <strong>{replyingTo.content}</strong> від:{' '}
            <strong>{`${replyingTo.user.firstName} ${replyingTo.user.lastName}`}</strong>
          </Typography>
          <Button size="small" onClick={() => setReplyingTo(null)}>
            Скасувати
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
          placeholder="Додайте коментар..."
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
