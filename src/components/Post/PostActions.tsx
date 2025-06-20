import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { Button, CardActions, IconButton, Stack } from '@mui/material';
import React, { useState } from 'react';
import SharingMenu from '../user/SharingMenu';
import BookmarkToggle from './BookmarkToggle';
import type { PostType } from '../../types/post';

interface Props {
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onToggleLike: () => void;
  onToggleComments: () => void;
  saved: boolean;
  onToggleSave: () => void;
  post: PostType;
}

const PostActions: React.FC<Props> = ({
  likesCount,
  commentsCount,
  liked,
  onToggleLike,
  onToggleComments,
  saved,
  onToggleSave,
  post,
}) => {
  const [isSharingMenuOpened, setIsSharingMenuOpened] = useState(false);
  return (
    <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
      <Stack direction="row" spacing={2}>
        <Button
          startIcon={
            liked ? <FavoriteIcon sx={{ color: 'var(--primary-color)' }} /> : <FavoriteBorderIcon />
          }
          sx={{
            fontWeight: 'bold',
            textTransform: 'none',
            color: liked ? 'var(--primary-color)' : '#757575',
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
              boxShadow: 'none',
            },
          }}
          onClick={onToggleLike}
        >
          {likesCount}
        </Button>
        <Button
          startIcon={<ChatBubbleOutlineIcon />}
          sx={{
            fontWeight: 'bold',
            textTransform: 'none',
            color: 'var(--primary-color)',
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
              boxShadow: 'none',
            },
          }}
          onClick={onToggleComments}
        >
          {commentsCount}
        </Button>
      </Stack>

      <Stack direction="row" spacing={2}>
        <IconButton
          onClick={() => setIsSharingMenuOpened(true)}
          sx={{
            '&:hover': {
              color: 'var(--primary-color)',
            },
            '&:active': {
              border: 'none',
              outline: 'none',
            },
            '&:focus': {
              border: 'none',
              outline: 'none',
            },
          }}
        >
          <ShareIcon sx={{ color: 'var(--primary-color)' }} />
        </IconButton>
        <BookmarkToggle saved={saved} onToggleSave={onToggleSave} />
      </Stack>
      <SharingMenu
        post={post}
        isPost={true}
        open={isSharingMenuOpened}
        onClose={() => setIsSharingMenuOpened(false)}
      />
    </CardActions>
  );
};
export default PostActions;
