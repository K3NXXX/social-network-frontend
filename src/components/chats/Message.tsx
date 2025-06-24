import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { chatsService } from '../../services/chatsService';
import type { MessageData } from '../../types/chats';

const currentUserStyles = {
  bgcolor: '#9885f4',
  color: 'white',
  alignSelf: 'flex-end',
  borderRadius: '16px 16px 0 16px',
  padding: '10px 16px',
  maxWidth: '70%',
  margin: '6px 0',
  wordBreak: 'break-word',
  boxShadow: '0 1px 5px rgb(0 0 0 / 0.1)',
  marginRight: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
};

const otherUserStyles = {
  bgcolor: '#e0e0e0',
  color: 'black',
  alignSelf: 'flex-start',
  borderRadius: '16px 16px 16px 0',
  padding: '10px 16px',
  maxWidth: '70%',
  margin: '6px 0',
  wordBreak: 'break-word',
  boxShadow: '0 1px 5px rgb(0 0 0 / 0.1)',
  marginLeft: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
};

export interface MessageProps {
  data: MessageData;
}

const Message: React.FC<MessageProps & { innerRef?: React.Ref<HTMLDivElement> }> = ({
  data,
  innerRef,
}) => {
  const currentUser = chatsService.getUser();
  const { t } = useTranslation();

  return (
    <Box
      sx={currentUser.id === data.sender?.id ? currentUserStyles : otherUserStyles}
      ref={innerRef}
      data-id={data.id}
    >
      <Typography
        sx={{
          alignSelf: 'flex-start',
          textAlign: 'left',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        {data.content}
      </Typography>
      <Box
        sx={{
          fontSize: 12,
          alignSelf: 'flex-end',
          color: currentUser.id === data.sender?.id ? 'white' : 'gray',
        }}
      >
        {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {currentUser.id === data.sender?.id &&
          (data.isRead === true
            ? `, ${t('chats.read')}`
            : data.isRead === false
              ? `, ${t('chats.sent')}`
              : '')}
      </Box>
    </Box>
  );
};

export default Message;
