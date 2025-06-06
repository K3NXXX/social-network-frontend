import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Dialog, InputAdornment, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { NoOutlineButton } from '../../ui/NoOutlineButton';
import { customScrollBar } from '../../ui/customScrollBar';

interface IShowFollowersFormProps {
  isOpened: boolean;
  onClose: (isShowFollowersFormOpened: boolean) => void;
  userId: string;
}

export default function ShowFollowersForm({ isOpened, onClose, userId }: IShowFollowersFormProps) {
  const [searchValue, setSearchValue] = useState('');
  const [userFollowers, setUserFollowers] = useState([]);
  console.log('userFo', userFollowers);

  const array = [
    {
      id: '1',
      firstName: 'Danylo',
      lastName: 'Vovk',
      username: 'coolmega',
    },

    {
      id: '3',
      firstName: 'Volodya',
      lastName: 'Andrushevkyi',
      username: 'dudka',
    },
    {
      id: '1',
      firstName: 'Danylo',
      lastName: 'Vovk',
      username: 'coolmega',
    },

    {
      id: '3',
      firstName: 'Volodya',
      lastName: 'Andrushevkyi',
      username: 'dudka',
    },
    {
      id: '1',
      firstName: 'Danylo',
      lastName: 'Vovk',
      username: 'coolmega',
    },

    {
      id: '3',
      firstName: 'Volodya',
      lastName: 'Andrushevkyi',
      username: 'dudka',
    },
    {
      id: '1',
      firstName: 'Danylo',
      lastName: 'Vovk',
      username: 'coolmega',
    },

    {
      id: '3',
      firstName: 'Volodya',
      lastName: 'Andrushevkyi',
      username: 'dudka',
    },
  ];

  useEffect(() => {
    const getUserFollowers = async () => {
      try {
        const { data } = await userService.getUsersFollowing(userId);
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
            borderRadius: 3,
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
      <Box>
        <Box sx={{ padding: '0 15px 20px' }}>
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
        <Box
          sx={{
            height: '400px',
            overflow: 'hidden',
            borderRadius: '10px',
            padding: '0 10px 0px 15px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px 0',
              paddingBottom: '20px',
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '15px',
              ...customScrollBar,
            }}
          >
            {array.map((item) => (
              <Box
                display="flex"
                gap="0 20px"
                alignItems="center"
                justifyContent="space-between"
                key={item.id}
              >
                <Box display="flex" gap="0 20px" alignItems="center">
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      background: '#727272',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                  ></Box>
                  <Box display="flex" flexDirection="column" gap="2px 0">
                    <Typography
                      sx={{ fontWeight: 500, color: 'white', fontSize: '15px', cursor: 'pointer' }}
                    >
                      {item.username}
                    </Typography>
                    <Typography sx={{ fontWeight: 500, color: '#727272', fontSize: '15px' }}>
                      {item.firstName + ' ' + item.lastName}
                    </Typography>
                  </Box>
                </Box>
                <NoOutlineButton variant="contained" size="small">
                  Стежити
                </NoOutlineButton>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
