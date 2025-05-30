import React, { useState } from 'react';
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
}

const PostComments: React.FC<Props> = ({ comments, postId, onAddComment }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [visibleReplies, setVisibleReplies] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<CommentType | null>(null);
  const [repliesMap, setRepliesMap] = useState<{ [key: string]: CommentType[] }>({});

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

    if (!repliesMap[commentId]) {
      try {
        const res = await axiosInstance.get(`/api/comments/${commentId}/replies`);
        const replies = res.data;
        setRepliesMap((prev) => ({ ...prev, [commentId]: replies }));
      } catch (error) {
        console.error('Error loading replies', error);
      }
    }
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
                <Comment comment={c} onReplyClick={() => setReplyingTo(c)} />

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
                  {(repliesMap[c.id] || []).map((reply) => (
                    <Box key={reply.id}>
                      <Comment
                        key={reply.id}
                        comment={reply}
                        onReplyClick={() => setReplyingTo(reply)}
                      />
                      {reply.replies && reply.replies.length > 0 && (
                        <Button
                          size="small"
                          onClick={() => toggleReplies(reply.id)}
                          sx={{ mt: 1, ml: 7 }}
                        >
                          {visibleReplies.has(reply.id)
                            ? 'Сховати відповіді'
                            : `Показати відповіді (${reply.replies.length})`}
                        </Button>
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          ))}
      </Stack>

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
