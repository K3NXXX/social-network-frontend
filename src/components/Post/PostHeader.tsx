import React from 'react';
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface Props {
  user: { firstName: string; lastName: string; avatarUrl: string | null };
  createdAt: string;
}

const PostHeader: React.FC<Props> = ({ user, createdAt }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar src={user.avatarUrl ?? undefined}>
        {!user.avatarUrl &&
          `${user.firstName?.[0]?.toUpperCase() ?? ''}${user.lastName?.[0]?.toUpperCase() ?? ''}`}
      </Avatar>

      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ textAlign: 'left', display: 'block' }}
        >
          {user.firstName} {user.lastName}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'left', display: 'block' }}
        >
          {new Date(createdAt).toLocaleString()}
        </Typography>
      </Box>
    </Stack>
    <IconButton>
      <MoreHorizIcon />
    </IconButton>
  </Box>
);

export default PostHeader;
