import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/feed">
      <Box>
        <Typography fontFamily="Ubuntu" fontWeight={700} color="#9885f4" fontSize={27}>
          Vetra
        </Typography>
      </Box>
    </Link>
  );
}
