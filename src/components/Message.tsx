import React from 'react';
import { Box } from '@mui/material';

interface MessageProps {
  content: string;
  isFromCurrentUser: boolean;
}

const currentUserStyles = {
  bgcolor: '#9885f4',
  color: 'white',
  alignSelf: 'flex-end',
  borderRadius: '16px 16px 0 16px',
  padding: '10px 16px',
  maxWidth: '40%',
  margin: '6px 0',
  wordBreak: 'break-word',
  boxShadow: '0 1px 5px rgb(0 0 0 / 0.1)',
  marginRight: '0.75rem',
};

const otherUserStyles = {
  bgcolor: '#e0e0e0',
  color: 'black',
  alignSelf: 'flex-start',
  borderRadius: '16px 16px 16px 0',
  padding: '10px 16px',
  maxWidth: '40%',
  margin: '6px 0',
  wordBreak: 'break-word',
  boxShadow: '0 1px 5px rgb(0 0 0 / 0.1)',
  marginLeft: '0.75rem',
};

const Message: React.FC<MessageProps> = ({ content, isFromCurrentUser }) => {
  return <Box sx={isFromCurrentUser ? currentUserStyles : otherUserStyles}>{content}</Box>;
};

export default Message;
