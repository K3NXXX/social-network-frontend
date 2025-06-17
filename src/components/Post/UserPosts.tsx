import { Box, CircularProgress, Fab, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePosts } from '../../hooks/usePosts.tsx';
import { postService } from '../../services/postService.ts';
import type { PostType } from '../../types/post.ts';
import type { UserPublicProfile } from '../../types/user.ts';
import Post from './Post.tsx';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.tsx';
import { userService } from '../../services/userService.ts';

type Props = {
  isPublicProfile: boolean;
  publicUserData: UserPublicProfile;
  isSavedPosts?: boolean;
};

const UserPosts: React.FC<Props> = ({ isPublicProfile, publicUserData, isSavedPosts }) => {
  const { t } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [savedPosts, setSavedPosts] = useState<PostType[]>([]);

  const postFetcher = isPublicProfile
    ? () => postService.fetchPublicUserPosts(publicUserData?.id)
    : () => postService.fetchUserPosts();

  const { posts, setPosts, loading, loaderRef, page, totalPages, fetchPosts } = usePosts(
    isSavedPosts ? () => userService.getSavedPosts() : postFetcher,
    5,
    [publicUserData?.id]
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
    setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
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
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: 'var(--primary-color)' }} />
      </Box>
    );
  }

  if (!posts?.length && !loading) {
    return (
      <Box textAlign="center" mt={4}>
        <p>{t('posts.emptyPostsLabel')}</p>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column">
      {posts.map((post: PostType, index: number) => (
        <Box key={post.id + index}>
          <Post
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
