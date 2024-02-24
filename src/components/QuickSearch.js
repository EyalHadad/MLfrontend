import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
import { Button, Typography } from '@mui/material';
import {TextField} from '@mui/material';
import { useTheme } from "@emotion/react";
import ApiRequests from '../api/ApiRequests'
import { CircularProgress } from '@mui/material';
import CommonStrings from '../classes/CommonStrings';

export default function QuickSearch(props) {
    const afterResultsAreInStorage = props.afterResultsAreInStorage;
    const searchSourceString = CommonStrings.localStorageStrings.searchLocalStorageStrings.quickSearchType;
    const lastSearchString = CommonStrings.localStorageStrings.searchLocalStorageStrings.lastQuickSearch;
    let [waiting, setWaiting] = useState(false);

    let activateFunction = 
        async (searchValue) => {
            if(!searchValue) return;
            localStorage.setItem(lastSearchString, searchValue);
            setWaiting(true);
            let resultFromApi = await ApiRequests.quickSearchInteractions(searchValue);
            setWaiting(false);
            localStorage.setItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.results, JSON.stringify(resultFromApi));            
            localStorage.setItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.lastSearchSource, searchSourceString);
            // TODO: if in home only navigate, if in search only reload
            afterResultsAreInStorage(resultFromApi);            
        };
    let textAboveSearchbar = 'Start searching now!';
    
    let Example = (props) => <Button onClick={() => setInputValue(props.example)}>{props.example},</Button>
    let examples = ['ENSBTAG00000000213', 'GAGGUA', 'bta-miR-147', '5utr'];

    let belowSearch = (
      <Box>
        Examples:
        {examples.map((e) => (
          <Example key={e} example={e} />
        ))}
        ...
      </Box>
    );

    let lastSearch = localStorage.getItem(lastSearchString);
    let [inputValue, setInputValue] = useState(lastSearch ? lastSearch : '');
    let theme = useTheme();
    return (
      <Box>
        <TextField
          sx={{
            width: '30vh',
            input: { color: theme.palette.primary.light },
          }}
          focused
          variant='outlined'
          id='input-with-icon-textfield'
          label={textAboveSearchbar}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {!waiting ? (
                  <Search
                    color='primary'
                    onClick={() => activateFunction(inputValue)}
                    sx={{
                      cursor:
                        inputValue && inputValue !== '' ? 'pointer' : 'auto',
                    }}
                  />
                ) : (
                  <CircularProgress></CircularProgress>
                )}

                <Close
                  color='primary'
                  onClick={() => setInputValue('')}
                  sx={{
                    cursor:
                      inputValue && inputValue !== '' ? 'pointer' : 'auto',
                  }}
                />
              </InputAdornment>
            ),
          }}
          value={inputValue}
          onChange={(object) => setInputValue(object.target.value)}
        />
        <Typography
          color={'primary'}
          component={'span'}
          sx={{
            fontWeight: 600,
            fontSize: 'medium',
          }}
        >
          {belowSearch}
        </Typography>
      </Box>
    );
}