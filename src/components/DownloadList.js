import * as React from 'react';
import List from '@mui/material/List';
import DownloadItem from '../components/DownloadItem';
import { Typography, Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@emotion/react';

function DownloadList(props) {
    const listName = props.listName;
    const listItems = props.listItems;
    const theme = useTheme();
    const onCheck = props.onCheck;        
    const onUncheck = props.onUncheck;
    const downloadSet = props.downloadSet;
    
    return (
      <Box
        sx={{
          margin: 'auto',
          maxWidth: { xs: '100wh', md: '80vw' },
          marginTop: '2vh',
        }}
      >
        <Accordion sx={{ backgroundColor: theme.palette.background.default }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            sx={{
              backgroundColor: theme.palette.primary.light,
              borderRadius: '0.4rem',
              color: theme.palette.secondary.dark,
              '.MuiAccordionSummary-expandIconWrapper': {
                color: theme.palette.secondary.light,
              },
              '.Mui-expanded': { color: theme.palette.secondary.dark },
            }}
          >
            <Typography
              color={'secondary'}
              sx={{
                fontWeight: 600,
                fontSize: { xs: 'medium', md: 'x-large' },
              }}
            >
              {listName}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List sx={{ width: '100%', maxWidth: 360, margin: 'auto' }}>
              {listItems.map((li) => (
                <DownloadItem
                  key={li.name}
                  name={li.name}
                  onClick={li.onClick}
                  weightInMb={li.weightInMb}
                  onCheck={() => onCheck(li.id)}
                  onUncheck={() => onUncheck(li.id)}
                  checked={
                    [...downloadSet].filter((id) => id === li.id).length !== 0
                  }
                ></DownloadItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
}
export default DownloadList;