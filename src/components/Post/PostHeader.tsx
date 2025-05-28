import React, { useState } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import type { User } from '../../types/post';

interface Props {
  user: User;
  createdAt: string;
  isOwner: boolean;
  onDelete: () => void;
  onEdit: () => void;
}

const PostHeader: React.FC<Props> = ({ user, createdAt, isOwner, onDelete, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
    onEdit();
  };

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
            {new Date(createdAt).toLocaleString()}
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
          Поділитися
        </MenuItem>

        {isOwner && [
          <Divider key="divider" />,
          <MenuItem key="edit" onClick={handleEditClick}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Редагувати
          </MenuItem>,
          <MenuItem key="delete" onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            Видалити
          </MenuItem>,
        ]}
      </Menu>
    </Box>
  );
};

export default PostHeader;
