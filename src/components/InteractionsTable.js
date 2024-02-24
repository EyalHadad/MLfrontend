import {
    Box,
    Button,
    Checkbox,
    Dialog,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Tooltip
} from "@mui/material";
import Typography from '@mui/material/Typography';
import {useState} from "react";
import EnhancedTable from "./EnhancedTable";
import {useTheme} from "@emotion/react";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import DownloadIcon from '@mui/icons-material/Download';
import CommonStrings from './../classes/CommonStrings';

function ColumnsReducer(props){
    const theme = useTheme();
    return (
        <FormControl variant="standard" size="small">
            <InputLabel sx={{color: theme.palette.primary.light}} id="column-select"><ViewColumnIcon></ViewColumnIcon></InputLabel>
            <Select  variant='outlined' sx={{maxHeight: props.maxHeight, color: theme.palette.primary.light, '.MuiSelect-icon':{color:theme.palette.primary.light},'.MuiSelect-outlined':{color:theme.palette.primary.light} }} autoWidth 
            labelId="column-select"
            id="demo-multiple-checkbox"
            multiple
            value={props.headCellsToShow.map(hc => hc.id)}
            onChange={(value) => {props.setHeadCellsToShow(props.headCells.filter(h => value.target.value.indexOf(h.id) > -1))}}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.length}            
            >
            
            {props.headCells.map((head) => (
                <MenuItem key={head.id} value={head.id}>
                <Checkbox checked={props.headCellsToShow.map(hc => hc.id).indexOf(head.id) > -1} />
                <ListItemText primary={head.id} />
                </MenuItem>
            ))}
            <Box display={'flex'} justifyContent={'center'}>
                <Button onClick={()=>props.setHeadCellsToShow(props.headCells)}>All</Button>
                <Button onClick={()=>props.setHeadCellsToShow([])}>Clear</Button>                
            </Box>
            </Select>
        </FormControl>  
    )
}

function TableContent(props){
    const [downloadEnabled, setDownloadEnabled] = useState(true);
    return (
        <Box>
            <Box display={'flex'} justifyContent={'flex-end'} >
                <ColumnsReducer maxHeight={'5vh'} headCells={props.headCells} headCellsToShow={props.headCellsToShow} 
                    setHeadCellsToShow={props.setHeadCellsToShow}
                ></ColumnsReducer>
                <Button sx={{maxHeight: '5vh'}} onClick={()=>props.setFullScreen(!props.fullScreen)} variant="outlined">
                    {props.fullScreen ? 
                    <CloseFullscreenIcon></CloseFullscreenIcon> :
                    <OpenInFullIcon></OpenInFullIcon>}
                </Button>
                <Button disabled={!downloadEnabled} sx={{maxHeight: '5vh'}} onClick={async ()=>
                    { 
                        setDownloadEnabled(false);
                        await props.download()
                        setDownloadEnabled(true);
                    }} variant="outlined">
                    <Tooltip title='will download the entire data'>
                        <DownloadIcon></DownloadIcon>
                    </Tooltip>                    
                </Button>
            </Box>
            <EnhancedTable rowsToShow={props.fullScreen ? 50 : 10} maxHeight={props.fullScreen ? '85vh' : props.maxHeight} headCells={props.headCellsToShow} rows={props.rows}></EnhancedTable> 
        </Box>
    );
}

function InteractionsTable(props){
    const rows = props.tableRecords; // max 750 records
    const maxHeight = props.maxHeight;
    const download = props.download;
    // generate the columns according to the first object
    const headCells = [];
    if(rows.length > 0){ 
        // use the first row to determine the table's properties       
        for(const property in rows[0]){            
            headCells.push({
                id: property,
                numeric: !isNaN(rows[0][property]),
                disablePadding: false,
                label: CommonStrings.mappingStrings[`${property}Map`],
            });
        }        
    }
    const [headCellsToShow, setHeadCellsToShow] = useState(()=>{
        const cellsToRemove = CommonStrings.headCellsToHide;
        return headCells.filter(entry => !cellsToRemove.includes(entry.id))
    })
    const [fullScreen, setFullScreen] = useState(false);

    return (
        <Box sx={{margin: 'auto', marginLeft:'4vh', marginRight:'4vh', boxShadow: 3}}>            
            { rows.length === 0 ? <Typography>No Data</Typography> :
                !fullScreen ?
                <TableContent headCells={headCells} headCellsToShow={headCellsToShow} setHeadCellsToShow={setHeadCellsToShow} 
                    fullScreen={fullScreen} setFullScreen={setFullScreen} rows={rows} maxHeight={maxHeight} download={download}/>  
                :
                fullScreen ?
                <Dialog open={fullScreen} fullScreen>                
                    <TableContent headCells={headCells} headCellsToShow={headCellsToShow} setHeadCellsToShow={setHeadCellsToShow} 
                    fullScreen={fullScreen} setFullScreen={setFullScreen} rows={rows} maxHeight={maxHeight} download={download}/>
                </Dialog> : null
            }   
        </Box>     

    )
}

export default InteractionsTable;
