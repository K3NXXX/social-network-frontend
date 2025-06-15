import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePosts } from '../../hooks/usePosts.tsx';
import { postService } from '../../services/postService.ts';
import type { PostType } from '../../types/post.ts';
import type { UserPublicProfile } from '../../types/user.ts';
import Post from './Post.tsx';

type Props = {
  isPublicProfile: boolean;
  publicUserData: UserPublicProfile;
  savedPosts?: PostType[];
  isSavedPosts?: boolean;
  setSavedPosts?: React.Dispatch<React.SetStateAction<PostType[] | null>>;
};

const UserPosts: React.FC<Props> = ({
  isPublicProfile,
  publicUserData,
  isSavedPosts,
  savedPosts,
  setSavedPosts,
}) => {
  const { t } = useTranslation();

  const postFetcher = isPublicProfile
    ? () => postService.fetchPublicUserPosts(publicUserData?.id)
    : () => postService.fetchUserPosts();

  const { posts, setPosts, loading } = usePosts(postFetcher, 5, [publicUserData?.id]);

  const postsToRender = isSavedPosts ? savedPosts : posts;

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handleUnsave = (postId: string) => {
    setSavedPosts?.((prev) => (prev ? prev.filter((p) => p.id !== postId) : prev));
  };

  if (!postsToRender?.length && loading && !isSavedPosts) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: 'var(--primary-color)' }} />
      </Box>
    );
  }

  if (!postsToRender?.length && !loading) {
    return (
      <Box textAlign="center" mt={4}>
        <p>{t('posts.emptyPostsLabel')}</p>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column">
      {postsToRender?.map((post: any, index: number) => (
        <Box key={post.id + index}>
          <Post
            onUnsave={isSavedPosts ? handleUnsave : undefined}
            post={post}
            onDelete={handleDelete}
          />
        </Box>
      ))}
    </Box>
  );
};

export default UserPosts;
