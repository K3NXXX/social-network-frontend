import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import GlobalLoader from '../ui/GlobalLoader';
import Post from '../components/Post/Post';
import { postService } from '../services/postService';
import type { PostType } from '../types/post';

export default function FullPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    postService
      .fetchSinglePost(postId)
      .then((p) => setPost(p))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleDelete = async (id: string) => {
    try {
      await postService.deletePost(id);
      navigate(-1);
    } catch (err) {
      console.error('Не вдалось видалити пост', err);
    }
  };

  if (loading) return <GlobalLoader />;

  return (
    <Dialog
      open
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          m: 2,
          borderRadius: 2,
          boxShadow: 3,
          maxHeight: 'none',
          pb: 2,
          overflow: 'visible',
        },
      }}
      BackdropProps={{
        sx: { backgroundColor: 'rgba(0,0,0,0.5)' },
      }}
    >
      <DialogContent
        sx={{
          maxHeight: 'calc(100vh - 96px)',
          overflowY: 'auto',
        }}
      >
        {post ? (
          <Post post={post} onDelete={handleDelete} />
        ) : (
          <Typography sx={{ p: 4, textAlign: 'center' }}>Пост не знайдено</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
