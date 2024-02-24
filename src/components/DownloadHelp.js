import React from 'react'
import {Typography} from '@mui/material'
export default function DownloadHelp() {
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
          Welcome to the mirInterBase download center!
          <br></br><br></br>
          Here, you will have the convenience of downloading our raw data in CSV format.
          You can click the "Select All" button to add all our datasets to your "shopping cart". Alternatively, you can expand the organisms you are interested in and choose the specific datasets you would like to download.
          <br></br><br></br> 
          Once you have selected all the datasets you would like to download, click on the shopping cart icon. This will display your selections and allow you to remove any unneeded datasets. You can also see the total size in megabytes (MB) of the data you are about to download. Please note that most browsers will prompt you for permission to download multiple items at once. You can approve this request to proceed with the download.
          <br></br><br></br>
          Enjoy your downloading experience!
          </p>        
          </Typography>
        </div>
      );
}
