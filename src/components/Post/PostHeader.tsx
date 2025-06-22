import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShareIcon from '@mui/icons-material/Share';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import i18n from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PAGES } from '../../constants/pages.constants';
import type { PostType, User } from '../../types/post';
import { formatCreatedAt } from '../../utils/dateUtils';
import SharingMenu from '../user/SharingMenu';

interface Props {
  user: User;
  createdAt: string;
  isOwner: boolean;
  onDelete: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  isArchivePage?: boolean;
  post: PostType;
}

const PostHeader: React.FC<Props> = ({
  user,
  createdAt,
  isOwner,
  onDelete,
  onEdit,
  onArchive,
  isArchivePage,
  post,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setCurrentTime] = useState(Date.now());
  const locale = i18n.language;
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [isSharingMenuOpened, setIsSharingMenuOpened] = useState(false);

  const handleProfileClick = () => {
    navigate(`${PAGES.VIEW_PUBLIC_PROFILE}/${user.id}`);
  };
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    onDelete();
  };

  const handleEditClick = () => {
    handleMenuClose();
    if (onEdit) {
      onEdit();
    }
  };

  const handleArchiveClick = () => {
    handleMenuClose();
    if (onArchive) {
      onArchive();
    }
  };

  const handleShareClick = () => {
    setIsSharingMenuOpened(true);
    handleMenuClose();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ cursor: 'pointer' }}
        onClick={handleProfileClick}
      >
        <Avatar src={user.avatarUrl ?? undefined}>
          {!user.avatarUrl &&
            `${user.firstName?.[0]?.toUpperCase() ?? ''}${user.lastName?.[0]?.toUpperCase() ?? ''}`}
        </Avatar>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ textAlign: 'left', display: 'block', color: 'var(--text-color)' }}
          >
            {user.firstName} {user.lastName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ textAlign: 'left', display: 'block', color: 'var(--text-color)' }}
          >
            {formatCreatedAt(createdAt, locale as 'uk' | 'en')}
          </Typography>
        </Box>
      </Stack>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          '&:hover': {
            color: 'var(--primary-color)',
          },
          '&:active': {
            border: 'none',
            outline: 'none',
          },
          '&:focus': {
            border: 'none',
            outline: 'none',
          },
        }}
      >
        <MoreHorizIcon sx={{ color: 'var(--text-color)' }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'var(--secondary-color)',
          },
        }}
      >
        <MenuItem
          onClick={handleShareClick}
          sx={{
            color: 'var(--text-color)',
          }}
        >
          <ListItemIcon>
            <ShareIcon fontSize="small" sx={{ color: 'var(--text-color)' }} />
          </ListItemIcon>
          {t('posts.shareLabel')}
        </MenuItem>

        {isOwner && [
          <MenuItem
            key="edit"
            onClick={handleEditClick}
            sx={{
              color: 'var(--text-color)',
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: 'var(--text-color)' }} />
            </ListItemIcon>
            {t('posts.editLabel')}
          </MenuItem>,
          <MenuItem
            key="changePrivacy"
            onClick={handleArchiveClick}
            sx={{
              color: 'var(--text-color)',
            }}
          >
            <ListItemIcon>
              <EnhancedEncryptionIcon fontSize="small" sx={{ color: 'var(--text-color)' }} />
            </ListItemIcon>
            {isArchivePage ? t('posts.makePublic') : t('posts.makePrivate')}
          </MenuItem>,
          <Divider key="divider" />,
          <MenuItem key="delete" onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            {t('posts.deleteLabel')}
          </MenuItem>,
        ]}
      </Menu>
      <SharingMenu
        post={post}
        isPost={true}
        open={isSharingMenuOpened}
        onClose={() => setIsSharingMenuOpened(false)}
      />
    </Box>
  );
};

export default PostHeader;
