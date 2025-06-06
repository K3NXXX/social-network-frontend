import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Dialog, InputAdornment, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { userService } from '../../services/userService';

interface IShowFollowersFormProps {
  isOpened: boolean;
  onClose: (isShowFollowersFormOpened: boolean) => void;
  userId: string;
}

export default function ShowFollowersForm({ isOpened, onClose, userId }: IShowFollowersFormProps) {
  const [searchValue, setSearchValue] = useState('');
  const [userFollowers, setUserFollowers] = useState([]);
  console.log('userFo', userFollowers);

  useEffect(() => {
    const getUserFollowers = async () => {
      try {
        const { data } = await userService.getUsersFollowers(userId);
        setUserFollowers(data);
      } catch (error) {
        console.log(error);
        setUserFollowers([]);
      }
    };
    getUserFollowers();
  }, []);

  return (
    <Dialog
      open={isOpened}
      onClose={() => onClose(false)}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#181424',
            borderRadius: 2,
            pt: 1.3,
            width: 400,
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          },
        },
      }}
    >
      <CloseIcon
        onClick={() => onClose(false)}
        sx={{
          color: 'white',
          position: 'absolute',
          top: 10,
          right: 12,
          cursor: 'pointer',
          fontSize: 26,
        }}
      />
      <Box
        display="flex"
        justifyContent="center"
        mb={1}
        paddingBottom="10px"
        borderBottom="1px solid #2c2a4a"
      >
        <Typography
          sx={{
            color: '#fff',
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: 16,
            fontWeight: 500,
            userSelect: 'none',
          }}
        >
          Читачі
        </Typography>
      </Box>
      <Box sx={{ padding: '0 15px 300px' }}>
        <Box>
          <TextField
            autoComplete="off"
            placeholder="Пошук..."
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <SearchIcon sx={{ color: '#888' }} />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <CancelIcon
                    onClick={() => setSearchValue('')}
                    sx={{
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '20px',
                      '&:hover': { color: '#fff' },
                    }}
                  />
                </InputAdornment>
              ),
              sx: {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                outline: 'none',
                boxShadow: 'none',

                '& input': {
                  padding: '8px 0',
                  color: '#fff',
                  paddingRight: '10px',
                },
                backgroundColor: '#2c2a4a',
                borderRadius: '10px ',
              },
            }}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
