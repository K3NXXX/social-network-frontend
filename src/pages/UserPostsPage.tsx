import React from 'react';
import { Box } from '@mui/material';
import PostsList from '../components/Post/PostList';
import CreatePostCard from '../components/Post/CreatePostCard';
import { usePosts } from '../hooks/usePosts';
import { postService } from '../services/postService';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const UserPostsPage: React.FC = () => {
  const { posts, setPosts, page, totalPages, loading, fetchPosts, loaderRef } = usePosts(
    postService.fetchUserPosts
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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        py: 4,
      }}
    >
      <CreatePostCard onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])} />
      <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto' }}>
        <PostsList posts={posts} loading={loading} onDelete={handleDelete} />
      </Box>
      <div ref={loaderRef} style={{ height: 1 }} />
    </Box>
  );
};

export default UserPostsPage;
