import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PostType } from '../../types/post';
import Post from './Post';

type Props = {
  posts: PostType[];
  loading: boolean;
  onDelete: (postId: string) => void;
  onPostPrivacyChange?: (post: PostType) => void;
};

const PostsList: React.FC<Props> = ({ posts, loading, onDelete, onPostPrivacyChange }) => {
  const { t } = useTranslation();

  if (!posts.length && loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: 'var(--primary-color)' }} />
      </Box>
    );
  }

  if (!posts.length && !loading) {
    return (
      <Box textAlign="center" mt={4}>
        <p>{t('posts.emptyPostsLabel')}</p>
      </Box>
    );
  }

  return (
    <Box>
      {posts.map((post) => (
        <Post
          onPostPrivacyChange={onPostPrivacyChange}
          key={post.id}
          post={post}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

export default PostsList;
