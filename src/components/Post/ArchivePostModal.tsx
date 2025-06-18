import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ArchivePostModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ArchivePostModal({ open, onClose }: ArchivePostModalProps) {
  const { t } = useTranslation();
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
