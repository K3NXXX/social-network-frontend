import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const BookmarkToggle: React.FC = () => {
  const [bookmarked, setBookmarked] = useState(false);

  const handleToggle = () => {
    setBookmarked((prev) => !prev);
  };

  return (
    <IconButton
      onClick={handleToggle}
      color={bookmarked ? 'primary' : 'default'}
      aria-label="bookmark"
    >
      {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </IconButton>
  );
};

export default BookmarkToggle;
