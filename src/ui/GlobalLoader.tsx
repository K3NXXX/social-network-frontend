import { Box, CircularProgress } from '@mui/material';

export default function GlobalLoader() {
  return (
    <Box
      sx={{
        minHeight: '70vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
