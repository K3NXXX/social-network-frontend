import React, { useEffect, useState } from 'react';
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedPost = await postService.updatePost(post.id, content, file);
      onUpdate(updatedPost);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.getElementById('content-input')?.focus();
    }
  }, [open]);

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

        {previewUrl ? (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img
              src={previewUrl}
              alt="preview"
              style={{
                maxWidth: '300px',
                maxHeight: '200px',
                borderRadius: 8,
                objectFit: 'contain',
              }}
            />
          </Box>
        ) : post.photo ? (
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
          </Box>
        ) : null}

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
        <Button onClick={handleUpdate} disabled={loading} variant="contained">
          Оновити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPostModal;
