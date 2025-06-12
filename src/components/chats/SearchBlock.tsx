import type { UserPreview } from '../../types/chats';
import { Avatar, Box, Typography } from '@mui/material';

interface SearchBlockProps {
  data: UserPreview;
  onSelect: (user: UserPreview) => void;
}

const SearchBlock = ({ data, onSelect }: SearchBlockProps) => {
  return (
    <Box
      onClick={() => {
        onSelect(data);
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#181424',
        padding: '5px 10px',
        gap: 2,
        mb: 1,
        cursor: 'pointer',
        // width: '250px',
      }}
    >
      <Avatar
        src={data.avatarUrl ?? undefined}
        alt={`${data.firstName} ${data.lastName}`}
        sx={{
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          bgcolor: '#9885f4',
        }}
      >
        {data.avatarUrl
          ? null
          : `${data.firstName[0].toUpperCase()}${data.lastName[0].toUpperCase()}`}
      </Avatar>
      <Box display="flex" flexDirection="column">
        <Typography sx={{ color: 'white', fontWeight: 700 }}>
          {data.firstName + ' ' + data.lastName}
        </Typography>

        {data.username ? (
          <Typography sx={{ textAlign: 'left', color: '#aaaaaa', fontFamily: 'Ubuntu' }}>
            @{data.username}
          </Typography>
        ) : (
          ''
        )}
      </Box>
    </Box>
  );
};

export default SearchBlock;
