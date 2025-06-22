import { Box, CircularProgress } from '@mui/material';

export default function GlobalLoader() {
  return (
    <Box
      sx={{
        minHeight: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress sx={{ color: 'var(--primary-color)' }} />
    </Box>
  );
}
