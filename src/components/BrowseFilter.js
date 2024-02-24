import {Box, Button, Typography} from "@mui/material";
import DropDownOptions from "./DropDownOptions";
import {useEffect, useState} from "react";
import {useLocalStorage} from "./useLocalStorage";
import CommonStrings from "../classes/CommonStrings";
import DNALoading from "./DnaLoading";

function BrowseFilter(props){
    const organisms = props.organisms;
    const [chosenOrganisms, setChosenOrganisms] = useLocalStorage(CommonStrings.localStorageStrings.browseLocalStorageStrings.chosenOrganism, [])
    // const [chosenOrganisms, setChosenOrganisms] = useState([]);
    // const [chosenDatasetName, setChosenDatasetName] = useState(null);
    const [chosenDatasetName, setChosenDatasetName] = useLocalStorage(CommonStrings.localStorageStrings.browseLocalStorageStrings.chosenDatasetName, null)
    const [relevantOrganisms, setRelevantOrganisms] = useState([]);
    const [relevantDatasetsNames, setRelevantDatasetsNames] = useState([]);
    
    useEffect(()=>{
      // update the lists when any of the lists change
      if (!organisms) return;
      // empty the searching so far?
      setRelevantOrganisms(organisms.map((org) => org.name));
      // change the content of the relevant lists according to the user already existing selection - using setRelevant methods
      let cOrganisms = organisms.filter(
        (org) => chosenOrganisms.indexOf(org.name) !== -1
      );
      // console.log(cOrganisms);
      if (cOrganisms.length === 0)
        // if chosen organisms is empty, keep all datasets
        cOrganisms = organisms;
      const newRelevantDatasets = cOrganisms
        .map((org) => org.datasets)
        .flat()
        .map((ds) => ds.name);
      setRelevantDatasetsNames(newRelevantDatasets);
      if (newRelevantDatasets.indexOf(chosenDatasetName) === -1)
        setChosenDatasetName(null);
    }, [organisms, chosenOrganisms, chosenDatasetName, setChosenDatasetName])


    const isButtonDisabled = () => {
        return (
            chosenDatasetName === '' || chosenDatasetName === null
        )
    }
    const Browse = () => {        
        const datasetId = organisms.map(org => org.datasets).flat().filter(ds => ds.name === chosenDatasetName)[0].id;        
        props.onBrowse(datasetId);
    }

    return(
        <div>
            {organisms == null ?
                <Box>
                    <DNALoading></DNALoading>
                </Box>

                :
                <Box>
                    <Box sx={{maxWith: '100%'}} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)'}} gap={{xs: 0, md: 2}}>
                        <DropDownOptions inputLabel={CommonStrings.mappingStrings.organismsMap} options={relevantOrganisms}
                                        chosen={chosenOrganisms} setChosen={setChosenOrganisms}></DropDownOptions>
                        <DropDownOptions isMultiSelected={false} inputLabel={CommonStrings.mappingStrings.datasetsMap} options={relevantDatasetsNames}
                                        chosen={chosenDatasetName} setChosen={setChosenDatasetName}></DropDownOptions>
                    </Box>
                    {isButtonDisabled()  &&
                        <Box>
                            <Typography color={'primary.dark'}
                                        sx={{
                                            fontSize: {xs: 'x-small', md: 'small'},
                                        }}>
                                Please select dataset name
                            </Typography>
                        </Box>

                    }
                    <Button disabled={isButtonDisabled()} onClick={() => Browse()} sx={{marginTop: '2vh'}} color='primary'
                            variant='contained'>Browse</Button>
                </Box>
            }
        </div>
    )
}

export default BrowseFilter;