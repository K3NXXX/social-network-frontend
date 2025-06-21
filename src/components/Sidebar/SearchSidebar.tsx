import { useCallback, useEffect, useState } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import SearchItem from '../../ui/SearchItem';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';
import { userService } from '../../services/userService';
import type { SearchUsers } from '../../types/user';

const SearchSidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
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
      }}
    >
      <Typography sx={{ color: 'white', marginTop: '22px', fontSize: '20px', fontWeight: 'bold' }}>
        Search
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
            border: '2px solid #9885f4',
            color: 'white',
            borderRadius: '20px',
            padding: 0,
            width: '300px',
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
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchSidebar;
