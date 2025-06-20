import {
  Avatar,
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NoOutlineButton } from '../../../ui/NoOutlineButton';

interface Profile {
  profile: any;
  name: string;
  handleChange: (field: string, value: string) => void;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoDelete: () => void;
  handleSubmit: () => void;
}

const GENDERS = [
  { value: 'MALE', label: 'Чоловік' },
  { value: 'FEMALE', label: 'Жінка' },
  { value: 'OTHER', label: 'Інше' },
];

const ProfileSection = ({
  profile,
  name,
  handleChange,
  handlePhotoUpload,
  handlePhotoDelete,
  handleSubmit,
}: Profile) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        mt={2}
        mb="32px"
        p="16px"
        borderRadius="16px"
      >
        <Box display="flex">
          <Avatar
            src={profile.avatarUrl}
            sx={{ width: 60, height: 60, border: '1px solid #999' }}
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="start"
            justifyContent="center"
            ml="16px"
          >
            <Typography fontSize="16px" fontWeight={700}>
              {name}
            </Typography>
            {profile.username && (
              <Typography fontSize="14px" fontWeight={400} color="#666">
                @{profile.username}
              </Typography>
            )}
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <NoOutlineButton
            component="label"
            variant="outlined"
            size="small"
            onClick={handlePhotoDelete}
            sx={{
              color: 'var(--primary-color)',
            }}
          >
            {t('profile.deletePhoto')}
          </NoOutlineButton>
          <NoOutlineButton
            component="label"
            variant="contained"
            size="small"
            sx={{ backgroundColor: 'var(--primary-color)' }}
          >
            {t('profile.changePhoto')}
            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
          </NoOutlineButton>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={3} mb="50px">
        <TextField
          label={t('profile.firstName')}
          value={profile.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          InputLabelProps={{
            sx: {
              color: 'var(--text-color)',
              '&.Mui-focused': {
                color: 'var(--primary-color)',
              },
              '&.MuiFormLabel-filled': {
                color: 'var(--primary-color)',
              },
            },
          }}
          InputProps={{
            sx: {
              borderRadius: '10px',
              '& input': {
                color: 'var(--text-color)',
                px: 2,
                py: '10px',
              },
              '& input::placeholder': {
                color: 'var(--text-color)',
                opacity: 0.7,
              },
              '& input:-webkit-autofill': {
                boxShadow: '0 0 0px 1000px var(--secondary-color) inset !important',
                WebkitTextFillColor: 'var(--text-color) !important',
                caretColor: 'var(--text-color) !important',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '1px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--border-color)',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '2px',
            },
            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--error-color)',
            },
          }}
        />
        <TextField
          label={t('profile.lastName')}
          value={profile.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          InputLabelProps={{
            sx: {
              color: 'var(--text-color)',
              '&.Mui-focused': {
                color: 'var(--primary-color)',
              },
              '&.MuiFormLabel-filled': {
                color: 'var(--primary-color)',
              },
            },
          }}
          InputProps={{
            sx: {
              borderRadius: '10px',
              '& input': {
                color: 'var(--text-color)',
                px: 2,
                py: '10px',
              },
              '& input::placeholder': {
                color: 'var(--text-color)',
                opacity: 0.7,
              },
              '& input:-webkit-autofill': {
                boxShadow: '0 0 0px 1000px var(--secondary-color) inset !important',
                WebkitTextFillColor: 'var(--text-color) !important',
                caretColor: 'var(--text-color) !important',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '1px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--border-color)',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '2px',
            },
            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--error-color)',
            },
          }}
        />
      </Box>

      <Typography
        fontSize="15px"
        fontWeight="bold"
        textAlign="left"
        px="2px"
        py="16px"
        sx={{ color: 'var(--text-color)' }}
      >
        {t('profile.birthDate')}
      </Typography>
      <Box display="flex" flexDirection="column">
        <TextField
          type="date"
          lang={i18n.language}
          InputLabelProps={{ shrink: true }}
          value={profile.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          InputProps={{
            sx: {
              '& .MuiInputBase-input': {
                px: 2,
                py: '10px',
                color: 'var(--text-color)',
              },
              '&::-webkit-calendar-picker-indicator': {
                filter: 'brightness(0)',
                cursor: 'pointer',
              },
              borderRadius: '10px',
            },
          }}
          sx={{
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color) !important',
              borderWidth: '1px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--border-color)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '2px',
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--error-color)',
            },
          }}
        />
        <Typography
          fontSize="15px"
          fontWeight="bold"
          textAlign="left"
          px="2px"
          py="16px"
          mt="32px"
          sx={{ color: 'var(--text-color)' }}
        >
          {t('profile.gender')}
        </Typography>
        <FormControl fullWidth>
          <Select
            labelId="gender-label"
            value={profile.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            fullWidth
            sx={{
              borderRadius: '10px',
              '& .MuiSelect-select': {
                px: 2,
                py: '10px',
                color: 'var(--text-color)',
              },
              '& .MuiSelect-icon': {
                color: 'var(--text-color)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary-color) !important',
                borderWidth: '1px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--border-color)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary-color)',
                borderWidth: '2px',
              },
              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--error-color)',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '10px',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  '& .MuiMenuItem-root': {
                    '&:hover': {
                      backgroundColor: 'var(--secondary-color)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'var(--primary-color)',
                      color: 'var(--text-color)',
                      '&:hover': {
                        backgroundColor: 'var(--primary-color)',
                      },
                    },
                  },
                },
              },
            }}
          >
            {GENDERS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {t(`profile.genders.${option.value.toLowerCase()}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography
          fontSize="15px"
          fontWeight="bold"
          textAlign="left"
          px="2px"
          py="16px"
          mt="32px"
          sx={{ color: 'var(--text-color)' }}
        >
          {t('profile.location')}
        </Typography>
        <TextField
          placeholder="м. Львів"
          value={profile.location}
          onChange={(e) => handleChange('location', e.target.value)}
          InputLabelProps={{
            sx: {
              color: 'var(--text-color)',
              '&.Mui-focused': {
                color: 'var(--primary-color)',
              },
              '&.MuiFormLabel-filled': {
                color: 'var(--primary-color)',
              },
            },
          }}
          InputProps={{
            sx: {
              borderRadius: '10px',
              '& input': {
                color: 'var(--text-color)',
                px: 2,
                py: '10px',
              },
              '& input::placeholder': {
                color: 'var(--text-color)',
                opacity: 0.7,
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '1px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--border-color)',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
              borderWidth: '2px',
            },
            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--error-color)',
            },
          }}
        />
      </Box>

      <Typography
        fontSize="15px"
        fontWeight="bold"
        color="black"
        textAlign="left"
        px="2px"
        py="16px"
        mt="32px"
        sx={{ color: 'var(--text-color)' }}
      >
        {t('profile.bio')}
      </Typography>
      <TextField
        placeholder="Біо"
        multiline
        rows={2}
        fullWidth
        value={profile.bio}
        onChange={(e) => handleChange('bio', e.target.value)}
        InputProps={{
          sx: {
            borderRadius: '10px',
            color: 'var(--text-color)',
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary-color)',
            borderWidth: '1px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-color)',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary-color)',
            borderWidth: '2px',
          },
          '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--error-color)',
          },
        }}
      />

      <Box my={4} display="flex" justifyContent="end" alignItems="center">
        <NoOutlineButton sx={{ background: '#6969BC' }} variant="contained" onClick={handleSubmit}>
          {t('profile.saveChangesLabel')}
        </NoOutlineButton>
      </Box>
    </>
  );
};

export default ProfileSection;
