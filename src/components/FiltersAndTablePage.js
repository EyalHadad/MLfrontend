import { Box, Typography, Button, Dialog } from "@mui/material";
import { useTheme } from "@emotion/react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useContext, useEffect, useState, useRef, useCallback} from "react";
import InteractionRecord from './../api/objects/InteractionRecord';
import InteractionsTable from "../components/InteractionsTable";
import InteractionTableRecord from "../classes/InteractionTableRecords";
import AlertContext from "../components/AlertContext";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import SearchFilters from "./SearchFilters";
import BrowseFilter from "./BrowseFilter";
import Browse from "../pages/Browse";
import Search from "../pages/Search";
import ApiRequests from "../api/ApiRequests";
import Filters from "../classes/Filters";
import CommonStrings from "../classes/CommonStrings";
import DNALoading from "./DnaLoading";

function FiltersAndTablePage(props){

    const alertContext = useRef(useContext(AlertContext));
    const localStorageResults = (props.callingComponent === Search ? 
        CommonStrings.localStorageStrings.searchLocalStorageStrings.results : CommonStrings.localStorageStrings.browseLocalStorageStrings.results)
    const maxApiRecords = 750;
    const navigate = useNavigate();    
    const title = props.title;
    const belowTitle = props.belowTitle;
    const accordionDesc = props.accordionDesc;
    const actionApiFunction = props.actionApiFunction;
    const filtersApiFunction = useRef(props.filtersApiFunction);
    const upperImage = props.upperImage;
    const callingComponent = props.callingComponent;
    const [organisms, setOrganisms] = useState(null);
    const [features, setFeatures] = useState(null);
    const [accordionExpanded, setAccordionExpanded] = useState(true);    
    const [resultsLoaded, setResultsLoaded] = useState(false);  
    const [resultsLoading, setResultsLoading] = useState(false);  
    const [tableRecords, setTableRecords] = useState([]);
    const [fullScreenTable, setFullScreenTable] = useState(false);
    const downloadMessage = 'Download will start shortly, this might take a few seconds, please keep your browser open.';
    const theme = useTheme();    
    const download = useCallback(async () => {        
        if(callingComponent === Browse){
            let datasets = organisms.map(org => org.datasets).flat()
            let chosenDatasetName = localStorage.getItem('chosenDatasetNameBrowse');
            let datasetId = datasets.filter(ds => ds.name === chosenDatasetName.replace(/"/g, ''))[0].id;
            alertContext.current.clear();
            alertContext.current.set('info', downloadMessage, '', <div></div>, 10000);
            try {
                await ApiRequests.downloadByDataset(datasetId);
            }            
            catch{
                alertContext.current.set('error', 
                    CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
                    CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
                <Button onClick={()=>{window.location.reload(); alertContext.current.clear();}}>RELOAD</Button>, 
                10000);            
            }
        }
        if (callingComponent === Search) {
          //TODO: if last search was quick use the quick search download, else use the filters download
          const lastSearchSource = localStorage.getItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.lastSearchSource);
          if (lastSearchSource === CommonStrings.localStorageStrings.searchLocalStorageStrings.quickSearchType) {
            const lastQuickSearch = localStorage.getItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.lastQuickSearch);
            alertContext.current.clear();
            alertContext.current.set('info', downloadMessage, '', <div></div>, 10000);
            try{
                await ApiRequests.downloadByQuickSearch(lastQuickSearch);
            }
            catch{
                alertContext.current.set('error', 
                CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
                CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
                <Button onClick={()=>{window.location.reload(); alertContext.current.clear();}}>RELOAD</Button>, 
                10000);            
            }
          } else {
            const allDatasets = organisms.map((org) => org.datasets).flat();
            const chosenDatasetsNames = JSON.parse(localStorage.getItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenDatasetName));
            const chosenSeedFamilies = JSON.parse(localStorage.getItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenSeedFamilies));
            const chosenMiRnaIds = JSON.parse(localStorage.getItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenMiRnaIds));
            const chosenSites = JSON.parse(localStorage.getItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenSites));
            const chosenGeneIds = JSON.parse(localStorage.getItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenGeneIds));
            const chosenRegions = JSON.parse(localStorage.getItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.setChosenRegions));
            let chosenDatasetsIds = [];
            for (let ds of allDatasets) {
              if (chosenDatasetsNames.indexOf(ds.name) !== -1) {
                chosenDatasetsIds.push(ds.id);
              }
            }
            const filters = new Filters(
              chosenDatasetsIds,
              chosenSeedFamilies,
              chosenMiRnaIds,
              chosenSites,
              chosenGeneIds,
              chosenRegions
            );            
            alertContext.current.clear();
            alertContext.current.set('info', downloadMessage, '', <div></div>, 10000);
            try{
                await ApiRequests.downloadBySearchFilters(filters);
            }
            catch{
                alertContext.current.set('error', 
                CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
                CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
                <Button onClick={()=>{window.location.reload(); alertContext.current.clear();}}>RELOAD</Button>, 
                10000);            
            }
          }
        }
    }, [callingComponent, organisms]);

    const showMessageAndEnableDownload = useCallback(() => {
        alertContext.current.set('warning', 
        CommonStrings.apiStrings.userInfo.moreResultsTitle, 
        CommonStrings.apiStrings.userInfo.moreResultsDescription, 
        <Button onClick={()=>{download(); alertContext.current.clear();}}>DOWNLOAD</Button>, 10000);
    }, [download]);

    useEffect(()=>{
        // will fire only the first time the browse is created
        async function fetchData(){
            const result = await filtersApiFunction.current();
            if(!result){
                alertContext.current.set('error', 
                CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
                CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
                <Button onClick={()=>{window.location.reload(); alertContext.current.clear();}}>RELOAD</Button>, 
                10000);            
                return;             
            }
            setOrganisms(result.organisms);
            setFeatures(result.featuresData);
        }        
        fetchData();
    }, [])

    useEffect(() =>{        
        let savedResults;
        try{
            savedResults = JSON.parse(localStorage.getItem(localStorageResults));
        }        
        catch{}
        if(!organisms) return;
        if(savedResults){
            setResultsLoading(false);
            setAccordionExpanded(false);
            setResultsLoaded(true);
            const apirecords = [];
            savedResults.forEach(res => apirecords.push(new InteractionRecord(res)));
            const records = [];
            apirecords.forEach(res => records.push(new InteractionTableRecord(res, organisms)));
            setTableRecords(records);
            if(apirecords && apirecords.length === maxApiRecords){
                showMessageAndEnableDownload();
            }    
        }
    }, [organisms, localStorageResults, showMessageAndEnableDownload, navigate])

    const onAction = async (apiPayload) => {
        setAccordionExpanded(false);
        setResultsLoaded(false);
        setResultsLoading(true);        
        // send api request with filters and show response
        let resultFromApi = await actionApiFunction(apiPayload);
        localStorage.setItem(localStorageResults, JSON.stringify(resultFromApi));
        if(!resultFromApi){
            alertContext.current.set('error', 
            CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
            CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
            <Button onClick={()=>{window.location.reload(); alertContext.current.clear();}}>RELOAD</Button>, 
            10000);            
            resultFromApi = []; // make result just empty           
        }      
        if(resultFromApi && resultFromApi.length === maxApiRecords){
            showMessageAndEnableDownload();
        }      
        const apirecords = [];
        resultFromApi.forEach(res => apirecords.push(new InteractionRecord(res)));
        const records = [];
        apirecords.forEach(res => records.push(new InteractionTableRecord(res, organisms)));
        setTableRecords(records);        
        setResultsLoading(false);
        setResultsLoaded(true);        
    }

    return (
        <div style={{}}>
            <Box sx={{position:'relative' ,margin: 'auto', width: (!resultsLoaded && !resultsLoading) ? {xs: '60%', md: '30%'} : {xs: '20%', md: '10%'}}}>
                    <img src={upperImage} width={'70%'} height={'70%'} alt='' />
                </Box>  
            <Box>
                <Typography color={'primary'} 
                    sx={{                                    
                        fontWeight: 700,
                        fontSize: {xs: 'medium', md: 'x-large'},                  
                        }}>
                        {title} 
                </Typography>
                <Typography color={'primary'} 
                    sx={{                                    
                        fontSize: {xs: 'x-small', md: 'small'},                  
                        }}>
                        {belowTitle}    
                </Typography>
                <Box sx={{margin: 'auto', maxWidth: {xs: '100wh', md: '80vw'}, marginTop: '2vh'}}>                          
                    <Accordion sx={{backgroundColor: theme.palette.background.default,}} expanded={accordionExpanded} onChange={()=>setAccordionExpanded(!accordionExpanded)} >
                        <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"                        
                        sx={{backgroundColor:theme.palette.primary.dark, borderRadius: '0.4rem', color: theme.palette.secondary.dark, 
                            ".MuiAccordionSummary-expandIconWrapper": { color: theme.palette.secondary.light},
                            ".Mui-expanded": {color: theme.palette.secondary.dark}
                        }}
                        >
                        <Typography color='secondary.dark'>{accordionDesc}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{backgroundColor: theme.palette.secondary.light}}>                            
                            {
                                callingComponent === Search ?
                                <SearchFilters organisms={organisms} features={features} onSearch={onAction}></SearchFilters> :
                                callingComponent === Browse ?
                                <BrowseFilter organisms={organisms} onBrowse={onAction}/> : 
                                null
                            }                            
                        </AccordionDetails>
                    </Accordion>           
                </Box>
            {
                (resultsLoading && !resultsLoaded) ?
                <Box sx={{marginTop: '3vh'}}>
                    <DNALoading/>
                </Box>
                :
                null
            }
            {
                (resultsLoaded && !resultsLoading && !fullScreenTable) ? 
                <Box sx={{marginTop: '3vh'}}>                                        
                    <InteractionsTable download={download} tableRecords={tableRecords}></InteractionsTable>
                </Box>                
                :                
                (resultsLoaded && !resultsLoading && fullScreenTable) ?
                <Dialog open={fullScreenTable} fullScreen>
                        <Button size="small"
                            onClick={()=>setFullScreenTable(false)}
                            >
                            <CloseIcon />
                        </Button>
                        <InteractionsTable download={download} maxHeight={'80vh'} tableRecords={tableRecords}></InteractionsTable>    
                </Dialog> :
                null
            }
                
            </Box>
        </div>
    )
}

export default FiltersAndTablePage;