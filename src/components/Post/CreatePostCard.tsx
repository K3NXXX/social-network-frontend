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

type Props = {
  onPostCreated: (post: PostType) => void;
};

const CreatePostCard: React.FC<Props> = ({ onPostCreated }) => {
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
    <Card sx={{ width: '100%', maxWidth: '1000px', mx: 'auto', p: 2, mb: 3 }}>
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
            placeholder="Що у вас на думці?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
            sx={{ backgroundColor: '#F8F8FC' }}
          />
        </Stack>

        {previewUrl && (
          <Box mt={2}>
            <img
              src={previewUrl}
              alt="preview"
              style={{ maxHeight: '200px', borderRadius: '8px', border: '1px solid #ccc' }}
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
            <Button variant="text" component="span" startIcon={<AddPhotoAlternateIcon />}>
              Фото
            </Button>
          </label>
          {imageFile && <span style={{ marginLeft: 8 }}>{imageFile.name}</span>}
        </div>
        <Button variant="contained" endIcon={<SendIcon />} onClick={handleSubmit}>
          Опублікувати
        </Button>
      </CardActions>
    </Card>
  );
};

export default CreatePostCard;
