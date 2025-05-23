import React from 'react';
import { Box, CardContent, Typography } from '@mui/material';

interface Props {
  content: string;
  photo: string | null;
}

const PostContent: React.FC<Props> = ({ content, photo }) => (
  <CardContent sx={{ pt: 0, textAlign: 'left' }}>
    <Typography variant="body1" gutterBottom>
      {content}
    </Typography>
    {photo && (
      <Box
        component="img"
        src={photo}
        alt="Зображення поста"
        sx={{
          width: '100%',
          borderRadius: 2,
          maxHeight: 500,
          objectFit: 'cover',
          mt: 1,
        }}
      />
    )}
  </CardContent>
);

export default PostContent;
