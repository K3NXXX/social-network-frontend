import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import type { PostType } from '../../types/post';
import PostSkeleton from '../../ui/skeletons/PostSkeleton';
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
      <>
        {[...Array(3)].map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </>
    );
  }

  if (!posts.length && !loading) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontStyle: 'italic', opacity: 0.8 }}
        >
          {t('posts.emptyPostsLabel')}
        </Typography>
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
