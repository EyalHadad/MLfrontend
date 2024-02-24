import {Box, IconButton, TextField, Tooltip} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CommonStrings from "../classes/CommonStrings";
import {useLocalStorage} from "./useLocalStorage";
import DropDownOptions from "./DropDownOptions";
import { useState, useEffect } from "react";
// import ClearIcon from "@mui/icons-material/Clear";
// import SearchOptions from "../api/objects/SearchOptions";
// import {useTheme} from "@emotion/react";

function FeaturesDropDown(props) {
    // const theme = useTheme();
    const features = props.options.features
    const featuresNames = Object.keys(features);
    const filterTypes = props.options.featureTypes
    const featureNumber = props.featureNumber;
    const saveChosenFeature = props.saveChosenFeature;
    const chosenFeatures = props.chosenFeatures;

    const [chosenFeature, setChosenFeature] = useLocalStorage( `chosenFeature_${featureNumber}`, null)
    const [chosenFilter, setChosenFilter] = useLocalStorage(`chosenFilter_${featureNumber}`, null)
    const [chosenFilterValue, setChosenFilterValue] = useLocalStorage(`chosenFilterValue_${featureNumber}`, '')
    const [relevantFeatures, setRelevantFeatures] = useLocalStorage(CommonStrings.localStorageStrings.searchLocalStorageStrings.relevantFeatures, [])
    const [relevantFilters, setRelevantFilters] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const setChosenCustom = (value) => {
        if(value === null) {
            setChosenFeature(null);
            if(chosenFeatures[featureNumber] !== undefined)
                // remove chosen value from drop box that was saved to LS.
                saveChosenFeature(value, featureNumber)
        }
        else{
            const featureName = value.label
            setChosenFeature(featureName)
        }
    }

    const handleFilterValueChange = (event) => {
        setChosenFilterValue(event.target.value);
    };

    useEffect(()=>{
        // update the lists when any of the lists change
        if (!features || !filterTypes) return;
        // didn't choose anything yet
        if(Object.keys(chosenFeatures).includes(featureNumber.toString())){
            setIsDisabled(true)
        }
        if (chosenFeature === null || chosenFeature.length === 0){
            setChosenFilterValue(null)
            setChosenFilter(null)
            setRelevantFilters([])
            if(Object.keys(relevantFeatures).length === 0){
                const relevantFeaturesDict = featuresNames.map((option) => ({ label: option, disabled: false }));
                setRelevantFeatures(relevantFeaturesDict)
            }
        }
        // we chose feature
        else if (chosenFeature.length > 0){
            if(chosenFilter === null){ //only feature was chosen so far
                setChosenFilterValue(null)
                const chosenFeatureType = features[chosenFeature]
                const newRelevantFilters = filterTypes[chosenFeatureType]['filters'];
                setRelevantFilters(newRelevantFilters);
            }

        }
    }, [features, featuresNames, chosenFeatures, featureNumber, filterTypes, relevantFeatures, chosenFeature, setRelevantFeatures, chosenFilter, setChosenFilter, setRelevantFilters, setIsDisabled, setChosenFilterValue])

    const sendChosenFeatureToParent = () => {
        const chosenDict = {'featureName': chosenFeature, 'filter': chosenFilter, 'value': chosenFilterValue}
        saveChosenFeature(chosenDict, featureNumber)
        setIsDisabled(true);
    }

    return (
        <div>
            <Box sx={{
                    maxWith: '100%',
                    display: "grid",
                    gridTemplateColumns: {xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)'},
                    gap: {xs: 0, md: 2},
                    pointerEvents: isDisabled ? 'none' : 'auto' // Disable pointer events when disabled
                }} >
                <DropDownOptions sx={{margin:'10px'}} inputLabel={CommonStrings.mappingStrings.featuresMap} disabledAllowed={true}
                                 options={relevantFeatures} chosen={chosenFeature} setChosen={setChosenCustom} isMultiSelected={false}></DropDownOptions>
                <DropDownOptions inputLabel={CommonStrings.mappingStrings.filtersMap}
                                 options={relevantFilters} chosen={chosenFilter} setChosen={setChosenFilter} isMultiSelected={false} isDisabled={chosenFeature === null} ></DropDownOptions>
                <TextField disabled={chosenFilter === null} value={chosenFilterValue !== null ? chosenFilterValue : ''} label="Filter value" inputProps={{ type: 'number' }} variant="outlined" onChange={handleFilterValueChange} />
                <Tooltip title="save filter">
                    <span style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <IconButton disabled={isDisabled || chosenFeature === null || chosenFilter === null || chosenFilterValue === null} color="primary" onClick={sendChosenFeatureToParent}>
                            <DoneIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </div>
    );
}

export default FeaturesDropDown;
