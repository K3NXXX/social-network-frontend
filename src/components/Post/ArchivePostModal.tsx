import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { postService } from '../../services/postService';
import type { PostType } from '../../types/post';
import { useTheme } from '../../contexts/ThemeContext';

interface ArchivePostModalProps {
  open: boolean;
  onClose: () => void;
  post: PostType;
  onUpdate: (updatedPost: PostType) => void;
  isArchivePage?: boolean;
}

export default function ArchivePostModal({
  open,
  onClose,
  onUpdate,
  post,
  isArchivePage,
}: ArchivePostModalProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleChangePrivacy = async (privacy: 'PRIVATE' | 'PUBLIC') => {
    try {
      const updatedPost = await postService.updatePostPrivacy(post.id, privacy);
      onUpdate(updatedPost);
      onClose();
    } catch (error) {
      console.log('error making post private: ', error);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'var(--secondary-color)',
        },
        '& .MuiDialogTitle-root': {
          color: 'var(--text-color)',
        },
      }}
    >
      <DialogTitle>{isArchivePage ? t('posts.makePublic') : t('posts.addToArchive')}</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
          {isArchivePage ? t('posts.makePublicInfo') : t('posts.addToArchiveInfo')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: 'var(--primary-color)',
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
              boxShadow: 'none',
            },
          }}
        >
          {t('posts.commentCancel')}
        </Button>
        {isArchivePage ? (
          <Button
            onClick={() => handleChangePrivacy('PUBLIC')}
            variant="contained"
            sx={{
              backgroundColor: 'var(--primary-color)',
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: 'none',
              },
            }}
          >
            {t('posts.makePublic')}
          </Button>
        ) : (
          <Button
            onClick={() => handleChangePrivacy('PRIVATE')}
            variant="contained"
            sx={{
              backgroundColor: 'var(--primary-color)',
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: 'none',
              },
            }}
          >
            {t('posts.makePrivate')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
