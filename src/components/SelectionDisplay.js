import { Box, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useTheme } from '@emotion/react';
import { ExpandMore } from '@mui/icons-material';

export default function SelectionDisplay({ data }) {
    const theme = useTheme();
    return (
      <Box>
      <Typography color={'primary.main'} sx={{fontStyle:'italic'}}>              
          <b>Current Selection</b>:
      </Typography>
      <Box
      sx={{ 
        justifyContent:'center', display: 'flex', marginBottom: '2vh',
      }}
      >
      <Box>
        {Object.entries(data).map(([key, value], index) => value.length > 0 ? (
          <Box>
          <Accordion defaultExpanded sx={{backgroundColor: theme.palette.secondary.main,margin: '1vh', }} key={key}>
            <AccordionSummary sx={{borderRadius: '0.4rem', color: theme.palette.primary.light, backgroundColor: theme.palette.primary.grey,
            ".MuiAccordionSummary-expandIconWrapper": { color: theme.palette.primary.main},
            ".Mui-expanded": {color: theme.palette.primary.light }}}
            expandIcon={<ExpandMore></ExpandMore>}
            >
              <Typography>
                {key}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{backgroundColor: '#ede4ed'}}>
              {value.map(v => (
                <Typography sx={{color: theme.palette.primary.light}}>
                {v}
                </Typography>))}              
            </AccordionDetails>
          </Accordion>          
          </Box>
        ) : null)}
      </Box>
      </Box>
      </Box>
    );
  }
