import React from 'react';
import Post from './Post';
import { Box, CircularProgress } from '@mui/material';
import type { PostType } from '../../types/post';
import { useTranslation } from 'react-i18next';

type Props = {
  posts: PostType[];
  loading: boolean;
  onDelete: (postId: string) => void;
};

const PostsList: React.FC<Props> = ({ posts, loading, onDelete }) => {
  const { t } = useTranslation();

  if (!posts.length && loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
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
        <Post key={post.id} post={post} onDelete={onDelete} />
      ))}
    </Box>
  );
};

export default PostsList;
