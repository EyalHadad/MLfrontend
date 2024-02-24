import React from 'react'
import {Typography} from '@mui/material'

export default function PredictHelp() {
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
          Welcome to the future! In the age of AI, we didn't want to stay behind. Here is the interaction prediction page.
          <br></br><br></br>
          To get a prediction for a possible interaction, you need to enter the microRNA sequence, the messenger RNA sequence, and the target organism. Inserting the site is optional but not mandatory.
          <br></br><br></br> 
          mirInterBase will generate a prediction of the probability of interaction between the microRNA and messenger RNA you entered. The prediction will be displayed for your convenience.
          The latest predictions will also be saved for a short period of time.
          <br></br><br></br>
          Enjoy your predicting experience!
          </p>        
          </Typography>
        </div>
      );
}
