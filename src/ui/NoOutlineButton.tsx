import type { Theme } from '@emotion/react';
import { Button, type ButtonProps, type SxProps } from '@mui/material';

interface NoOutlineButtonProps extends ButtonProps {
  sx?: SxProps<Theme>;
}
export const NoOutlineButton = ({ sx, ...props }: NoOutlineButtonProps) => (
  <Button
    {...props}
    sx={{
      textTransform: 'none',
      borderRadius: '10px',
      padding: '4px 14px',
      fontSize: '14px',
      outline: 'none',
      boxShadow: 'none',
      '&:focus': {
        outline: 'none',
        boxShadow: 'none',
      },
      '&:active': {
        outline: 'none',
        boxShadow: 'none',
      },
      ...sx,
    }}
  />
);
