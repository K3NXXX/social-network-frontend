import React, { useState } from 'react';
import { Avatar, Box, Button, Divider, IconButton, Stack, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Comment from './Comment';

import type { CommentType } from '../../types/post';
import { useAuth } from '../../services/AuthContext';

interface Props {
  comments: CommentType[];
  onAddComment: (text: string) => void;
}

const PostComments: React.FC<Props> = ({ comments, onAddComment }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [visibleReplies, setVisibleReplies] = useState<Set<string>>(new Set());

  const handleSend = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  const toggleReplies = (commentId: string) => {
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

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2} sx={{ mt: 2 }}>
        {comments
          .filter((c) => !c.parentId)
          .map((c) => (
            <Box key={c.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Comment comment={c} />

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
                  {c.replies.map((reply) => (
                    <Comment key={reply.id} comment={reply} />
                  ))}
                </Stack>
              )}
            </Box>
          ))}
      </Stack>

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
