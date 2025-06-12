import React from 'react';
import { Typography, Box } from '@mui/material';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return '1.5rem';
      case 'large':
        return '2.5rem';
      default:
        return '2rem';
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontSize: getFontSize(),
          fontWeight: 'bold',
          color: '#6969cb',
          letterSpacing: '0.5px',
        }}
      >
        <span style={{ color: 'var(--text-color)' }}>Соц</span>Мережа
      </Typography>
    </Box>
  );
};

export default Logo;
