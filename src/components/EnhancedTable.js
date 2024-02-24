import {
  Box,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  IconButton,
  Tab
} from "@mui/material";
import { useState } from "react";
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { useTheme } from "@emotion/react";
import CloseIcon from '@mui/icons-material/Close';
import {TabList, TabContext, TabPanel} from '@mui/lab';
import InteractionTab from "./InteractionTab";
import apiRequests from "../api/ApiRequests";
import CommonStrings from "../classes/CommonStrings";

const maxStringSizeInTable = 30;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });  
  return stabilizedThis.map((el) => el[0]);
}


function EnhancedTableHead(props) {
  const headCells = props.headCells;
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const theme = useTheme();
  return (
    <TableHead >
      <TableRow >        
        {headCells.map((headCell) => (
          <TableCell sx={{backgroundColor:theme.palette.secondary.dark, borderColor:theme.palette.primary.dark, border: '1' }}
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}            
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography fontSize={'medium'} fontWeight={'800'}>
                {headCell.label}
              </Typography>              
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTable(props) {
  const rows = props.rows;
  const headCells = props.headCells;
  let maxHeight = props.maxHeight;
  const rowsToShow = props.rowsToShow;
  if (!maxHeight) maxHeight = '45vh';
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories'); // ? 
  const [page, setPage] = useState(0);
  const [openInteraction, setOpenInteraction] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(rowsToShow);
  const [selectedInteractionData, setSelectedInteractionData] = useState({});
  const [currentTab, setCurrentTab] = useState(CommonStrings.mappingStrings.interaction);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleCloseModal = () => {
    setSelectedInteractionData({})
    setOpenInteraction(false);
  }

  const handleClick = async (event, row) => {
    setOpenInteraction(true);
    const interactionResponse = await apiRequests.getInteractionFullData(
      row[CommonStrings.mappingStrings.interactionId]);
    setSelectedInteractionData(interactionResponse);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };  
  const theme = useTheme();
  const getTableCells = (row) => {
    return (
        Object.keys(row).map((key, index) => headCells.map(hc => hc.id).indexOf(key) > -1 ?
            <TableCell key={index} align="center" >
              <Tooltip title={row[key].toString().length > maxStringSizeInTable ? row[key].toString() : ''}>              
                <Typography noWrap >
                  {
                    row[key].toString().length > maxStringSizeInTable ?
                    row[key].toString().substring(0,maxStringSizeInTable/2 - 3) 
                    + '...' + 
                    row[key].toString().substring(row[key].toString().length - (maxStringSizeInTable/2 - 3),row[key].toString().length) :  
                    row[key].toString()
                  }
                </Typography>                
              </Tooltip>
            </TableCell> : ''
        )
    )
  }

  const switchTab = (event, chosenTabName) => {
    setCurrentTab(chosenTabName);
  };

  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer sx={{maxHeight: maxHeight , backgroundColor:theme.palette.secondary.light}}> {/*remove if dont want scrolling*/}
          <Table stickyHeader
            sx={{ maxWidth: '100%',  }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <EnhancedTableHead
              headCells={headCells}              
              order={order}
              orderBy={orderBy}              
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody sx={{maxWidth: '100%'}}>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {                                    
                    
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"                      
                      tabIndex={-1}
                      key={index}
                      sx = {{cursor: 'pointer'}}
                    >                      
                    {getTableCells(row)}
                        
                    </TableRow>
                  );
                })}              
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination sx={{backgroundColor:theme.palette.secondary.light,
          '	.MuiTablePagination-select': {
            
          },
          '.MuiTablePagination-displayedRows':{
            fontSize: 'large'
          }}}
          rowsPerPageOptions={[10, 15, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={''}
          
        />
      </Paper>
      <Modal open={openInteraction} onClose={()=>handleCloseModal()}>
        <Box sx={{position:'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height:'85%',
          backgroundColor: theme.palette.secondary.main,
          boxShadow: 24,
          display: 'flex',
          maxWidth: {xs: '100wh', md: '80vw'},
          marginTop: '2vh',
          boxSizing: "border-box",
          justifyContent: 'center',
          padding: 0,
          margin:0,
        }}>
          <TabContext value={currentTab}>
          <Box sx={{
              boxShadow: 10,
              overflow:'auto',
              padding: 0,
              boxSizing: "border-box",
              margin:0,
              height: "100%",
              width: "100%",
              '&::-webkit-scrollbar': {
                width: "0px",
              },
              '&::-webkit-scrollbar-track': {
                background: "transparent",
              },
              '&::-webkit-scrollbar-thumb': {
                background: "transparent",
              },
            }}>
              <TabList onChange={switchTab} textColor='primary'
                       sx={{backgroundColor:theme.palette.secondary.dark,
                         position:'sticky',
                         right: '0',
                         left: '0',
                         zIndex: 'sticky'}} >
                <IconButton
                    aria-label='close'
                    onClick={handleCloseModal}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.black,
                    }}>
                  <CloseIcon />
                </IconButton>
                <Tab label={CommonStrings.mappingStrings.interactionMap} value={CommonStrings.mappingStrings.interaction}/>
                <Tab label={CommonStrings.mappingStrings.miRnaMap} value={CommonStrings.mappingStrings.miRna}/>
                <Tab label={CommonStrings.mappingStrings.mRnaMap} value={CommonStrings.mappingStrings.mRna} />
              </TabList>
              <TabPanel value={CommonStrings.mappingStrings.interaction}>
                <InteractionTab tabName={CommonStrings.mappingStrings.interactionInnerData} selectedInteraction={selectedInteractionData}></InteractionTab>
              </TabPanel>
              <TabPanel value={CommonStrings.mappingStrings.miRna}>
                <InteractionTab tabName={CommonStrings.mappingStrings.miRnaData} selectedInteraction={selectedInteractionData}></InteractionTab>
              </TabPanel>
              <TabPanel value={CommonStrings.mappingStrings.mRna}>
                <InteractionTab tabName={CommonStrings.mappingStrings.mRnaData} selectedInteraction={selectedInteractionData}></InteractionTab>
              </TabPanel>
            </Box>
          </TabContext>

        </Box>
      </Modal>
      
    </Box>
  );
}

export default EnhancedTable;