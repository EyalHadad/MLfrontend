import BrowseFilter from '../components/BrowseFilter';
import StatisticsFilters from '../components/StatisticsFilters';
import { useState, useEffect, useRef, useContext } from 'react';
import ApiRequests from '../api/ApiRequests';
import CommonStrings from '../classes/CommonStrings';
import AlertContext from '../components/AlertContext';
import { Button, Box, Typography, Snackbar } from '@mui/material';
import { useTheme } from '@emotion/react';
import {useMediaQuery, useTheme as uTheme} from '@mui/material';
import { MainFeatureChart } from '../components/MainFeatureChart';
import { useLocalStorage } from '../components/useLocalStorage';
import { SwipeableDrawer} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubFeatureChart from '../components/SubFeatureChart';
import DNALoading from '../components/DnaLoading';
import DraggableFab from './../components/DraggableFab';
import StatisticsHelp from '../components/StatisticsHelp';
import MuiAlert from '@mui/material/Alert'

function Statistics() {  
  const alertContext = useRef(useContext(AlertContext));
  const isSmallScreen = useMediaQuery(uTheme().breakpoints.down('sm'));
  const anchorOriginForSnackbar = {
    vertical: isSmallScreen ? 'bottom' : 'top', // Set to 'bottom' on small screens, 'top' on larger screens
    horizontal: 'left',
  };
  const [showSnackbar, setShowSnackbar] = useState(true);
  const [organisms, setOrganisms] = useState(null);
  const [features, setFeatures] = useState(null);
  const [numericFeatures, setNumericFeatures] = useState(null); // a subset of all features
  // sub feature data
  const ChartState = {
    NOT_REQUESTED: 'not-requested',
    LOADING: 'loading',
    LOADED: 'loaded',
  };
  const [featureChartState, setFeatureChartState] = useState(
    ChartState.NOT_REQUESTED
  );
  const [subFeatureChartType, setSubFeatureChartType] = useState(null);
  const [subFeatureData, setSubFeatureData] = useState(null);
  const [subFeatureDimensions, setSubFeatureDimensions] = useState(0);
  const [currentSubFeatureSelection, setCurrentSubFeatureSelection] = useState(null);
  const theme = useTheme();
  const [chosenDatasetName, setChosenDatasetName] = useLocalStorage(
    CommonStrings.localStorageStrings.browseLocalStorageStrings
      .chosenDatasetName,
    null
  );
  const [mainStatistics, setMainStatistics] = useLocalStorage(
    CommonStrings.localStorageStrings.statisticsLocalStorage.mainStatistics,
    []
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const accordionTitle = 'Generate a feature chart';
  const accordionDesc = '';
  const [waitingForMain, setWaitingForMain] = useState(false);
  const onGenerate1D = async (filters, chosenFeatureX, chosenChartType) => {
    setAccordionExpanded(false);
    setFeatureChartState(ChartState.LOADING);
    
    setSubFeatureChartType(chosenChartType);
    setSubFeatureDimensions(1);    
    const apiResult = await ApiRequests.get1DStatistics(filters, chosenFeatureX);
    setSubFeatureData(
      apiResult
    );
    setFeatureChartState(ChartState.LOADED);
  };
  const onGenerate2D = async (
    filters,
    chosenFeatureX,
    chosenFeatureY,
    chosenChartType
  ) => {
    setAccordionExpanded(false);
    setFeatureChartState(ChartState.LOADING);
    
    setSubFeatureChartType(chosenChartType);
    setSubFeatureDimensions(2);
    setSubFeatureData(
      await ApiRequests.get2DStatistics(filters, chosenFeatureX, chosenFeatureY)
    );
    setFeatureChartState(ChartState.LOADED)
  };

  useEffect(() => {
    // will fire only the first time the browse is created
    async function fetchData() {
      const result = await ApiRequests.getDetails(true);
      if (
        !result ||
        !result.organisms ||
        !result.featuresData ||
        !result.featuresData.features
      ) {
        alertContext.current.set(
          'error',
          CommonStrings.apiStrings.userExceptions.generalErrorTitle,
          CommonStrings.apiStrings.userExceptions.generalErrorTitle,
          <Button
            onClick={() => {
              window.location.reload();
              alertContext.current.clear();
            }}
          >
            RELOAD
          </Button>,
          10000
        );
        return;
      }
      setOrganisms(result.organisms);
      setFeatures(result.featuresData.features);
      const numericArray = result.featuresData.featureTypes.filter(ft => ft.type === 'numeric');      
      const numericId = numericArray.length > 0 ? numericArray[0].id : null;      
      if(numericId !== null)
        setNumericFeatures(result.featuresData.features.filter(f => f.featureTypeId === numericId).map(f => f.name))
      else setNumericFeatures(result.featuresData.features.map(f => f.name));
    }
    fetchData();
  }, []);


  const generalChartsGenerate = async (datasetId) => {
    const datasetName = organisms
      .map((org) => org.datasets)
      .flat()
      .filter((ds) => ds.id === datasetId)[0].name;
    setChosenDatasetName(datasetName);
    setWaitingForMain(true);
    const result = await ApiRequests.getDatasetStatistics(datasetId);
    setWaitingForMain(false);
    setMainStatistics(result);
  };


  return (
    <div style={{ paddingTop: '12vh' }}>
      {/*title + settings*/}
      <DraggableFab dialogContent={<StatisticsHelp></StatisticsHelp>}></DraggableFab>
      <Box>
        <Typography
          color={'primary'}
          sx={{
            fontWeight: 700,
            fontSize: { xs: 'medium', md: 'x-large' },
          }}
        >
          {chosenDatasetName && chosenDatasetName !== '' ? <>Showing statistics for: {chosenDatasetName}</> : <>Choose dataset to start examining statistics</>}
        </Typography>
        <Box marginBottom={'3vh'}>
          <Button variant='contained' onClick={() => setDrawerOpen(true)}>
            Choose Dataset <SettingsIcon></SettingsIcon>
          </Button>
        </Box>

        {/*main - feature charts*/}
        <Box display='flex' justifyContent='center'>
        <Snackbar sx={{marginTop: '10vh'}} anchorOrigin={anchorOriginForSnackbar} 
            open={showSnackbar}            
            >
          
            <MuiAlert          
              elevation={6}
              variant="filled"
              color='info'  
              severity="info"
              action={<Button color='info' variant='contained' onClick={()=>setShowSnackbar(false)}>Ok</Button>}
            >
            Exclude chart elements by clicking them!
            </MuiAlert>

        </Snackbar>

          <Box
            display={'grid'}
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(5, 1fr)',
              xl: 'repeat(5, 1fr)',
            }}
          >
            { waitingForMain ? <DNALoading></DNALoading>
            :
              mainStatistics.map((stats) => {
              return (
                <Box
                  key={stats.featureName}
                  maxWidth={{ xs: '60vw', md: '17vw' }}
                  marginBottom={'5vh'}
                  marginRight={'3vh'}
                >
                  <MainFeatureChart stats={stats}></MainFeatureChart>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      {/*drawer for main features*/}
      <SwipeableDrawer
        anchor='bottom'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.secondary.light,
            borderRadius: 2,
          }}
        >
          <Box width={'40vw'} margin={'auto'}>
            <Typography
              color={'primary'}
              sx={{
                fontWeight: 700,
                fontSize: { xs: 'medium', md: 'large' },
                marginBottom: '2vh',
              }}
            >
              Choose a dataset and get it's statistics
            </Typography>
            <BrowseFilter
              organisms={organisms}
              onBrowse={(datasetName) => {
                setDrawerOpen(false);
                generalChartsGenerate(datasetName);
              }}
            />
          </Box>
        </Box>
      </SwipeableDrawer>

      {/*generate a chart*/}
      <Box
        marginTop={'5vh'}
        sx={{
          backgroundColor: theme.palette.secondary.light,
          borderRadius: 2,
          boxShadow: 4,
          margin: '3vh',
        }}
      >
        <Accordion
          sx={{ backgroundColor: theme.palette.background.default }}
          expanded={accordionExpanded}
          onChange={() => setAccordionExpanded(!accordionExpanded)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1bh-content'
            id='panel1bh-header'
            sx={{
              backgroundColor: theme.palette.primary.dark,
              borderRadius: '0.4rem',
              color: theme.palette.secondary.dark,
              '.MuiAccordionSummary-expandIconWrapper': {
                color: theme.palette.secondary.light,
              },
              '.Mui-expanded': { color: theme.palette.secondary.dark },
            }}
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              {accordionTitle}
            </Typography>
            <Typography color='secondary.dark' fontSize={'small'}>
              {accordionDesc}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ backgroundColor: theme.palette.secondary.light }}
          >
            {
              <StatisticsFilters
                organisms={organisms}
                features={features}
                numericFeatures={numericFeatures}
                onGenerate1D={onGenerate1D}
                onGenerate2D={onGenerate2D}
                setCurrentSubFeatureSelection={setCurrentSubFeatureSelection}
              ></StatisticsFilters>
            }
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box>
        {featureChartState ===
        ChartState.NOT_REQUESTED ? null : featureChartState ===
          ChartState.LOADING ? (
          <Box>
            <DNALoading></DNALoading>
          </Box>
        ) : featureChartState === ChartState.LOADED ? (
          <Box>          
          <Box maxWidth={{ xs: '75vw', md: '70vw' }} margin='auto' marginBottom={'5vh'}>          
            <SubFeatureChart
              dimensions={subFeatureDimensions}
              data={subFeatureData}
              chartType={subFeatureChartType}
              selection={currentSubFeatureSelection}
            ></SubFeatureChart>
          </Box>
          </Box>
        ) : null}
      </Box>
    </div>
  );
}
export default Statistics;
