import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: string;
}
export default function Logo({ size }: LogoProps) {
  return (
    <Link to="/feed">
      <Box>
        <Typography
          fontFamily="Ubuntu"
          fontWeight={700}
          color="#9885f4"
          fontSize={size ? size : '27px'}
        >
          Vetra
        </Typography>
      </Box>
    </Link>
  );
}
