import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  TextField,
  Button,
  Stack,
  Divider,
  Box,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useAuth } from '../../services/AuthContext';
import { postService } from '../../services/postService';
import type { PostType } from '../../types/post';
import { useTranslation } from 'react-i18next';
import { NoOutlineButton } from '../../ui/NoOutlineButton';

type Props = {
  onPostCreated: (post: PostType) => void;
};

const CreatePostCard: React.FC<Props> = ({ onPostCreated }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async () => {
    try {
      const createdPost = await postService.createPost(content, imageFile);
      onPostCreated(createdPost);
      setContent('');
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '1000px',
        mx: 'auto',
        p: 1,
        mb: 3,
        backgroundColor: 'var(--secondary-color)',
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar src={user?.avatarUrl ?? undefined}>
            {!user?.avatarUrl &&
              `${user?.firstName?.[0]?.toUpperCase() ?? ''}${user?.lastName?.[0]?.toUpperCase() ?? ''}`}
          </Avatar>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={t('posts.createCommentPlaceholder')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
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
              backgroundColor: 'var(--background-color)',
            }}
          />
        </Stack>

        {previewUrl && (
          <Box mt={2}>
            <img
              src={previewUrl}
              alt="preview"
              style={{
                maxHeight: '200px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
              }}
            />
          </Box>
        )}
      </CardContent>

      <Divider sx={{ my: 2, mx: -2 }} />

      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <div>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-photo"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="upload-photo">
            <Button
              variant="text"
              component="span"
              startIcon={<AddPhotoAlternateIcon />}
              sx={{ color: 'var(--primary-color)' }}
            >
              {t('posts.uploadPhotoLabel')}
            </Button>
          </label>
          {imageFile && (
            <span style={{ marginLeft: 8, color: 'var(--text-color)' }}>{imageFile.name}</span>
          )}
        </div>
        <NoOutlineButton
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          sx={{ backgroundColor: 'var(--primary-color)' }}
        >
          {t('posts.publishLabel')}
        </NoOutlineButton>
      </CardActions>
    </Card>
  );
};

export default CreatePostCard;
