import { Box, Button, Dialog, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../../services/userService';
import type { UserPublicProfile } from '../../types/user';
import SharingMenu from './SharingMenu';

interface IPublicUserOptionsMenuProps {
  isOpened: boolean;
  onClose: (isPublicUserMenuOpened: boolean) => void;
  publicUserData: UserPublicProfile;
  setPublicUserData?: React.Dispatch<React.SetStateAction<UserPublicProfile>>;
  onBlocked?: () => void;
  toggleFollowUser: (id: string) => void;
  isFollowing: boolean;
  isBlocked: boolean;
  handleUnblock: () => void;
}

export default function PublicUserOptionsMenu({
  isOpened,
  onClose,
  publicUserData,
  setPublicUserData,
  onBlocked,
  toggleFollowUser,
  isFollowing,
  isBlocked,
  handleUnblock,
}: IPublicUserOptionsMenuProps) {
  const { t } = useTranslation();
  const [isConfirmBlockingUser, setIsConfirmBlockingUser] = useState(false);
  const [isShareMenuOpened, setIsShareMenuOpened] = useState(false);

  const handleBlockUser = async (userId: string) => {
    await userService.blockUser(userId);
    if (isFollowing) toggleFollowUser(userId);
    setPublicUserData?.((prev) => (prev ? { ...prev, isBlocked: true } : prev));
    onBlocked?.();
    onClose(false);
  };

  const handleUnblockUser = () => {
    handleUnblock();
    onClose(false);
  };
  return (
    <>
      {!isConfirmBlockingUser && (
        <Dialog
          open={isOpened}
          onClose={() => onClose(false)}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: '#181424',
                borderRadius: 3,
                width: 400,
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
              },
            },
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            {isBlocked ? (
              <Button
                onClick={handleUnblockUser}
                sx={{
                  padding: '15px 0',
                  width: '100%',
                  borderBottom: '1px solid #2c2a4a',
                  outline: 'none',
                }}
              >
                <Typography
                  sx={{
                    color: '#fc4f4f',
                    fontFamily: 'Ubuntu, sans-serif',
                    fontSize: 16,
                    fontWeight: 500,
                    userSelect: 'none',
                    textAlign: 'center',
                  }}
                >
                  {t('profile.unblockUser')}
                </Typography>
              </Button>
            ) : (
              <Button
                onClick={() => setIsConfirmBlockingUser(true)}
                sx={{
                  padding: '15px 0',
                  width: '100%',
                  borderBottom: '1px solid #2c2a4a',
                  outline: 'none',
                }}
              >
                <Typography
                  sx={{
                    color: '#fc4f4f',
                    fontFamily: 'Ubuntu, sans-serif',
                    fontSize: 18,
                    fontWeight: 500,
                    userSelect: 'none',
                    textAlign: 'center',
                    textTransform: 'none',
                  }}
                >
                  {t('profile.block')}
                </Typography>
              </Button>
            )}

            <Button
              onClick={() => setIsShareMenuOpened(true)}
              sx={{
                padding: '15px 0',
                width: '100%',
                borderBottom: '1px solid #2c2a4a',
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: 18,
                  fontWeight: 500,
                  userSelect: 'none',
                  textAlign: 'center',
                  textTransform: 'none',
                }}
              >
                {t('profile.share')}
              </Typography>
            </Button>
          </Box>
        </Dialog>
      )}

      {isConfirmBlockingUser && (
        <Dialog
          slotProps={{
            paper: {
              sx: {
                backgroundColor: '#181424',
                borderRadius: 3,
                width: 560,
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
              },
            },
          }}
          open={isConfirmBlockingUser}
          onClose={() => setIsConfirmBlockingUser(false)}
        >
          <Box display="flex" flexDirection="column">
            <Box padding="0 40px" marginBottom="30px" marginTop="30px">
              <Typography
                sx={{
                  color: 'white',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: 20,
                  fontWeight: 500,
                  userSelect: 'none',
                  textAlign: 'center',
                  marginBottom: '10px',
                }}
              >
                {t('profile.block')}
                {publicUserData.firstName + ' ' + publicUserData.lastName}?
              </Typography>
              <Typography
                sx={{
                  color: '#adadad',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: 14,
                  fontWeight: 400,
                  userSelect: 'none',
                  textAlign: 'center',
                }}
              >
                {t('profile.blockMessage')}
              </Typography>
            </Box>
            <Button
              onClick={() => handleBlockUser(publicUserData.id)}
              sx={{
                padding: '15px 0',
                width: '100%',
                borderBottom: '1px solid #2c2a4a',
                borderTop: '1px solid #2c2a4a',
                outline: 'none',
              }}
            >
              <Typography
                sx={{
                  color: '#fc4f4f',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: 16,
                  fontWeight: 500,
                  userSelect: 'none',
                  textAlign: 'center',
                }}
              >
                {t('profile.block')}
              </Typography>
            </Button>
            <Button
              onClick={() => setIsConfirmBlockingUser(false)}
              sx={{
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
                {t('profile.cancel')}
              </Typography>
            </Button>
          </Box>
        </Dialog>
      )}

      {isShareMenuOpened && (
        <SharingMenu open={isShareMenuOpened} onClose={() => setIsShareMenuOpened(false)} />
      )}
    </>
  );
}
