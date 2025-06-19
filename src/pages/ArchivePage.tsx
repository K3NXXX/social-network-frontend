import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Post from '../components/Post/Post';
import { postService } from '../services/postService';
import type { PostType } from '../types/post';

export default function ArchivePage() {
  const [posts, setPosts] = useState<PostType[] | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const getArchivePosts = async () => {
      try {
        const { data } = await postService.getArchivePosts();
        setPosts(data);
      } catch (error) {
        console.log('error getting archive posts: ', error);
      }
    };
    getArchivePosts();
  }, []);

  if (!posts) return <CircularProgress />;
  return (
    <Box
      sx={{
        maxWidth: '965px',
        py: 4,
        mx: 'auto',
        padding: '30px 0 0 0',
        marginTop: '30px',
        marginBottom: '50px',
      }}
    >
      <Typography
        sx={{ textAlign: 'left', fontSize: '20px', fontWeight: '500', marginBottom: '50px' }}
      >
        {t('posts.title')}
      </Typography>
      <Box>
        {posts.length > 0 ? (
          posts?.map((post) => (
            <Box key={post.id}>
              <Post
                onPostPrivacyChange={(updatedPost) => {
                  setPosts((prev) => (prev ? prev.filter((p) => p.id !== updatedPost.id) : null));
                }}
                isArchivePage={true}
                post={post}
              />
            </Box>
          ))
        ) : (
          <Typography>{t('posts.noArchivePosts')}</Typography>
        )}
      </Box>
    </Box>
  );
}
