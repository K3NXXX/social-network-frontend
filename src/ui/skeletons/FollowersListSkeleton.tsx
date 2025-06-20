import { Box, Skeleton } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

export default function FollowersListSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <Skeleton variant="circular" width={40} height={40} sx={isDark ? darkSkeletonStyle : {}} />
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Skeleton variant="text" width={100} height={18} sx={isDark ? darkSkeletonStyle : {}} />
          <Skeleton variant="text" width={120} height={16} sx={isDark ? darkSkeletonStyle : {}} />
        </Box>
      </Box>
      <Skeleton
        variant="rectangular"
        width={80}
        height={30}
        sx={{
          borderRadius: '8px',
          ...(isDark ? darkSkeletonStyle : {}),
        }}
      />
    </Box>
  );
}

const darkSkeletonStyle = {
  backgroundColor: '#2c2c2c',
  backgroundImage: 'linear-gradient(90deg, #2c2c2c 0%, #3a3a3a 50%, #2c2c2c 100%)',
};
