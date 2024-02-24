import React from 'react'
import {Typography} from '@mui/material'

export default function BrowseHelp() {
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
      Welcome to the interaction browser in mirInterBase! Start exploring our data and getting familiar with it at a high level.
      <br></br><br></br>
      To begin, choose an organism to filter the datasets or select a dataset directly. Once chosen, the dataset will be displayed in a table. 
      <br></br><br></br> 
      Expand the table for a more comfortable view, filter the columns of interest, download the entire dataset, or click on a specific interaction to view its full details.
      <br></br><br></br>
      Enjoy your browsing experience!
      </p>        
      </Typography>
    </div>
  );
}
