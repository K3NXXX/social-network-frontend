import React from 'react';
import Post from './Post';
import { Box, CircularProgress } from '@mui/material';
import type { PostType } from '../../types/post';

type Props = {
  posts: PostType[];
  loading: boolean;
};

const PostsList: React.FC<Props> = ({ posts, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!posts.length) {
    return (
      <Box textAlign="center" mt={4}>
        <p>Постів ще немає.</p>
      </Box>
    );
  }

  return (
    <Box>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Box>
  );
};

export default PostsList;
