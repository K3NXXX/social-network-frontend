import { Box, Skeleton } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

export default function PostSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: isDark ? '1px solid #2c2c2c' : '1px solid #e0e0e0',
        padding: 2,
        mb: 2,
        backgroundColor: isDark ? '#1e1e1e' : '#fff',
        mx: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={40} height={40} sx={isDark ? darkSkeletonStyle : {}} />
        <Box sx={{ ml: 2, flexGrow: 1 }}>
          <Skeleton variant="text" width="15%" height={20} sx={isDark ? darkSkeletonStyle : {}} />
          <Skeleton variant="text" width="10%" height={16} sx={isDark ? darkSkeletonStyle : {}} />
        </Box>
      </Box>
      <Skeleton
        variant="rectangular"
        height={170}
        sx={{
          borderRadius: 2,
          ...(isDark ? darkSkeletonStyle : {}),
        }}
      />
    </Box>
  );
}
const darkSkeletonStyle = {
  backgroundColor: '#2c2c2c',
  backgroundImage: `linear-gradient(90deg, #2c2c2c 0%, #3a3a3a 50%, #2c2c2c 100%)`,
};
