import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { postService } from '../../services/postService';
import type { PostType } from '../../types/post';

interface Props {
  open: boolean;
  onClose: () => void;
  post: PostType;
  onUpdate: (updatedPost: PostType) => void;
}

const EditPostModal: React.FC<Props> = ({ open, onClose, post, onUpdate }) => {
  const [content, setContent] = useState(post.content || '');
  const [file, setFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedPost = await postService.updatePost(post.id, content, file, removePhoto);
      onUpdate(updatedPost);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Редагування поста</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          fullWidth
          minRows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ my: 2 }}
        />
        {post.photo && !removePhoto && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img
              src={post.photo}
              alt="post"
              style={{
                maxWidth: '300px',
                maxHeight: '200px',
                borderRadius: 8,
                objectFit: 'contain',
              }}
            />
            <Button color="error" onClick={() => setRemovePhoto(true)} sx={{ mt: 1 }} fullWidth>
              Видалити фото
            </Button>
          </Box>
        )}
        <Button variant="contained" component="label" fullWidth>
          Завантажити нове фото
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Скасувати
        </Button>
        <Button onClick={handleUpdate} disabled={true} variant="contained">
          Оновити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPostModal;
