import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePosts } from '../../hooks/usePosts.tsx';
import { postService } from '../../services/postService.ts';
import { userService } from '../../services/userService.ts';
import type { UserPublicProfile } from '../../types/user.ts';
import Post from './Post.tsx';

type Props = {
  isPublicProfile: boolean;
  publicUserData: UserPublicProfile;
  isSavedPosts?: boolean;
};

const UserPosts: React.FC<Props> = ({ isPublicProfile, publicUserData, isSavedPosts }) => {
  const { t } = useTranslation();

  const postFetcher = isSavedPosts
    ? () => userService.getSavedPosts()
    : isPublicProfile
      ? () => postService.fetchPublicUserPosts(publicUserData?.id)
      : () => postService.fetchUserPosts();

  const { posts, setPosts, loading } = usePosts(postFetcher, 5, [publicUserData?.id, isSavedPosts]);

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  if (!posts && loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!posts && !loading) {
    return (
      <Box textAlign="center" mt={4}>
        <p>{t('posts.emptyPostsLabel')}</p>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column">
      {posts.map((post: any, index: number) => (
        <Box key={post.id + index}>
          <Post post={post} onDelete={handleDelete} />
        </Box>
      ))}
    </Box>
  );
};

export default UserPosts;
