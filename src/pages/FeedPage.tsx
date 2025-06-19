import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Divider, Fab, Typography, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreatePostCard from '../components/Post/CreatePostCard';
import PostsList from '../components/Post/PostList';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { usePosts } from '../hooks/usePosts';
import { postService } from '../services/postService';

const FeedPage: React.FC = () => {
  const [showDiscover, setShowDiscover] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t } = useTranslation();

  const {
    posts: feedPosts,
    setPosts: setFeedPosts,
    page: feedPage,
    totalPages: feedLastPage,
    loading: loadingFeed,
    fetchPosts: fetchFeedPosts,
    loaderRef,
  } = usePosts(postService.fetchFeedPosts);

  const {
    posts: discoverPosts,
    setPosts: setDiscoverPosts,
    page: discoverPage,
    totalPages: discoverLastPage,
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

  useEffect(() => {
    if (feedLastPage === 0 && !showDiscover) {
      setShowDiscover(true);
      if (discoverPosts.length === 0 && discoverPage === 1) {
        fetchDiscoverPosts(1);
      }
    }
  }, [feedLastPage, showDiscover, discoverPosts.length, discoverPage]);

  const handleDelete = (postId: string) => {
    setFeedPosts((prev) => prev.filter((post) => post.id !== postId));
    setDiscoverPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTopAndReload = async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const checkIfAtTop = setInterval(() => {
      if (window.scrollY === 0) {
        clearInterval(checkIfAtTop);

        setFeedPosts([]);
        setDiscoverPosts([]);
        setShowDiscover(false);
        fetchFeedPosts(1);
      }
    }, 500);
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
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)',
      }}
    >
      <CreatePostCard onPostCreated={(newPost) => setFeedPosts((prev) => [newPost, ...prev])} />

      <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto' }}>
        <PostsList
          onPostPrivacyChange={(updatedPost) => {
            setFeedPosts((prev) => prev.filter((p) => p.id !== updatedPost.id));
          }}
          posts={feedPosts}
          loading={loadingFeed}
          onDelete={handleDelete}
        />

        {showDiscover && (
          <>
            <Divider sx={{ my: 4, borderColor: 'var(--border-color)' }} />
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 4,
                color: 'var(--text-color)',
                opacity: 0.7,
              }}
            >
              {t('posts.feedEndDiscoverLabel')}
            </Typography>
            <PostsList
              onPostPrivacyChange={(updatedPost) => {
                setDiscoverPosts((prev) => prev.filter((p) => p.id !== updatedPost.id));
              }}
              posts={discoverPosts}
              loading={loadingDiscover}
              onDelete={handleDelete}
            />
          </>
        )}
      </Box>

      <div ref={loaderRef} style={{ height: '1px' }} />

      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="small"
          onClick={handleScrollToTopAndReload}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'var(--primary-color)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default FeedPage;
