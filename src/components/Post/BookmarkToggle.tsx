import React from 'react';
import { IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

interface Props {
  saved: boolean;
  onToggleSave: () => void;
}

const BookmarkToggle: React.FC<Props> = ({ saved, onToggleSave }) => {
  return (
    <IconButton
      onClick={onToggleSave}
      aria-label="bookmark"
      sx={{
        color: 'var(--primary-color)',
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
      {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </IconButton>
  );
};

export default BookmarkToggle;
