import React, { useState } from 'react';
import { Avatar, Box, Typography, Stack, Button, TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/Favorite';

import { useTranslation } from 'react-i18next';
import type { CommentType } from '../../types/post';
import { formatCreatedAt } from '../../utils/dateUtils';
import { postService } from '../../services/postService';
import i18n from '../../internationalization/i18n';

interface CommentProps {
  comment: CommentType;
  onReplyClick?: () => void;
  onDeleteClick?: () => void;
  isOwner: boolean;
  onEditClick?: () => void;
  isEditing: boolean;
  editContent: string;
  onEditContentChange: (value: string) => void;
  onConfirmEdit: () => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onReplyClick,
  onDeleteClick,
  isOwner,
  onEditClick,
  isEditing,
  editContent,
  onEditContentChange,
  onConfirmEdit,
}) => {
  const [liked, setLiked] = useState(comment.liked);
  const [likesCount, setLikesCount] = useState(comment._count?.likes || 0);
  const { t } = useTranslation();
  const locale = i18n.language;

  const handleToggleLike = async () => {
    try {
      const result = await postService.toggleCommentLike(comment.id);
      setLiked(result.liked);
      setLikesCount((prev) => (result.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('Помилка при лайкуванні коментаря:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        width: '100%',
      }}
    >
      <Avatar src={comment.user?.avatarUrl ?? undefined}>
        {!comment.user?.avatarUrl &&
          `${comment.user?.firstName?.[0]?.toUpperCase() ?? ''}${comment.user?.lastName?.[0]?.toUpperCase() ?? ''}`}
      </Avatar>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              bgcolor: 'var(--background-color)',
              borderRadius: 2,
              p: 1.2,
              mb: 0.5,
              flex: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ textAlign: 'left', display: 'block', color: 'var(--text-color)' }}
            >
              {`${comment.user?.firstName} ${comment.user?.lastName}`}
            </Typography>

            {isEditing ? (
              <Stack spacing={1}>
                <TextField
                  multiline
                  fullWidth
                  value={editContent}
                  onChange={(e) => onEditContentChange(e.target.value)}
                  size="small"
                  InputProps={{
                    sx: {
                      color: 'var(--text-color)',
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--primary-color)',
                      borderWidth: '1px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color)',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--primary-color)',
                      borderWidth: '2px',
                    },
                    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--error-color)',
                    },
                  }}
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={onConfirmEdit}
                    sx={{
                      backgroundColor: 'var(--primary-color)',
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                      '&:focus-visible': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {t('posts.saveLabel')}
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'left',
                  display: 'block',
                  color: 'var(--text-color)',
                  wordBreak: 'break-word',
                }}
              >
                {comment.content}
              </Typography>
            )}
          </Box>

          <Button
            startIcon={
              liked ? (
                <FavoriteIcon sx={{ color: 'var(--primary-color)' }} />
              ) : (
                <FavoriteBorderIcon />
              )
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
            onClick={handleToggleLike}
          >
            {likesCount}
          </Button>
        </Box>

        <Stack direction="row" spacing={2} sx={{ color: 'var(--text-color)' }}>
          <Typography variant="caption">
            {formatCreatedAt(comment.createdAt, locale as 'uk' | 'en')}
          </Typography>
          <Button
            variant="text"
            size="small"
            sx={{
              p: 0,
              fontSize: 12,
              textTransform: 'none',
              color: 'var(--text-color)',
              opacity: 0.5,
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: 'none',
              },
            }}
            onClick={onReplyClick}
          >
            {t('posts.commentReply')}
          </Button>
          {isOwner && (
            <>
              <Button
                variant="text"
                size="small"
                sx={{
                  p: 0,
                  fontSize: 12,
                  textTransform: 'none',
                  color: 'var(--text-color)',
                  opacity: 0.5,
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
                onClick={onDeleteClick}
              >
                {t('posts.deleteLabel')}
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{
                  p: 0,
                  fontSize: 12,
                  textTransform: 'none',
                  color: 'var(--text-color)',
                  opacity: 0.5,
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
                onClick={onEditClick}
              >
                {t('posts.editLabel')}
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default Comment;
