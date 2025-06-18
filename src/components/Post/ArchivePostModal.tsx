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

interface ArchivePostModalProps {
  open: boolean;
  onClose: () => void;
  post: PostType;
  onUpdate: (updatedPost: PostType) => void;
}

export default function ArchivePostModal({ open, onClose, onUpdate, post }: ArchivePostModalProps) {
  const { t } = useTranslation();

  const handleMakePublic = async () => {
    try {
      const updatedPost = await postService.updatePostPrivacy(post.id, 'PRIVATE');
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
      <DialogTitle>{t('posts.addToArchive')}</DialogTitle>
      <DialogContent>
        <Typography>{t('posts.addToArchiveInfo')}</Typography>
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
        <Button
          onClick={() => handleMakePublic()}
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
      </DialogActions>
    </Dialog>
  );
}
