import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { type ISidebarList } from '../../lists/sidebar.list';

interface SidebarListItemProps {
  item: ISidebarList;
  onClickCallback: (() => void) | undefined;
  backgroundColor: string;
  isCollapsed?: boolean;
}

const SidebarListItem: React.FC<SidebarListItemProps> = ({
  item,
  onClickCallback,
  backgroundColor,
  isCollapsed,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      onClick={onClickCallback}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: isCollapsed ? 0 : '20px',
        padding: '10px 8px',
        borderRadius: 4,
        width: '100%',
        marginBottom: '10px',
        backgroundColor: backgroundColor,
        '&:hover': {
          backgroundColor: '#2a2340',
        },
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        cursor: 'pointer',
      }}
    >
      <item.icon sx={{ color: 'white', fontSize: '30px' }} />
      {!isCollapsed && (
        <Typography sx={{ color: 'white', fontSize: '17px' }}>{t(item.labelKey)}</Typography>
      )}
    </Box>
  );
};

export default SidebarListItem;
