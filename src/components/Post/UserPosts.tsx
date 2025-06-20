import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, CircularProgress, Fab, Typography, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx';
import { usePosts } from '../../hooks/usePosts.tsx';
import { postService } from '../../services/postService.ts';
import { userService } from '../../services/userService.ts';
import type { PostType } from '../../types/post.ts';
import type { UserPublicProfile } from '../../types/user.ts';
import PostSkeleton from '../../ui/skeletons/PostSkeleton.tsx';
import Post from './Post.tsx';

type Props = {
  isPublicProfile: boolean | undefined;
  publicUserData: UserPublicProfile | undefined | null;
  isSavedPosts?: boolean;
};

const UserPosts: React.FC<Props> = ({ isPublicProfile, publicUserData, isSavedPosts }) => {
  const { t } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const postFetcher = isPublicProfile
    ? (page: number, take: number) =>
      postService.fetchPublicUserPosts(publicUserData?.id ?? '', page, take)
    : (page: number, take: number) => postService.fetchUserPosts(page, take);

  const { posts, setPosts, loading, loaderRef, page, totalPages, fetchPosts } = usePosts(
    isSavedPosts ? userService.getSavedPosts : postFetcher,
    5,
    isSavedPosts ? [] : [publicUserData?.id]
  );

  useIntersectionObserver(
    loaderRef,
    () => {
      if (page < totalPages && !loading) fetchPosts(page + 1);
    },
    { threshold: 0.1 }
  );

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handleUnsave = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
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
        setPosts([]);
        fetchPosts(1);
      }
    }, 100);
  };

  if (!posts?.length && loading) {
    return (
      <>
        {[...Array(3)].map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </>
    );
  }

  if (!posts?.length && !loading) {
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
    <Box display="flex" flexDirection="column">
      {posts.map((post: PostType, index: number) => (
        <Box key={post.id + index}>
          <Post
            onPostPrivacyChange={(updatedPost) => {
              setPosts((prev) => prev.filter((p) => p.id !== updatedPost.id));
            }}
            onUnsave={isSavedPosts ? handleUnsave : undefined}
            post={post}
            onDelete={handleDelete}
          />
        </Box>
      ))}
      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress sx={{ color: 'var(--primary-color)' }} />
        </Box>
      )}
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

export default UserPosts;
