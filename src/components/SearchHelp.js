import React from 'react'
import {Typography} from '@mui/material'

export default function SearchHelp() {
    return (
        <div>      
          <Typography
            color={'primary'}
            sx={{
              fontSize: {
                xs: 'x-small',
                md: 'medium',
                lg: '120%',
              },
              padding: '3vh'
            }}
          >
          <p>
          Welcome to the mirInterBase search page! Here, you can find specific interactions using a flexible search.
          <br></br><br></br>
          To begin, you can optionally select a specific organism and at least one mandatory dataset. The chosen dataset(s) will filter the search inputs accordingly.
          You can also use dynamic features to further refine your search by clicking the 'edit filters' button.
          Finally, click the search button to retrieve the specific results you are looking for, presented in a table.        
          <br></br><br></br> 
          Expand the table for a more comfortable view, filter the columns of interest, download the entire dataset, or click on a specific interaction to view its full details.
          <br></br><br></br>
          Enjoy your searching experience!
          </p>        
          </Typography>
        </div>
      );
}
