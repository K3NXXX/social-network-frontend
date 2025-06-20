import { Box, Skeleton } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Box paddingTop="20px" display="flex" justifyContent="center">
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        gap={4}
        width="100%"
        maxWidth={935}
      >
        <Box width={220} display="flex" justifyContent="center" alignItems="center">
          <Skeleton
            variant="circular"
            width={120}
            height={120}
            sx={isDark ? darkSkeletonStyle : {}}
          />
        </Box>

        <Box marginTop="10px" flex={1}>
          <Box display="flex">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="start"
              flexWrap="wrap"
              position="relative"
              mb={2}
            >
              <Skeleton
                variant="text"
                width={200}
                height={28}
                sx={isDark ? darkSkeletonStyle : {}}
              />
              <Skeleton
                variant="text"
                width={100}
                height={20}
                sx={isDark ? darkSkeletonStyle : {}}
              />
            </Box>

            <Box display="flex" gap={1} flexWrap="wrap" ml={4} mb={3}>
              {[...Array(2)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={100}
                  height={36}
                  sx={{
                    borderRadius: 2,
                    ...(isDark ? darkSkeletonStyle : {}),
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box display="flex" gap={4} marginBottom="20px">
            {[...Array(3)].map((_, i) => (
              <Box key={i}>
                <Skeleton
                  variant="text"
                  width={60}
                  height={20}
                  sx={isDark ? darkSkeletonStyle : {}}
                />
              </Box>
            ))}
          </Box>

          <Box display="flex" flexDirection="column" textAlign="justify">
            <Skeleton
              variant="text"
              width="70%"
              height={20}
              sx={{ mb: 1, ...(isDark ? darkSkeletonStyle : {}) }}
            />
            <Skeleton
              variant="text"
              width="70%"
              height={20}
              sx={{ mb: 1, ...(isDark ? darkSkeletonStyle : {}) }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const darkSkeletonStyle = {
  backgroundColor: '#2c2c2c',
  backgroundImage: `linear-gradient(90deg, #2c2c2c 0%, #3a3a3a 50%, #2c2c2c 100%)`,
};
