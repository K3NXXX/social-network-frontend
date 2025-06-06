import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import type { UserPublicProfile } from '../../types/user.ts';
import { usePosts } from '../../hooks/usePosts.tsx';
import { postService } from '../../services/postService.ts';
import UserPost from './UserPost.tsx';

type Props = {
  isPublicProfile: boolean;
  publicUserData: UserPublicProfile;
};

const UserPosts: React.FC<Props> = ({ isPublicProfile, publicUserData }) => {
  const postFetcher = isPublicProfile
    ? () => postService.fetchPublicUserPosts(publicUserData?.id)
    : () => postService.fetchUserPosts();

  const { posts, loading } = usePosts(postFetcher);

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
        <p>Постів ще немає.</p>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column">
      {posts.map((post: any, index: number) => (
        <Box key={post.id + index}>
          <UserPost post={post} />
        </Box>
      ))}
    </Box>
  );
};

export default UserPosts;
