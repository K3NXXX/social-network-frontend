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
  const { t } = useTranslation();

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        mt={2}
        mb="32px"
        bgcolor="action.hover"
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
          <Button component="label" variant="outlined" size="small" onClick={handlePhotoDelete}>
            {t('profile.deletePhoto')}
          </Button>
          <Button component="label" variant="contained" size="small">
            {t('profile.changePhoto')}
            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={3} mb="50px">
        <TextField
          label={t('profile.firstName')}
          value={profile.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          InputProps={{
            sx: {
              '& .MuiInputBase-input': {
                px: 2,
                py: '10px',
              },
              borderRadius: '10px',
            },
          }}
        />
        <TextField
          label={t('profile.lastName')}
          value={profile.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          InputProps={{
            sx: {
              '& .MuiInputBase-input': {
                px: 2,
                py: '10px',
              },
              borderRadius: '10px',
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
      >
        {t('profile.birthDate')}
      </Typography>
      <Box display="flex" flexDirection="column">
        <TextField
          type="date"
          InputLabelProps={{ shrink: true }}
          value={profile.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          InputProps={{
            sx: {
              '& .MuiInputBase-input': {
                px: 2,
                py: '10px',
                '&::-webkit-calendar-picker-indicator': {
                  filter: 'brightness(0)',
                  cursor: 'pointer',
                },
              },
              borderRadius: '10px',
            },
          }}
        />
        <Typography
          fontSize="15px"
          fontWeight="bold"
          color="black"
          textAlign="left"
          px="2px"
          py="16px"
          mt="32px"
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
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '10px',
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
          color="black"
          textAlign="left"
          px="2px"
          py="16px"
          mt="32px"
        >
          {t('profile.location')}
        </Typography>
        <TextField
          placeholder="м. Львів"
          value={profile.location}
          onChange={(e) => handleChange('location', e.target.value)}
          InputProps={{
            sx: {
              '& .MuiInputBase-input': {
                px: 2,
                py: '10px',
                '&::-webkit-calendar-picker-indicator': {
                  filter: 'brightness(0)',
                  cursor: 'pointer',
                },
              },
              borderRadius: '10px',
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
          },
        }}
      />

      <Box my={4} display="flex" justifyContent="end" alignItems="center">
        <Button variant="contained" onClick={handleSubmit}>
          {t('profile.saveChangesLabel')}
        </Button>
      </Box>
    </>
  );
};

export default ProfileSection;
