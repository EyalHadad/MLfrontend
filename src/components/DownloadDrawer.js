import * as React from 'react';
import Box from '@mui/material/Box';
import { Button, IconButton, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import { SwipeableDrawer } from '@mui/material';

export default function DownloadDrawer(props) {
    const setDrawerOpen = props.setDrawerOpen;
    const drawerOpen = props.drawerOpen;
    const downloadSet = props.downloadSet;
    const setDownloadSet = props.setDownloadSet;
    const organisms = props.organisms;
    const downloadAll = props.downloadAll;
    
    return (

    <SwipeableDrawer
    PaperProps={{sx:{maxWidth: '80vw'}}}
    anchor='right'
    open={drawerOpen}
    onClose={() => setDrawerOpen(false)}
    onOpen={() => setDrawerOpen(true)}
    disableSwipeToOpen={false}
    ModalProps={{
        keepMounted: true,
    }}        
    >
    <Typography
    color={'primary'}
            sx={{
                fontWeight: 300,      
                marginRight: '1vh',
                fontSize: 'small',         
                display: 'flex' 
            }}>
    Please allow your browser to download several files at once
    </Typography>
    <Button
        variant='outlined'
        size='large'
        endIcon={<DownloadIcon></DownloadIcon>}
        disabled={downloadSet.size === 0}
        onClick={() => downloadAll()}
    >
        {'Download selected items'}
    </Button>
    <Button
        variant='outlined'
        size='large'
        endIcon={<ClearIcon></ClearIcon>}
        disabled={downloadSet.size === 0}
        onClick={() => setDownloadSet(new Set())}
    >
        {'Clear selected items'}
    </Button>
    {
        [...downloadSet].map(datasetId => 
        <Box key={datasetId}>
            <Typography
            color={'primary'}
            sx={{
                fontWeight: 700,      
                marginRight: '1vh',          
            }}
            >
            <IconButton onClick={() => setDownloadSet(
                (downloadSet) =>
                new Set(
                    [...downloadSet].filter((id) => id !== datasetId)
                )
            )}>
                <ClearIcon color='primary'></ClearIcon>
            </IconButton>
            {organisms.map(o => o.datasets).flat()
                ?.filter(ds => ds.id === datasetId)[0]?.name} [
            {organisms.map(o => o.datasets).flat()
                ?.filter(ds => ds.id === datasetId)[0]?.datasetMB} MB]
            </Typography>                          
        </Box>)            
    }
        <Typography
        color={'primary'}
        sx={{
            fontWeight: 500,      
            margin: 'auto'          
        }}
        >Total to download: 
        {' ' + organisms?.map(o => o.datasets).flat()
        ?.filter(ds => downloadSet.has(ds.id)).reduce((a,b) => a + b.datasetMB, 0) + ' '}
        MB
        </Typography>
    </SwipeableDrawer>
    )
}
