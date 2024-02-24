import {
    Box,
    Button,
    Typography,
    TextField,
    Tooltip,
    TableContainer,
    Table,
    TableHead,
    TableRow, TableCell, TableBody
} from "@mui/material";
import upperImage from "../extensions/images/predict/artificial-intelligence.png";
import * as React from 'react';
import DropDownOptions from "../components/DropDownOptions";
import { useEffect, useState, useRef, useContext } from 'react';
import {useTheme} from "@emotion/react";
import CommonStrings from "../classes/CommonStrings";
import ApiRequests from "../api/ApiRequests";
import AlertContext from "../components/AlertContext";
import {useLocalStorage} from "../components/useLocalStorage";
import LinearProgress from '@mui/material/LinearProgress';
import PredictHelp from './../components/PredictHelp';
import DraggableFab from './../components/DraggableFab';
import PredictDataExample from "../classes/PredictDataExample";
import apiRequests from "../api/ApiRequests";
import PredicDialog from "../components/PredicDialog";


function Predict() {
    const theme = useTheme();
    const maxLengthHistory = 5;
    const alertContext = useRef(useContext(AlertContext));
    const [organisms, setOrganisms] = useState([]);
    const [chosenOrganism, setChosenOrganism] = useState(null);
    const [chosenMRNA, setChosenMRNA] = useState(null);
    const [chosenMiRNA, setChosenMiRNA] = useState(null);
    const [chosenSite, setChosenSite] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const maxStringSizeInTable = 15
    const [historyPredictions, setHistoryPredictions] = useLocalStorage('historyPredictions', {})
    const [siteError, setSiteError] = useState(false);
    const [miRNAError, setMiRNAError] = useState(false);
    const [mRNAError, setMRNAError] = useState(false);
    const [error, setError] = useState(false);
    const [currData, setCurrData] = useState([]);
    const [openDialog, setDialogOpen] = useState(false);
    const min_22_input_warning = 'The input must have a minimum length of 22 characters.'
    const min_18_25_input_warning = 'Input length must be between 18 and 25 characters.'
    const createChangeHandler = (setValue, setError, minLength, shouldSlice, required) => {
        return (event) => {
            let newValue = event.target.value.replace(/[^agucAGUC]/gi, ''); 
            if (shouldSlice) {
                newValue = newValue.slice(0, 25);
            }
            setError(newValue.length < minLength);
            setValue(newValue);
        };
    };
    const handleMRNAChange = createChangeHandler(setChosenMRNA, setMRNAError, 22, false,);
    const handleMiRNAChange = createChangeHandler(setChosenMiRNA, setMiRNAError, 18, true);
    const handleSiteChange = createChangeHandler(setChosenSite, setSiteError, 22, true);

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    useEffect(() => {
        // will fire only the first time the browse is created
        async function fetchData(){
            const result = await ApiRequests.getDetails(false);
            if(!result){
                alertContext.current.set('error',
                    CommonStrings.apiStrings.userExceptions.generalErrorTitle,
                    CommonStrings.apiStrings.userExceptions.generalErrorTitle,
                    <Button onClick={()=>{window.location.reload(); alertContext.current.clear();}}>RELOAD</Button>,
                    10000);
                return;
            }
            setOrganisms(result.organisms.map(org => org.name));
        }
        fetchData();
    }, [])

    function fifoDictUpdate(tempDict) {
        const keys = Object.keys(historyPredictions);
        delete tempDict[keys[0]]
        // Shift all existing predictions one place to the right
        for (let i = keys.length; i > 1; i--) {
            const currentKey = keys[i-1];
            tempDict[parseInt(currentKey) - 1] = historyPredictions[currentKey];
        }
        return tempDict
    }


    const savePredictionToHistory = (prediction) => {
        let newIndex = Object.keys(historyPredictions).length
        if(Object.keys(historyPredictions).length <= maxLengthHistory) {
            let tempDict = {...historyPredictions};
            if (Object.keys(historyPredictions).length === maxLengthHistory) {
                tempDict = fifoDictUpdate(tempDict);
                newIndex = newIndex - 1
            }
            tempDict[newIndex] = {
                'miRNA': chosenMiRNA,
                'mRNA': chosenMRNA,
                'site': chosenSite,
                'organism': chosenOrganism,
                'prediction': prediction['prob'],
                'duplex':prediction['duplex']
            }
            setHistoryPredictions(tempDict)
        }
    }

    const predict = async () => {
        const dataDict = {'mRNA': chosenMRNA,
                        'miRNA': chosenMiRNA,
                        'site': chosenSite,
                        'organism': chosenOrganism}
        let resultFromApi = await apiRequests.getPrediction(dataDict);
        if(resultFromApi !== undefined){
            setError(false)
            resultFromApi['prob'] = parseFloat(resultFromApi['prob'].toFixed(5));
            setPrediction(resultFromApi['prob']);
            savePredictionToHistory(resultFromApi);
            console.log(historyPredictions)
        }
        else{
            setError(true)
        }
    }


    const clearAllValues = () => {
        setChosenMRNA(null)
        setChosenMiRNA(null)
        setChosenSite(null)
        setChosenOrganism(null)
        setPrediction(null)
        setMRNAError(false)
        setMiRNAError(false)
        setSiteError(false)
        setError(false)
    }

    const shortenString = (longString) => {
        if(!longString) return '';
        if(longString.toString().length > maxStringSizeInTable){
            return longString.toString().substring(0,maxStringSizeInTable/2 - 3)
            + '...' +
            longString.toString().substring(longString.toString().length
                - (maxStringSizeInTable/2 - 3),longString.toString().length)
        }
        else return longString.toString()
    }

    function handleInsertExampleValues() {
        setMRNAError(false)
        setMiRNAError(false)
        setSiteError(false)
        setChosenMRNA(PredictDataExample.mRNAExampleValue)
        setChosenMiRNA(PredictDataExample.miRNAExampleValue)
        setChosenSite(PredictDataExample.siteExampleValue)
        setChosenOrganism(getRandomOrganism())
    }

    const getRandomOrganism = () => {
        const randomIndex = Math.floor(Math.random() * organisms.length);
        return organisms[randomIndex];
    };


    const handleClearHistory = () => {
        setHistoryPredictions({});
        setPrediction(undefined)
    }

    const disablePredictButton = () => {
        return !chosenMRNA || !chosenMiRNA || !chosenOrganism || siteError || miRNAError || mRNAError
    }

    const handleRowClick = (data) =>{
        setCurrData(historyPredictions[data]);
        setDialogOpen(true)
    }

    return (
        <div style={{paddingTop: '15vh', width:'95%', margin: 'auto'}}>
            <DraggableFab dialogContent={<PredictHelp/>}></DraggableFab>        
            <Box sx={{position:'relative' ,margin: 'auto', width: {xs: '60%', md: '30%'}}}>
                <img src={upperImage} width={'40%'} height={'40%'} alt='' />
            </Box>
            <Box>
                <Typography color={'primary'}
                            sx={{
                                fontWeight: 700,
                                fontSize: {xs: 'medium', md: 'x-large'},
                            }}>
                    Interactions Prediction Model
                </Typography>
                <Typography color={'primary'}
                            sx={{
                                fontSize: {xs: 'x-small', md: 'small'},
                            }}>
                    The model we provide can predict the chances for an interaction to happen.
                </Typography>
            </Box>
            <Box sx={{
                display: "grid",
                gridTemplateColumns: {xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)'},
                gap: {xs: 2, md: 2},
                border: '2px solid',
                borderRadius: '10px',
                borderColor: theme.palette.primary.light,
                padding: '5vh',
                paddingBottom: '8vh',
                margin: 'auto',
                marginTop: '2vh',
                marginBottom:'5vh',
                backgroundColor: theme.palette.secondary.secondary,
                overflow: 'auto'
            }}>
                <Box sx={{                    
                    display: "grid",
                    gridTemplateColumns: {xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)'},
                    gap: {xs: 1, md: 2}, maxWidth: '70vw'
                }}>
                    <Typography sx={{
                        fontWeight: 700,
                        fontSize: { xs: 'medium', md: 'large' },
                        width: '95%',
                        height: '85%',
                        font: theme.typography.fontFamily,
                        color: theme.palette.primary.main,
                    }}>
                        1. Populate the mRNA, miRNA, and Site (optional) fields using only the characters A, U, C, and G.
                    </Typography>
                    <TextField required value={chosenMRNA !== null ? chosenMRNA : ''} label="mRNA" variant="outlined"
                               onChange={handleMRNAChange} error={mRNAError}
                               helperText={mRNAError ? min_22_input_warning : ''}/>
                    <TextField required value={chosenMiRNA !== null ? chosenMiRNA : ''} label="miRNA" variant="outlined"
                               onChange={handleMiRNAChange}  error={miRNAError}
                               helperText={miRNAError ? min_18_25_input_warning : ''}/>
                    <TextField value={chosenSite !== null ? chosenSite : ''} label="Site" variant="outlined"
                               onChange={handleSiteChange} error={siteError}
                               helperText={siteError ? min_22_input_warning : ''}/>
                    <Typography sx={{
                        fontWeight: 700,
                        fontSize: { xs: 'medium', md: 'large' },
                        width: '95%',
                        height: '85%',
                        font: theme.typography.fontFamily,
                        color: theme.palette.primary.main,
                    }}>
                        <hr/>
                        2. Choose a model trained on an organism from the list below:
                    </Typography>
                    <DropDownOptions sx={{margin:'10px'}} inputLabel='Organisms *' options={organisms} chosen={chosenOrganism}
                                     setChosen={setChosenOrganism} isMultiSelected={false}></DropDownOptions>
                    <Button variant="outlined" onClick={handleInsertExampleValues}>
                        Data Example
                    </Button>

                    <Button sx={{width:'1fr', height:'54px' }} variant="contained" color="primary"
                            disabled={disablePredictButton()} onClick={predict}>
                        Predict
                    </Button>

                    <Button sx={{width:'1fr', height:'54px' }} variant="contained" color="primary"
                            onClick={clearAllValues}
                            disabled={!chosenSite && !chosenOrganism && !chosenMRNA && !chosenMiRNA }>
                        Clear All
                    </Button>
                </Box>
                <Box sx={{width:'100%', maxWidth:'70vw'}}>
                    <Typography color={ theme.palette.secondary.light}  sx={{
                        fontWeight: 700,
                        fontSize: {xs: 'medium', md: 'x-large'},
                        backgroundColor:theme.palette.primary.dark,
                        color: theme.palette.secondary.dark,
                        padding: '10px',
                        lineHeight: '1.5',
                        borderRadius: '5px'
                    }}>
                        The predicted probability:
                    </Typography>
                    {!error ?
                        <Box sx={{
                            position: 'relative',
                            margin: 'auto',
                            height: {xs: '15%', md: '15%'},
                        }}>
                            <Typography component={'span'}
                                        sx={{fontWeight: 600, fontSize: {xs: 'medium', md: 'large'}}}>
                                <Box marginTop={'1vh'}>
                                    {prediction} interaction probability
                                    <LinearProgress sx={{
                                        marginLeft: '3vw',
                                        marginRight: '3vw'
                                    }} variant="determinate" value={prediction * 100}/>
                                </Box>
                            </Typography>
                        </Box>
                    :
                        <Box sx={{
                            position: 'relative',
                            margin: 'auto',
                            height: {xs: '15%', md: '15%'},
                        }}>
                            <Typography component={'span'}
                                        sx={{fontWeight: 600, fontSize: {xs: 'medium', md: 'large'}}}>
                                Something Went Wrong...
                            </Typography>
                        </Box>
                    }

                    <Box>
                        <Typography color={ theme.palette.secondary.light}  sx={{
                            fontWeight: 700,
                            fontSize: {xs: 'medium', md: 'x-large'},
                            backgroundColor:theme.palette.primary.dark,
                            color: theme.palette.secondary.dark,
                            padding: '10px',
                            lineHeight: '1.5',
                            borderRadius: '5px'
                        }}>
                            Previous predictions
                        </Typography>
                        <Box>
                            <Button disabled={Object.keys(historyPredictions).length === 0} onClick={handleClearHistory}>Clear history</Button>
                            <TableContainer>
                                <Table>
                                    <TableHead >
                                        <TableRow sx={{width:'100%'}}>
                                            <TableCell >miRNA</TableCell>
                                            <TableCell >mRNA</TableCell>
                                            <TableCell >Site</TableCell>
                                            <TableCell >Model</TableCell>
                                            <TableCell >Probability</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(historyPredictions).reverse().map((key) => (
                                            <TableRow style={{cursor:'pointer'}} key={key} onClick={() => handleRowClick(key)}>
                                                {Object.keys(historyPredictions[key]).map((innerKey, index) => (
                                                index !== 5 &&<TableCell key={innerKey}>
                                                    <Tooltip title={historyPredictions[key][innerKey]?.toString().length > maxStringSizeInTable ? historyPredictions[key][innerKey]?.toString() : ''}>
                                                        <Typography noWrap >
                                                            {
                                                                shortenString(historyPredictions[key][innerKey])
                                                            }
                                                        </Typography>
                                                    </Tooltip>
                                                </TableCell>
                                                        ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {openDialog && <PredicDialog open={openDialog} handleClose={handleCloseDialog} currData={currData}/>}
        </div>
    )
}
export default Predict;
