import React from 'react';
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
import Post from '../components/Post/Post';

const FeedPage: React.FC = () => {
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
            <Avatar src="/your-avatar.jpg" />
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Що у вас на думці?"
              variant="outlined"
              sx={{
                backgroundColor: '#F8F8FC',
              }}
            />
          </Stack>
        </CardContent>
        <Divider sx={{ my: 2, mx: -2 }} />
        <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
          <Button variant="text" startIcon={<AddPhotoAlternateIcon />}>
            Фото
          </Button>
          <Button variant="contained" endIcon={<SendIcon />}>
            Опублікувати
          </Button>
        </CardActions>
      </Card>

      <Post />
      <Post />
    </Box>
  );
};

export default FeedPage;
