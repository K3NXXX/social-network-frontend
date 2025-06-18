import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import GlobalLoader from '../ui/GlobalLoader';
import Post from '../components/Post/Post';
import { postService } from '../services/postService';
import type { PostType } from '../types/post';
import Box from '@mui/material/Box';

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
      fullWidth={false}
      PaperProps={{
        sx: {
          width: '85vw',
          maxWidth: 600,
          height: '85vh',
          maxHeight: 800,
          borderRadius: 2,
          boxShadow: 3,
          p: 0,
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          pt: 2,
          pb: 2,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : post ? (
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              px: 2,
              scrollbarWidth: 'thin', // Firefox
              scrollbarColor: '#888 transparent', // Firefox
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#555',
                },
              },
            }}
          >
            <Box
              sx={{
                transform: 'scale(0.85)',
                transformOrigin: 'top center',
                width: `${100 / 0.85}%`,
              }}
            >
              <Post post={post} onDelete={handleDelete} />
            </Box>
          </Box>
        ) : (
          <Typography sx={{ p: 4, textAlign: 'center' }}>Пост не знайдено</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
