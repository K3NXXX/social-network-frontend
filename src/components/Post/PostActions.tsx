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
        startIcon={liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
        sx={{
          fontWeight: 'bold',
          textTransform: 'none',
          color: liked ? 'primary' : '#757575',
        }}
        onClick={onToggleLike}
      >
        {likesCount}
      </Button>
      <Button
        startIcon={<ChatBubbleOutlineIcon />}
        sx={{ fontWeight: 'bold', textTransform: 'none', color: '#757575' }}
        onClick={onToggleComments}
      >
        {commentsCount}
      </Button>
    </Stack>

    <Stack direction="row" spacing={2}>
      <IconButton>
        <ShareIcon />
      </IconButton>
      <BookmarkToggle saved={saved} onToggleSave={onToggleSave} />
    </Stack>
  </CardActions>
);
export default PostActions;
