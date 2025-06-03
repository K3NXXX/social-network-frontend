import React, { useState, useEffect, useRef } from 'react';
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
import PostsList from '../components/Post/PostList';
import { useAuth } from '../services/AuthContext';
import axiosInstance from '../services/axiosConfig';
import type { PostType } from '../types/post';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const take = 5;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (pageNumber = 1) => {
    try {
      const res = await axiosInstance.get('/api/posts', {
        params: {
          page: pageNumber,
          take,
        },
      });
      const { data, page: currentPage, lastPage } = res.data;

      setPosts((prev) => (pageNumber === 1 ? data : [...prev, ...data]));
      setPage(currentPage);
      setLastPage(lastPage);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useIntersectionObserver(
    loaderRef,
    () => {
      if (page < lastPage && !loading) {
        fetchPosts(page + 1);
      }
    },
    { threshold: 1 }
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (imageFile) {
        formData.append('file', imageFile);
      }
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      const response = await axiosInstance.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('POST CREATED:', response.data);
      const createdPost = response.data;

      setPosts((prev) => [createdPost, ...prev]);
      setContent('');
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', p: 2, mb: 3 }}>
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
              variant="outlined"
              sx={{
                backgroundColor: '#F8F8FC',
              }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
                  border: '1px solid #ccc',
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

      <PostsList posts={posts} loading={loading} onDelete={handleDelete} />

      <div ref={loaderRef} style={{ height: '1px' }} />
    </Box>
  );
};

export default FeedPage;
