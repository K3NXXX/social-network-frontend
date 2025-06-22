import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import logoIcon from '/public/vite.svg';

interface LogoProps {
  size?: string;
}
export default function Logo({ size }: LogoProps) {
  return (
    <Link to="/feed">
      <Box display="flex" alignItems="center" gap="0 10px">
        <img style={{ width: '25px', height: '25px' }} src={logoIcon} alt="logo" />
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
