import React from 'react'
import {Typography} from '@mui/material'
export default function StatisticsHelp() {
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
          Welcome to the mirInterBase statistics page!
          <br></br><br></br>
          This page is divided into two sections: <br></br>
          In the first section, you can choose a dataset (selecting an organism for filtering is optional). Clicking "Browse" will display the 5 core statistics of the selected dataset, along with pie and bar charts illustrating their distribution.
          <br></br><br></br>
          You can click on any value in the distribution to exclude it, which is extremely helpful when dealing with a large amount of a specific value, for example. Additionally, you have the option to expand these charts for a larger view.
          <br></br><br></br> 
          The second section is dedicated to generating your personalized charts. Here, you can select the type of chart you are interested in, which is divided into two categories: single feature and combination of two features. Once you make a selection, you can apply filters based on your specific interests, similar to the search page. Then, you can choose one or two features depending on the chart type, and simply click the "Generate" button to generate the chart.
          <br></br><br></br>
          Enjoy your statistics experience!
          </p>        
          </Typography>
        </div>
      );
}
