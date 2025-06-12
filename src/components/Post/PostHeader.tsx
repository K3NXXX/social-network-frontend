import React, { useEffect, useState } from 'react';
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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import type { User } from '../../types/post';
import { formatCreatedAt } from '../../utils/dateUtils';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

interface Props {
  user: User;
  createdAt: string;
  isOwner: boolean;
  onDelete: () => void;
  onEdit?: () => void;
}

const PostHeader: React.FC<Props> = ({ user, createdAt, isOwner, onDelete, onEdit }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setCurrentTime] = useState(Date.now());
  const locale = i18n.language;
  const open = Boolean(anchorEl);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={user.avatarUrl ?? undefined}>
          {!user.avatarUrl &&
            `${user.firstName?.[0]?.toUpperCase() ?? ''}${user.lastName?.[0]?.toUpperCase() ?? ''}`}
        </Avatar>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ textAlign: 'left', display: 'block' }}
          >
            {user.firstName} {user.lastName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'left', display: 'block' }}
          >
            {formatCreatedAt(createdAt, locale as 'uk' | 'en')}
          </Typography>
        </Box>
      </Stack>
      <IconButton onClick={handleMenuOpen}>
        <MoreHorizIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          {t('posts.shareLabel')}
        </MenuItem>

        {isOwner && [
          <MenuItem key="edit" onClick={handleEditClick}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            {t('posts.editLabel')}
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
    </Box>
  );
};

export default PostHeader;
