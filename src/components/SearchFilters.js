import {Box, Button, Chip, IconButton, Modal, Tab, Tabs, Tooltip, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import DropDownOptions from "./DropDownOptions";
import Filters from './../classes/Filters';
import SearchOptions from "../api/objects/SearchOptions";
import {useLocalStorage} from "./useLocalStorage";
import QuickSearch from "./QuickSearch";
import CommonStrings from "../classes/CommonStrings";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from "@mui/icons-material/Close";
import {useTheme} from "@emotion/react";
import FeaturesDropDown from "./FeaturesDropDown";
import DNALoading from "./DnaLoading";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role='tabpanel'
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography component={'span'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
    }

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
    }

function SearchFilters (props){    
    // should get organisms from the backend and generate the relevant lists according
    const [value, setValue] = useState(localStorage.getItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.lastSearchSource) === CommonStrings.localStorageStrings.searchLocalStorageStrings.quickSearchType ? 1 : 0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const rearrangeFeaturesObject = (features) => {
        const newFeaturesObj = {}
        if(!features) return;
        if(!features.featureTypes || !features.features){ // null or undefined or whatever
            console.error('featureTypes or features is null');
            return;
        }
        const featuresDict = features.features.reduce((acc, {name, featureTypeId}) => ({
            ...acc,
            [name]: featureTypeId
        }), {});
        newFeaturesObj.featureTypes = features.featureTypes.reduce((acc, {id, type, filters}) => ({
            ...acc,
            [id]: {type, filters}
        }), {}) ;
        newFeaturesObj.features = featuresDict;
        return newFeaturesObj
    }

    // basic search variables
    const theme = useTheme();
    const organisms = props.organisms;
    const features = (() => rearrangeFeaturesObject(props.features))();
    const [chosenOrganisms, setChosenOrganisms] = useLocalStorage(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenOrganisms, [])
    const [chosenDatasetsNames, setChosenDatasetsNames] = useLocalStorage(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenDatasetName, [])
    const [chosenSeedFamilies, setChosenSeedFamilies] = useLocalStorage(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenSeedFamilies, [])
    const [chosenMiRnaIds, setChosenMiRnaIds] = useLocalStorage(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenMiRnaIds, [])
    const [chosenSites, setChosenSites] = useLocalStorage(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenSites, [])
    const [chosenGeneIds, setChosenGeneIds] = useLocalStorage(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenGeneIds, [])
    const [chosenRegions, setChosenRegions] = useLocalStorage(CommonStrings.localStorageStrings.searchLocalStorageStrings.setChosenRegions, [])
    const [chosenFeatures, setChosenFeatures] = useLocalStorage(CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenFeatures, {})
    const [relevantFeatures, setRelevantFeatures] = useLocalStorage(CommonStrings.localStorageStrings.searchLocalStorageStrings.relevantFeatures, {})

    useEffect(()=>{
        // update the lists when organism or dataset change
        if (!organisms || !features) return;
        // empty the searching so far?        
        setRelevantOrganisms(organisms.map(org => org.name));    
        // change the content of the relevant lists according to the user already existing selection - using setRelevant methods        
        let cOrganisms = organisms.filter(org => chosenOrganisms.indexOf(org.name) !== -1);            
        if(cOrganisms.length === 0) // if chosen organisms is empty, keep all datasets
            cOrganisms = organisms;
        const newRelevantDatasetsNames = cOrganisms.map(org => org.datasets).flat().map(ds => ds.name);
        setRelevantDatasetsNames(newRelevantDatasetsNames);
        if(chosenDatasetsNames.filter(cds => newRelevantDatasetsNames.indexOf(cds) === -1).length !== 0)
            //  if there is a chosen dataset that is not relevant
            setChosenDatasetsNames(chosenDatasetsNames => chosenDatasetsNames.filter(cds => newRelevantDatasetsNames.indexOf(cds) !== -1));
        // change the content of search options according to data set selection
        let allDatasets = organisms.map(org => org.datasets).flat();
        let relevantDatasets = allDatasets.filter(ds => chosenDatasetsNames.indexOf(ds.name) !== -1);        
        if (relevantDatasets.length === 0) relevantDatasets = allDatasets;        
        const newRelevantSearchOptions = new SearchOptions({
            geneIds: [...new Set(relevantDatasets.map(ds => ds.searchOptions.geneIds).flat())],
            miRnaIds: [...new Set(relevantDatasets.map(ds => ds.searchOptions.miRnaIds).flat())],
            regions: [...new Set(relevantDatasets.map(ds => ds.searchOptions.regions).flat())],
            seedFamilies: [...new Set(relevantDatasets.map(ds => ds.searchOptions.seedFamilies).flat())],
            siteTypes: [...new Set(relevantDatasets.map(ds => ds.searchOptions.siteTypes).flat())],
        });
        setRelevantGeneIds(newRelevantSearchOptions.geneIds);
        setChosenGeneIds(chosenGeneIds => chosenGeneIds.filter(gid => newRelevantSearchOptions.geneIds.indexOf(gid) !== -1));
        setRelevantMiRnaIds(newRelevantSearchOptions.miRnaIds);
        setChosenMiRnaIds(chosenMiRnaIds => chosenMiRnaIds.filter(miid => newRelevantSearchOptions.miRnaIds.indexOf(miid) !== -1));
        setRelevantRegions(newRelevantSearchOptions.regions);
        setChosenRegions(chosenRegions => chosenRegions.filter(cr => newRelevantSearchOptions.regions.indexOf(cr) !== -1));        
        setRelevantSeedFamilies(newRelevantSearchOptions.seedFamilies);
        setChosenSeedFamilies(chosenSeedFamilies => chosenSeedFamilies.filter(sf => newRelevantSearchOptions.seedFamilies.indexOf(sf) !== -1));
        setRelevantSites(newRelevantSearchOptions.siteTypes);
        setChosenSites(chosenSites => chosenSites.filter(cs => newRelevantSearchOptions.siteTypes.indexOf(cs) !== -1));
        const featuresNames = Object.keys(features.features);
        if(Object.keys(relevantFeatures).length === 0){
            const relevantFeaturesDict = featuresNames.map((option) => ({ label: option, disabled: false }));
            setRelevantFeatures(relevantFeaturesDict)
        }

        }, [organisms, features, relevantFeatures, chosenOrganisms, chosenDatasetsNames, setChosenOrganisms, setChosenSites,
        setChosenDatasetsNames, setChosenRegions, setChosenSeedFamilies, setChosenMiRnaIds, setChosenGeneIds, setRelevantFeatures])

    const [relevantOrganisms, setRelevantOrganisms] = useState([]);
    const [relevantDatasetsNames,setRelevantDatasetsNames] = useState([]);
    const [relevantSeedFamilies,setRelevantSeedFamilies] = useState([]);
    const [relevantMiRnaIds, setRelevantMiRnaIds] = useState([]);
    // const [relevantMiRnaSeqs, setRelevantMiRnaSeqs] = useState(['miseq1','miseq2','miseq3','miseq4','miseq5','miseq6','miseq7','miseq8','miseq9']);
    const [relevantSites, setRelevantSites] = useState([]);
    const [relevantGeneIds, setRelevantGeneIds] = useState([]);
    const [relevantRegions, setRelevantRegions] = useState([]);
    const searchSourceString = CommonStrings.localStorageStrings.searchLocalStorageStrings.advancedSearchType;    
    const choiceNotMadeAtAll = () =>{
        return (
            validChoiceNotMade() && chosenOrganisms.length === 0 
        );
    }
    const validChoiceNotMade = () => {
        return (
            chosenDatasetsNames.length === 0 &&
            chosenSeedFamilies.length === 0 &&
            chosenMiRnaIds.length === 0 &&
            // chosenMiRnaSeqs.length === 0 &&
            chosenSites.length === 0 &&
            chosenGeneIds.length === 0 &&
            chosenRegions.length === 0 &&
            Object.keys(chosenFeatures).length === 0)
    }
    const search = () => {
        // console log - to show that the "chosen" objects are getting updated
        localStorage.setItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.results, JSON.stringify([]));
        localStorage.setItem(CommonStrings.localStorageStrings.searchLocalStorageStrings.lastSearchSource, searchSourceString);
        setValue(0); // search type
        const allDatasets = organisms.map(org => org.datasets).flat();
        let chosenDatasetsIds = [];
        for (let ds of allDatasets){
            if(chosenDatasetsNames.indexOf(ds.name) !== -1){
                chosenDatasetsIds.push(ds.id);
            }
        }
        const chosenFeaturesToList = Object.values(chosenFeatures);
        // generate filters from object and send upwords to the Search component
        let filters = new Filters(
            chosenDatasetsIds, chosenSeedFamilies, chosenMiRnaIds, chosenSites, chosenGeneIds, chosenRegions, chosenFeaturesToList
        );
        props.onSearch(filters)
    }

    const resetChosenValues = () => {
        setChosenOrganisms([]);
        setChosenDatasetsNames([]);
        setChosenSeedFamilies([]);
        setChosenMiRnaIds([]);
        setChosenSites([]);
        setChosenGeneIds([]);
        setChosenRegions([]);
        setChosenFeatures({});
        clearAllChosenFeatures();
    }

    const [openModal, setOpenModal] = useState(false);
    const [featuresDropdownCount, setFeaturesDropdownCount] = useState(Object.keys(chosenFeatures).length);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const getHighestKey = () => {
        const keys = Object.keys(chosenFeatures)
        const keyNumbers = keys.map(number => parseInt(number));
        return Math.max(...keyNumbers)
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        if(Object.keys(chosenFeatures).length !== 0) {
            const maxKey = getHighestKey()
            setFeaturesDropdownCount(maxKey)
        }
    };

    const handleAddDropdown = () => {
        setFeaturesDropdownCount(featuresDropdownCount + 1);
    };

    const clearAllChosenFeatures = () => {
        Array.from({ length: featuresDropdownCount }, (_, index) => {
            let feature = `chosenFeature_${index+1}`
            let filter = `chosenFilter_${index+1}`
            let filterValue = `chosenFilterValue_${index+1}`
            localStorage.setItem(feature, null);
            localStorage.setItem(filter, null);
            localStorage.setItem(filterValue, null);
            return feature;
        })
        setChosenFeatures({})
        setFeaturesDropdownCount(0)
        const allRelevantFeatures = updateAllFeaturesAsRelevant();
        setRelevantFeatures(allRelevantFeatures)
    }

    const saveChosenFeature = (chosenValue, featureNumber) => {
        let updatedRelevanceDict;
        // [fName~filter~value]
        const chosenFeaturesCopy = {...chosenFeatures};
        if (chosenValue === null) { // if unchecked this feature
            let prevValue = chosenFeatures[featureNumber]
            let name = getFeatureName(prevValue)
            updatedRelevanceDict = updateChosenFeatureRelevance(name, false);
            delete chosenFeaturesCopy[featureNumber.toString()];
        }
        else{ // if chose this feature
            const name = chosenValue['featureName']
            const filter = chosenValue['filter']
            const value = chosenValue['value']
            chosenFeaturesCopy[featureNumber] = `${name}~${filter}~${value}`
            updatedRelevanceDict = updateChosenFeatureRelevance(name, true)
        }
        setChosenFeatures(chosenFeaturesCopy);
        setRelevantFeatures(updatedRelevanceDict)
    }

    const getFeatureName = (name) =>{
        // string template - name~filter~value
        const chosenFeatureString = name.split("~");
        return chosenFeatureString[0];
    }

    const handleChipDelete = (featureToDelete, index) => () => {
        const newChosensDict = {...chosenFeatures}
        const featureNameToDelete = getFeatureName(featureToDelete)
        const updatedRelevanceDict = updateChosenFeatureRelevance(featureNameToDelete, false)
        setRelevantFeatures(updatedRelevanceDict)
        delete newChosensDict[index.toString()];
        setChosenFeatures(newChosensDict);
        let lsName = `chosenFeature_${index}`
        localStorage.setItem(lsName, null);

    };

    const handleChipClick = () => {
        setOpenModal(true)
    }


    const updateChosenFeatureRelevance = (chosenFeature ,value) => {
        if(Object.keys(relevantFeatures).length === 0) return;
        return relevantFeatures.map((option) => {
            if (option.label === chosenFeature) {
                option.disabled = value;
            }
            return option;
        })

    }

    const updateAllFeaturesAsRelevant = () => {
        return relevantFeatures.map((option) => {
            option.disabled = false;
            return option
        });
    };


    useEffect(() =>{
        if(featuresDropdownCount === 0)
            setFeaturesDropdownCount(1)
    }, [featuresDropdownCount])


    return (
        <div>
            {organisms == null ? 
            <Box>
                <DNALoading></DNALoading>
            </Box> 
            
            :
            <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label={CommonStrings.mappingStrings.advancedSearchMap} {...a11yProps(0)} />
                    <Tab label={CommonStrings.mappingStrings.quickSearchMap} {...a11yProps(1)} />
                    </Tabs>
                </Box>

                <TabPanel value={value} index={0}>
                    <Box>
                        <Box sx={{maxWith: '100%'}} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)'}} gap={{xs: 0, md: 2}}>
                            <DropDownOptions inputLabel={CommonStrings.mappingStrings.organismsMap} 
                                options={relevantOrganisms} chosen={chosenOrganisms} setChosen={setChosenOrganisms}></DropDownOptions>
                            <DropDownOptions inputLabel={CommonStrings.mappingStrings.datasetsMap} 
                                options={relevantDatasetsNames} chosen={chosenDatasetsNames} setChosen={setChosenDatasetsNames}></DropDownOptions>                
                            <DropDownOptions inputLabel={CommonStrings.mappingStrings.seedFamiliesMap} 
                                options={relevantSeedFamilies} chosen={chosenSeedFamilies} setChosen={setChosenSeedFamilies}></DropDownOptions>
                            <DropDownOptions inputLabel={CommonStrings.mappingStrings.miRnaIdsMap} 
                                options={relevantMiRnaIds} chosen={chosenMiRnaIds} setChosen={setChosenMiRnaIds}></DropDownOptions>
                            <DropDownOptions inputLabel={CommonStrings.mappingStrings.siteTypesMap}
                                options={relevantSites} chosen={chosenSites} setChosen={setChosenSites}></DropDownOptions>
                            <DropDownOptions inputLabel={CommonStrings.mappingStrings.geneIdsMap} 
                                options={relevantGeneIds} chosen={chosenGeneIds} setChosen={setChosenGeneIds}></DropDownOptions>
                            <DropDownOptions inputLabel={CommonStrings.mappingStrings.regionsMap} 
                                options={relevantRegions} chosen={chosenRegions} setChosen={setChosenRegions}></DropDownOptions>
                            <Button sx={{width:'1fr', height:'54px' }} variant="contained" color="primary" onClick={handleOpenModal} startIcon={<AddIcon />}>
                                {Object.keys(chosenFeatures).length === 0 ?'Add Filters' : 'Edit Filters'}
                            </Button>
                            <Modal open={openModal} onClose={handleCloseModal}>
                                    <Box sx={{position:'relative',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        height:'85%',
                                        backgroundColor: theme.palette.secondary.light,
                                        boxShadow: 24,
                                        maxWidth: {xs: '100wh', md: '80vw'},
                                        marginTop: '2vh',
                                        boxSizing: "border-box",
                                        justifyContent: 'center',
                                        padding: 0,
                                    }}>
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
                                        <IconButton
                                            aria-label='close'
                                            onClick={handleCloseModal}
                                            sx={{
                                                position: 'absolute',
                                                right: 8,
                                                top: 8,
                                                color: (theme) => theme.palette.secondary.dark,
                                            }}>
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography  variant="body1" color={ theme.palette.secondary.light}  sx={{
                                            fontWeight: 600,
                                            fontSize: {xs: 'medium', md: 'x-large'},
                                            backgroundColor:theme.palette.primary.dark,
                                            color: theme.palette.secondary.dark,
                                            padding: '10px',
                                            lineHeight: '1.5'}}>
                                            Subfeatures Filtering
                                        </Typography>
                                        <Box sx={{
                                            display: 'grid',
                                            columnGap: 3,
                                            rowGap: 1,
                                            gridTemplateColumns: 'repeat(1, 1fr)',
                                        }}>
                                            <Typography  variant="body1" color={ theme.palette.primary.dark}  sx={{
                                                fontWeight: 500,
                                                fontSize: {xs: 'medium', md: 'x-large'},
                                                padding: '10px',
                                                lineHeight: '1.5'}}>
                                                Choose up to five features to filter by:
                                            </Typography>
                                            {Array.from({ length: featuresDropdownCount }).map((_, index) => (
                                                <Box key={index} sx={{backgroundColor: Object.keys(chosenFeatures).includes((index+1).toString()) ? theme.palette.primary.grey : 'transparent'}}>
                                                    <Typography variant="body1" color={ theme.palette.secondary.light}  sx={{
                                                        fontWeight: 700,
                                                        fontSize: {xs: 'small', md: 'large'},
                                                        color: theme.palette.primary.main,
                                                        padding: '10px',
                                                        lineHeight: '1'
                                                        }}>
                                                        Filter number {index + 1}
                                                    </Typography>
                                                    <FeaturesDropDown options={features} featureNumber={index + 1} saveChosenFeature={saveChosenFeature} chosenFeatures={chosenFeatures}></FeaturesDropDown>
                                                    <hr/>
                                                </Box>
                                            ))}
                                        </Box>
                                            <Typography  variant="body1" color={ theme.palette.primary.dark}  sx={{
                                                fontWeight: 500,
                                                fontSize: {xs: 'small', md: 'medium'},
                                                padding: '10px',
                                                lineHeight: '1.5'}}>
                                                Please save the filter you chose before adding a new one.
                                            </Typography>
                                        <Tooltip title="Add filter option">
                                            <span>
                                                 <IconButton sx={{ fontSize: '32px', padding: '16px'}} size="big" color="primary" aria-label="add" onClick={handleAddDropdown}
                                                             disabled={featuresDropdownCount === 5 || Object.keys(chosenFeatures).length !== featuresDropdownCount}>
                                                    <AddIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Clear All">
                                            <span>
                                                <IconButton color="primary" aria-label="clear all" onClick={clearAllChosenFeatures}>
                                                    <ClearIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        {featuresDropdownCount === 5 ?
                                            <Typography>
                                                Only 5 feature filters are allowed
                                            </Typography>
                                            :
                                            ''
                                        }
                                        </Box>
                                    </Box>
                            </Modal>
                        </Box>
                        <Box>
                            {Object.keys(chosenFeatures).length !== 0 ?
                                <Box>
                                    <Typography>
                                        Chosen features:
                                    </Typography>
                                    <Box>
                                        {Object.keys(chosenFeatures).map((key) => (
                                            <Chip key={key} label={chosenFeatures[key].replace(/~/g, ' ')}
                                                  onClick= {handleChipClick}
                                                  onDelete={handleChipDelete(chosenFeatures[key], key)}/>
                                        ))}
                                    </Box>
                                </Box>
                                : ''
                            }
                        </Box>
                        {validChoiceNotMade()  &&
                            <Box>
                                <Typography color={'primary'}
                                            sx={{
                                                fontSize: {xs: 'x-small', md: 'small'},
                                            }}>
                                    {chosenOrganisms.length === 0 ?
                                        'Please select at least one filter'
                                        :
                                        'Can\'t search only by organism, please choose at least one more filter.'
                                    }
                                </Typography>
                            </Box>

                        }
                        <span>
                            <Button disabled={validChoiceNotMade()} onClick={()=>search()} sx={{marginTop: '2vh'}} color='primary' variant='contained'>Search</Button>
                        </span>
                        <span>
                            <Button disabled={choiceNotMadeAtAll()} onClick={()=>resetChosenValues()}
                            sx={{marginTop: '2vh', marginLeft:'1vh'}} color='primary' variant='contained'>Clear All</Button>
                        </span>
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <QuickSearch afterResultsAreInStorage={() => window.location.reload()}/>                        
                </TabPanel>
            </Box>

            }
        </div>
    );
}
export default SearchFilters;