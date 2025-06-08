import { Avatar, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import type { PostType } from '../../types/post.ts';
import EditPostModal from './EditPostModal.tsx';

interface Props {
  post: PostType;
  onDelete?: (id: string) => void;
}

const UserPosts: React.FC<Props> = ({ post }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);

  const handleUpdatePost = (updatedPost: PostType) => {
    setCurrentPost(updatedPost);
  };

  return (
    <Box
      key={post.id}
      sx={{
        p: 1.5,
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Avatar src={post.user.avatarUrl || ''} sx={{ width: 36, height: 36 }} />
      <Box display="flex" flexDirection="column" alignItems="start">
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Typography fontWeight="bold" fontSize={15} paddingRight="4px">
            {post.user.firstName} {post.user.lastName}
          </Typography>
          <Typography fontSize={14} fontWeight="normal" color="#737373">
            @{post.user.username}
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

        <EditPostModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          post={currentPost}
          onUpdate={handleUpdatePost}
        />

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
  );
};

export default UserPosts;
