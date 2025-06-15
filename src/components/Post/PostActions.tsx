import React from 'react';
import { Button, CardActions, IconButton, Stack } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkToggle from './BookmarkToggle';

interface Props {
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onToggleLike: () => void;
  onToggleComments: () => void;
  saved: boolean;
  onToggleSave: () => void;
}

const PostActions: React.FC<Props> = ({
  likesCount,
  commentsCount,
  liked,
  onToggleLike,
  onToggleComments,
  saved,
  onToggleSave,
}) => (
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
            outline: 'none', // Прибирає контур
            boxShadow: 'none', // Прибирає тінь, якщо вона є за замовчуванням
          },
          '&:focus-visible': {
            outline: 'none', // Прибирає контур
            boxShadow: 'none', // Прибирає тінь, якщо вона є за замовчуванням
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
            outline: 'none', // Прибирає контур
            boxShadow: 'none', // Прибирає тінь, якщо вона є за замовчуванням
          },
          '&:focus-visible': {
            outline: 'none', // Прибирає контур
            boxShadow: 'none', // Прибирає тінь, якщо вона є за замовчуванням
          },
        }}
        onClick={onToggleComments}
      >
        {commentsCount}
      </Button>
    </Stack>

    <Stack direction="row" spacing={2}>
      <IconButton
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
  </CardActions>
);
export default PostActions;
