import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import type { UserPublicProfile } from '../../types/user.ts';
import { usePosts } from '../../hooks/usePosts.tsx';
import { postService } from '../../services/postService.ts';

type Props = {
  profile: UserPublicProfile;
  isPublicProfile: boolean;
  publicUserData: UserPublicProfile;
};

const UserPosts: React.FC<Props> = ({ profile, isPublicProfile, publicUserData }) => {
  const {
    posts,
    // setPosts,
    // page,
    // lastPage,
    loading,
    // fetchPosts
  } = usePosts(postService.fetchUserPosts);

  const displayedPosts = isPublicProfile ? publicUserData?.posts || [] : posts;

  if (!displayedPosts.length && loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!displayedPosts.length && !loading) {
    return (
      <Box textAlign="center" mt={4}>
        <p>Постів ще немає.</p>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {displayedPosts.map((post: any) => (
        <Box
          key={post.id}
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <Avatar src={profile.avatarUrl} sx={{ width: 36, height: 36 }} />
          <Box display="flex" flexDirection="column" alignItems="start">
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Typography fontWeight="bold" fontSize={15} paddingRight="4px">
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography fontSize={14} fontWeight="normal" color="#737373">
                @{profile.username}
              </Typography>
              <Typography color="#737373" paddingX="3px">
                ·
              </Typography>
              <Typography fontSize={14} color="#737373">
                {new Date(post.createdAt).toLocaleString('uk-UA', {
                  day: 'numeric',
                  month: 'long',
                })}
              </Typography>
            </Box>

            {post.content && (
              <Typography fontSize={15} textAlign="left">
                {post.content}
              </Typography>
            )}

            {post.photo && (
              <Box
                component="img"
                src={post.photo}
                alt="Пост"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  objectFit: 'cover',
                  maxHeight: 500,
                  mt: 1,
                }}
              />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default UserPosts;
