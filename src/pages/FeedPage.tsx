import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import PostsList from '../components/Post/PostList';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { postService } from '../services/postService';
import CreatePostCard from '../components/Post/CreatePostCard';
import { usePosts } from '../hooks/usePosts';

const FeedPage: React.FC = () => {
  const [showDiscover, setShowDiscover] = useState(false);

  const {
    posts: feedPosts,
    setPosts: setFeedPosts,
    page: feedPage,
    lastPage: feedLastPage,
    loading: loadingFeed,
    fetchPosts: fetchFeedPosts,
    loaderRef,
  } = usePosts(postService.fetchFeedPosts);

  const {
    posts: discoverPosts,
    setPosts: setDiscoverPosts,
    page: discoverPage,
    lastPage: discoverLastPage,
    loading: loadingDiscover,
    fetchPosts: fetchDiscoverPosts,
  } = usePosts(postService.fetchDiscoverPosts);

  useIntersectionObserver(
    loaderRef,
    () => {
      if (!showDiscover) {
        if (feedPage < feedLastPage && !loadingFeed) {
          fetchFeedPosts(feedPage + 1);
        } else if (feedPage === feedLastPage && !loadingFeed) {
          setShowDiscover(true);
          if (discoverPage === 1 && discoverPosts.length === 0) {
            fetchDiscoverPosts(1);
          }
        }
      } else {
        if (discoverPage < discoverLastPage && !loadingDiscover) {
          fetchDiscoverPosts(discoverPage + 1);
        }
      }
    },
    { threshold: 1 }
  );

  const handleDelete = (postId: string) => {
    setFeedPosts((prev) => prev.filter((post) => post.id !== postId));
    setDiscoverPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        py: 3,
      }}
    >
      <CreatePostCard onPostCreated={(newPost) => setFeedPosts((prev) => [newPost, ...prev])} />

      <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto' }}>
        <PostsList posts={feedPosts} loading={loadingFeed} onDelete={handleDelete} />

        {showDiscover && (
          <>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" align="center" color="text.secondary" mb={4}>
              Більше немає постів від тих, за ким ви стежите. Ось цікаві публікації для вас:
            </Typography>
            <PostsList posts={discoverPosts} loading={loadingDiscover} onDelete={handleDelete} />
          </>
        )}
      </Box>

      {feedLastPage > 1 && <div ref={loaderRef} style={{ height: '1px' }} />}
    </Box>
  );
};

export default FeedPage;
