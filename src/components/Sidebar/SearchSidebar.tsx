import { Close } from '@mui/icons-material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../../services/userService';
import type { SearchUsers } from '../../types/user';
import SearchItem from '../../ui/SearchItem';

interface SearchSidebarProps {
  isCollapsed: boolean;
  setSearchSidebarCollapsed: (value: boolean) => void;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({
  isCollapsed,
  setSearchSidebarCollapsed,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUsers[] | []>([]);
  const { t } = useTranslation();

  const debounceSearch = useCallback(
    debounce(async (value: string) => {
      if (value.trim().length < 2) return setSearchResults([]);
      try {
        const data = await userService.searchUsers(value);
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debounceSearch(searchValue);
  }, [searchValue, debounceSearch]);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: isCollapsed ? '0px' : '350px',
        background: '#181424',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 500,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        borderLeft: isCollapsed ? '' : '2px solid #9885f4',
        '@media (max-width:1400px)': {
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1500,
          borderLeft: 'none',
          paddingTop: '30px',
        },
        '@media (max-width:370px)': {
          width: isCollapsed ? '0px' : '300px',
        },
      }}
    >
      <Box
        onClick={() => {
          setSearchSidebarCollapsed(true);
        }}
        sx={{
          cursor: 'pointer',
          p: 1.5,
          borderRadius: '16px',
          transition: 'background-color 0.3s ease',
          '&:hover': { backgroundColor: '#2a2340' },
          display: 'none',
          justifyContent: 'center',

          '@media (max-width:1400px)': {
            display: 'flex',
            position: 'absolute',
            top: '20px',
            right: '20px',
          },
        }}
      >
        <ArrowForwardIosIcon
          sx={{
            color: 'white',
            fontSize: 14,
            transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: { xs: 'flex', sm: 'none' },
          alignItems: 'center',
          gap: 1,
          px: 2,
          pt: 2,
          cursor: 'pointer',
        }}
        onClick={() => setSearchSidebarCollapsed(true)}
      ></Box>

      <Typography
        sx={{
          color: 'white',
          marginTop: '22px',
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '5px',
        }}
      >
        {t('sidebar.search')}
      </Typography>

      <TextField
        autoComplete="off"
        placeholder={t('searchPlaceholder')}
        variant="outlined"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#888', marginLeft: '10px' }} />
            </InputAdornment>
          ),
          endAdornment: searchValue.length > 0 && (
            <InputAdornment position="end">
              <Close
                onClick={() => setSearchValue('')}
                sx={{ color: '#888', mx: '10px', cursor: 'pointer' }}
              />
            </InputAdornment>
          ),
          sx: {
            border: '1px solid #9885f4',
            color: 'white',
            borderRadius: '20px',
            padding: 0,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#9885f4',
              borderWidth: '1px',
            },

            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#9885f4',
              borderWidth: '1px',
            },

            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#9885f4',
              borderWidth: '1px',
            },
            width: '300px',
            '@media (max-width:370px)': {
              width: isCollapsed ? '0px' : '250px',
            },
            '& input': {
              padding: '1.5px 0px',
            },
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            padding: 0,
            '& input': {
              paddingTop: 1.5,
              paddingBottom: 1.5,
            },
          },
          color: 'white',
        }}
      />
      {searchResults.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            top: '120px',
            bgcolor: '#181424',
            zIndex: 1000,
            maxHeight: '700px',
            overflowY: 'auto',
            '@media (max-width:1400px)': {
              top: '180px',
            },
          }}
        >
          <Typography sx={{ color: 'white', fontWeight: 'bold', marginBottom: '5px' }}>
            Search Results:
          </Typography>
          {searchResults.map((result) => (
            <SearchItem
              key={result.id}
              result={result}
              setSearchValue={setSearchValue}
              setSearchResults={setSearchResults}
              setSearchSidebarCollapsed={setSearchSidebarCollapsed}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchSidebar;
