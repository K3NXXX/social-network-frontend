import type { Theme } from '@emotion/react';
import { Button, type ButtonProps, type SxProps } from '@mui/material';

interface NoOutlineButtonProps extends ButtonProps {
  sx?: SxProps<Theme>;
}
export const NoOutlineButton = ({ sx, ...props }: NoOutlineButtonProps) => (
  <Button
    {...props}
    sx={{
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
