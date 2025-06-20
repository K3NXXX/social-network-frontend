import React from 'react';
import { Box, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  content: string;
  photo: string | null;
}

const PostContent: React.FC<Props> = ({ content, photo }) => {
  const { t } = useTranslation();

  return (
    <CardContent sx={{ p: 0, textAlign: 'left' }}>
      <Typography variant="body1" gutterBottom sx={{ color: 'var(--text-color)' }}>
        {content}
      </Typography>
      {photo && (
        <Box
          component="img"
          src={photo}
          alt={t('posts.uploadPhotoLabel')}
          sx={{
            width: '100%',
            borderRadius: 2,
            maxHeight: 500,
            objectFit: 'contain',
            objectPosition: 'center',
            mt: 1,
          }}
        />
      )}
    </CardContent>
  );
};

export default PostContent;
