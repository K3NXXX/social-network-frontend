import React from 'react';
import { Avatar, Box, Typography, Stack, Button } from '@mui/material';
import type { CommentType } from '../../types/post';

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Avatar src={comment.user?.avatarUrl ?? undefined}>
        {!comment.user?.avatarUrl &&
          `${comment.user?.firstName?.[0]?.toUpperCase() ?? ''}${comment.user?.lastName?.[0]?.toUpperCase() ?? ''}`}
      </Avatar>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            bgcolor: '#f9f9fa',
            borderRadius: 2,
            p: 1.2,
            mb: 0.5,
            maxWidth: '100%',
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ textAlign: 'left', display: 'block' }}
          >
            {`${comment.user?.firstName} ${comment.user?.lastName}`}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'left', display: 'block' }}>
            {comment.content}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
          <Typography variant="caption">{comment.createdAt}</Typography>
          <Button
            variant="text"
            size="small"
            sx={{ p: 0, fontSize: 12, textTransform: 'none', color: '#757575' }}
          >
            Відповісти
          </Button>
          <Button
            variant="text"
            size="small"
            sx={{ p: 0, fontSize: 12, textTransform: 'none', color: '#757575' }}
          >
            Подобається
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Comment;
