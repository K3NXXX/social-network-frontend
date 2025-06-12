import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import type { UserPublicProfile } from '../../types/user';

interface IShareProfileMenuProps {
  publicUserData: UserPublicProfile;
  open: boolean;
  onClose: (isShareMenuOpened: boolean) => void;
}

export default function ShareProfileMenu({
  publicUserData,
  open,
  onClose,
}: IShareProfileMenuProps) {
  const profileUrl = `http://localhost:5173/user/profile/${publicUserData.id}`;

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      PaperProps={{
        sx: {
          backgroundColor: '#181424',
          borderRadius: 3,
          width: 450,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        },
      }}
    >
      <Typography
        sx={{
          color: '#fff',
          fontFamily: 'Ubuntu, sans-serif',
          fontSize: 20,
          fontWeight: 500,
          textAlign: 'center',
          marginBottom: 3,
          paddingTop: '20px',
        }}
      >
        Поділитися профілем
      </Typography>

      <Box
        display="flex"
        justifyContent="space-around"
        padding="0px 20px"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box textAlign="center">
          <FacebookShareButton url={profileUrl}>
            <IconButton disableRipple sx={{ outline: 'none', '&:focus': { outline: 'none' } }}>
              <FacebookIcon size={48} round />
            </IconButton>
          </FacebookShareButton>
          <Typography
            color="#fff"
            fontFamily="Ubuntu, sans-serif"
            fontWeight="500"
            fontSize={16}
            mt={1}
          >
            Facebook
          </Typography>
        </Box>

        <Box textAlign="center">
          <TelegramShareButton url={profileUrl}>
            <IconButton disableRipple sx={{ outline: 'none', '&:focus': { outline: 'none' } }}>
              <TelegramIcon size={48} round />
            </IconButton>
          </TelegramShareButton>
          <Typography
            color="#fff"
            fontFamily="Ubuntu, sans-serif"
            fontWeight="500"
            fontSize={16}
            mt={1}
          >
            Telegram
          </Typography>
        </Box>

        <Box textAlign="center">
          <WhatsappShareButton url={profileUrl}>
            <IconButton disableRipple sx={{ outline: 'none', '&:focus': { outline: 'none' } }}>
              <WhatsappIcon size={48} round />
            </IconButton>
          </WhatsappShareButton>
          <Typography
            color="#fff"
            fontFamily="Ubuntu, sans-serif"
            fontWeight="500"
            fontSize={16}
            mt={1}
          >
            WhatsApp
          </Typography>
        </Box>

        <Box textAlign="center">
          <TwitterShareButton url={profileUrl}>
            <IconButton disableRipple sx={{ outline: 'none', '&:focus': { outline: 'none' } }}>
              <TwitterIcon size={48} round />
            </IconButton>
          </TwitterShareButton>
          <Typography
            color="#fff"
            fontFamily="Ubuntu, sans-serif"
            fontWeight="500"
            fontSize={16}
            mt={1}
          >
            Twitter
          </Typography>
        </Box>
      </Box>
      <Button
        onClick={() => onClose(false)}
        sx={{
          marginTop: ' 20px',
          padding: '15px 0',
          width: '100%',
          borderBottom: '1px solid #2c2a4a',
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: 16,
            fontWeight: 500,
            userSelect: 'none',
            textAlign: 'center',
          }}
        >
          Скасувати
        </Typography>
      </Button>
    </Dialog>
  );
}
