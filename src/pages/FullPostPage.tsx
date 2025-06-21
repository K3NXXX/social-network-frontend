import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Post from '../components/Post/Post';
import GlobalLoader from '../ui/GlobalLoader';
import { PAGES } from '../constants/pages.constants';
import { postService } from '../services/postService';
import { useTheme } from '../contexts/ThemeContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Dialog, DialogContent } from '@mui/material';
import type { PostType } from '../types/post';

export default function FullPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const background = (location.state as any)?.backgroundLocation as Location | undefined;
  const { theme } = useTheme();

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
    if (background) {
      navigate(background.pathname + (background.search || ''), { replace: true });
    } else {
      navigate(PAGES.NOTIFICATIONS, { replace: true });
    }
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
          width: '85vw',
          maxWidth: 900,
          maxHeight: '80vh',
          borderRadius: 2,
          boxShadow: 3,
          p: 0,
          overflow: 'hidden',
          backgroundColor: theme === 'light' ? 'white' : '#2c2c2c',
        },
      }}
    >
      <DialogContent
        sx={{
          pt: 5.5,
          overflowY: 'auto',
        }}
      >
        {post ? (
          <Box
            sx={{
              width: '100%',
              maxWidth: 900,
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Post post={post} onDelete={handleDelete} />
          </Box>
        ) : (
          <Typography sx={{ p: 4, textAlign: 'center' }}>Пост не знайдено</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
