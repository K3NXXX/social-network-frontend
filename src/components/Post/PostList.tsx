import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Post from './Post';
import { Box, CircularProgress } from '@mui/material';

import type { PostType } from '../../types/post';

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Failed to fetch posts:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Box>
  );
};

export default PostsList;
