import React, { useState } from 'react';
import { Avatar, Box, Divider, IconButton, Stack, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Comment from './Comment';

interface CommentType {
  id: number;
  content: string;
  createdAt: string;
  user: { firstName: string; lastName: string; avatarUrl: string | null };
}

interface Props {
  comments: CommentType[];
  onAddComment: (text: string) => void;
}

const PostComments: React.FC<Props> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSend = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2} sx={{ mt: 2 }}>
        {comments.map((c) => (
          <Comment
            key={c.id}
            user={`${c.user.firstName} ${c.user.lastName}`}
            text={c.content}
            timeAgo={c.createdAt}
            avatarUrl={c.user.avatarUrl || undefined}
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" mt={2}>
        <Avatar>Я</Avatar>
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
