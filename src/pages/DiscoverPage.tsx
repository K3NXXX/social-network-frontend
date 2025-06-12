import React from 'react';
import { Box } from '@mui/material';
import PostsList from '../components/Post/PostList';
import { usePosts } from '../hooks/usePosts';
import { postService } from '../services/postService';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const DiscoverPage: React.FC = () => {
  const { posts, setPosts, page, totalPages, loading, fetchPosts, loaderRef } = usePosts(
    postService.fetchDiscoverPosts
  );

  useIntersectionObserver(
    loaderRef,
    () => {
      if (page < totalPages && !loading) {
        fetchPosts(page + 1);
      }
    },
    { threshold: 1 }
  );

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1000px',
          mx: 'auto',
        }}
      >
        <PostsList posts={posts} loading={loading} onDelete={handleDelete} />
      </Box>

      <div ref={loaderRef} style={{ height: 1 }} />
    </Box>
  );
};

export default DiscoverPage;
