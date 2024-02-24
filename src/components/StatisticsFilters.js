import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import DropDownOptions from './DropDownOptions';
import SearchOptions from '../api/objects/SearchOptions';
import { useLocalStorage } from './useLocalStorage';
import CommonStrings from '../classes/CommonStrings';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import {
  BarChart,
  PieChart,
  Radar as RadarChart,
  DonutLarge as DonutChart,
} from '@mui/icons-material';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import Radio from '@mui/material/Radio';
import ControlledRadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Filters from '../classes/Filters';
import DNALoading from './DnaLoading';

export default function StatisticsFilters(props) {
  const organisms = props.organisms;
  const features = props.features;
  const numericFeatures = props.numericFeatures;
  const steps = ['Select chart type', 'Choose main filters', 'Choose features'];
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const toggling = (canContinue) => (
    <Box>
      {activeStep < steps.length - 1 ? (
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color='primary'
            variant='contained'
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />

          <Button
            disabled={!canContinue}
            color='primary'
            variant='contained'
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Generate' : 'Next'}
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color='primary'
            variant='contained'
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />

          <Button
            disabled={!canContinue}
            color='primary'
            variant='contained'
            onClick={generate}
          >
            {activeStep === steps.length - 1 ? 'Generate' : 'Next'}
          </Button>
        </Box>
      )}
    </Box>
  );
  const generate = () => {
    setActiveStep(0);
    props.setCurrentSubFeatureSelection({
      'Organisms' : chosenOrganisms,
      'Datasets': chosenDatasetsNames,
      'Seed Families': chosenSeedFamilies,
      'MiRNA-ids': chosenMiRnaIds,
      'Site Types': chosenSites,
      'Gene Ids': chosenGeneIds,
      'Regions': chosenRegions
    });
    const allDatasets = organisms.map((org) => org.datasets).flat();
    let chosenDatasetsIds = [];
    for (let ds of allDatasets) {
      if (chosenDatasetsNames.indexOf(ds.name) !== -1) {
        chosenDatasetsIds.push(ds.id);
      }
    }
    // generate filters from object and send upwords to the Search component
    let filters = new Filters(
      chosenDatasetsIds,
      chosenSeedFamilies,
      chosenMiRnaIds,
      chosenSites,
      chosenGeneIds,
      chosenRegions
    );
    if (dimensions === 1)
      props.onGenerate1D(filters, chosenFeatureX, chosenChartType);
    if (dimensions === 2)
      props.onGenerate2D(
        filters,
        chosenFeatureX,
        chosenFeatureY,
        chosenChartType
      );
  };
  // filters
  const [chosenOrganisms, setChosenOrganisms] = useLocalStorage(
    CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenOrganisms,
    []
  );
  const [chosenDatasetsNames, setChosenDatasetsNames] = useLocalStorage(
    CommonStrings.localStorageStrings.searchLocalStorageStrings
      .chosenDatasetName,
    []
  );
  const [chosenSeedFamilies, setChosenSeedFamilies] = useLocalStorage(
    CommonStrings.localStorageStrings.searchLocalStorageStrings
      .chosenSeedFamilies,
    []
  );
  const [chosenMiRnaIds, setChosenMiRnaIds] = useLocalStorage(
    CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenMiRnaIds,
    []
  );
  const [chosenSites, setChosenSites] = useLocalStorage(
    CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenSites,
    []
  );
  const [chosenGeneIds, setChosenGeneIds] = useLocalStorage(
    CommonStrings.localStorageStrings.searchLocalStorageStrings.chosenGeneIds,
    []
  );
  const [chosenRegions, setChosenRegions] = useLocalStorage(
    CommonStrings.localStorageStrings.searchLocalStorageStrings
      .setChosenRegions,
    []
  );

  const [chosenFeatureX, setChosenFeatureX] = useState('');
  const [chosenFeatureY, setChosenFeatureY] = useState('');

  const [dimensions, setDimensions] = useState(1);

  useEffect(() => {
    // update the lists when organism or dataset change
    if (!organisms || !features) return;
    // empty the searching so far?
    setRelevantOrganisms(organisms.map((org) => org.name));
    setRelevantFeatures(features.map((f) => f.name));
    // change the content of the relevant lists according to the user already existing selection - using setRelevant methods
    let cOrganisms = organisms.filter(
      (org) => chosenOrganisms.indexOf(org.name) !== -1
    );
    if (cOrganisms.length === 0)
      // if chosen organisms is empty, keep all datasets
      cOrganisms = organisms;
    const newRelevantDatasetsNames = cOrganisms
      .map((org) => org.datasets)
      .flat()
      .map((ds) => ds.name);
    setRelevantDatasetsNames(newRelevantDatasetsNames);
    if (
      chosenDatasetsNames.filter(
        (cds) => newRelevantDatasetsNames.indexOf(cds) === -1
      ).length !== 0
    )
      //  if there is a chosen dataset that is not relevant
      setChosenDatasetsNames((chosenDatasetsNames) =>
        chosenDatasetsNames.filter(
          (cds) => newRelevantDatasetsNames.indexOf(cds) !== -1
        )
      );
    // change the content of search options according to data set selection
    let allDatasets = organisms.map((org) => org.datasets).flat();
    let relevantDatasets = allDatasets.filter(
      (ds) => chosenDatasetsNames.indexOf(ds.name) !== -1
    );
    if (relevantDatasets.length === 0) relevantDatasets = allDatasets;
    const newRelevantSearchOptions = new SearchOptions({
      geneIds: [
        ...new Set(
          relevantDatasets.map((ds) => ds.searchOptions.geneIds).flat()
        ),
      ],
      miRnaIds: [
        ...new Set(
          relevantDatasets.map((ds) => ds.searchOptions.miRnaIds).flat()
        ),
      ],
      regions: [
        ...new Set(
          relevantDatasets.map((ds) => ds.searchOptions.regions).flat()
        ),
      ],
      seedFamilies: [
        ...new Set(
          relevantDatasets.map((ds) => ds.searchOptions.seedFamilies).flat()
        ),
      ],
      siteTypes: [
        ...new Set(relevantDatasets.map((ds) => ds.searchOptions.siteTypes).flat()),
      ],
    });
    setRelevantGeneIds(newRelevantSearchOptions.geneIds);
    setChosenGeneIds((chosenGeneIds) =>
      chosenGeneIds.filter(
        (gid) => newRelevantSearchOptions.geneIds.indexOf(gid) !== -1
      )
    );
    setRelevantMiRnaIds(newRelevantSearchOptions.miRnaIds);
    setChosenMiRnaIds((chosenMiRnaIds) =>
      chosenMiRnaIds.filter(
        (miid) => newRelevantSearchOptions.miRnaIds.indexOf(miid) !== -1
      )
    );
    setRelevantRegions(newRelevantSearchOptions.regions);
    setChosenRegions((chosenRegions) =>
      chosenRegions.filter(
        (cr) => newRelevantSearchOptions.regions.indexOf(cr) !== -1
      )
    );
    setRelevantSeedFamilies(newRelevantSearchOptions.seedFamilies);
    setChosenSeedFamilies((chosenSeedFamilies) =>
      chosenSeedFamilies.filter(
        (sf) => newRelevantSearchOptions.seedFamilies.indexOf(sf) !== -1
      )
    );
    setRelevantSites(newRelevantSearchOptions.siteTypes);
    setChosenSites((chosenSites) =>
      chosenSites.filter(
        (cs) => newRelevantSearchOptions.siteTypes.indexOf(cs) !== -1
      )
    );
  }, [
    organisms,
    features,
    chosenOrganisms,
    chosenDatasetsNames,
    setChosenOrganisms,
    setChosenSites,
    setChosenDatasetsNames,
    setChosenRegions,
    setChosenSeedFamilies,
    setChosenMiRnaIds,
    setChosenGeneIds,
  ]);

  const [relevantOrganisms, setRelevantOrganisms] = useState([]);
  const [relevantDatasetsNames, setRelevantDatasetsNames] = useState([]);
  const [relevantSeedFamilies, setRelevantSeedFamilies] = useState([]);
  const [relevantMiRnaIds, setRelevantMiRnaIds] = useState([]);
  const [relevantSites, setRelevantSites] = useState([]);
  const [relevantGeneIds, setRelevantGeneIds] = useState([]);
  const [relevantRegions, setRelevantRegions] = useState([]);
  const [relevantFeatures, setRelevantFeatures] = useState([]);

  const [chosenChartType, setChosenChartType] = useState(null);

  const chartTypes1D = {
    pie: <PieChart />,
    bar: <BarChart />,
    radar: <RadarChart />,
    doughnut: <DonutChart />,
  };

  const chartTypes2D = {
    scatter: <ScatterPlotIcon />,
    bubble: <BubbleChartIcon />,
  };

  return organisms ? (
    <Box>
      <Stepper activeStep={activeStep} sx={{ marginTop: '2vh', marginBottom: '2vh' }}>
        {steps.map((label, index) => {
          return (
            <Step
              key={label}
              sx={{
                '& .MuiStepLabel-root 	.MuiStepLabel-label': {
                  font: 'inherit',
                },
                '& .MuiStepLabel-root .Mui-completed': {
                  font: 'inherit',
                  cursor: 'pointer',
                },
              }}
            >
              <StepLabel
                onClick={() => {
                  if (index < activeStep) setActiveStep(index);
                }}
                sx={{ color: 'primary', fontWeight: 700, maxWidth: '22vw' }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === 0 ? (
        <React.Fragment>
          <FormControl>
            <ControlledRadioGroup
              onChange={(event) => setChosenChartType(event.target.value)}
              defaultValue={chosenChartType}
            >
              <Box
                display='grid'
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                gap={{ xs: 0, md: '10vh' }}
              >
                <Box>
                  <Typography
                    color={'primary'}
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 'medium', md: 'x-large' },
                    }}
                  >
                    1 feature selection charts
                  </Typography>
                  {Object.keys(chartTypes1D).map((k) => (
                    <Box key={k}>
                      <FormControlLabel
                        onClick={() => {
                          if (dimensions !== 1) {
                            setDimensions(1);
                            setChosenFeatureX('');
                            setChosenFeatureY('');
                          }
                        }}
                        value={k}
                        control={<Radio />}
                        label={
                          <>
                            {chartTypes1D[k]}({k})
                          </>
                        }
                      />
                      <br />
                    </Box>
                  ))}
                </Box>

                <Box>
                  <Typography
                    color={'primary'}
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 'medium', md: 'x-large' },
                    }}
                  >
                    2 feature selection charts
                  </Typography>
                  {Object.keys(chartTypes2D).map((k) => (
                    <Box key={k}>
                      <FormControlLabel
                        onClick={() => {
                          if (dimensions !== 2) {
                            setDimensions(2);
                            setChosenFeatureX('');
                            setChosenFeatureY('');
                          }
                        }}
                        value={k}
                        control={<Radio />}
                        label={
                          <>
                            {chartTypes2D[k]}({k})
                          </>
                        }
                      />
                      <br />
                    </Box>
                  ))}
                </Box>
              </Box>
            </ControlledRadioGroup>
          </FormControl>
          {toggling(chosenChartType)}
        </React.Fragment>
      ) : activeStep === 1 ? (
        <React.Fragment>
          <Box
            sx={{ maxWith: '100%' }}
            display='grid'
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
            gap={{ xs: 0, md: 2 }}
          >
            <DropDownOptions
              inputLabel={CommonStrings.mappingStrings.organismsMap}
              options={relevantOrganisms}
              chosen={chosenOrganisms}
              setChosen={setChosenOrganisms}
            ></DropDownOptions>
            <DropDownOptions
              inputLabel={CommonStrings.mappingStrings.datasetsMap}
              options={relevantDatasetsNames}
              chosen={chosenDatasetsNames}
              setChosen={setChosenDatasetsNames}
            ></DropDownOptions>
            <DropDownOptions
              inputLabel={CommonStrings.mappingStrings.seedFamiliesMap}
              options={relevantSeedFamilies}
              chosen={chosenSeedFamilies}
              setChosen={setChosenSeedFamilies}
            ></DropDownOptions>
            <DropDownOptions
              inputLabel={CommonStrings.mappingStrings.miRnaIdsMap}
              options={relevantMiRnaIds}
              chosen={chosenMiRnaIds}
              setChosen={setChosenMiRnaIds}
            ></DropDownOptions>
            <DropDownOptions
              inputLabel={CommonStrings.mappingStrings.siteTypesMap}
              options={relevantSites}
              chosen={chosenSites}
              setChosen={setChosenSites}
            ></DropDownOptions>
            <DropDownOptions
              inputLabel={CommonStrings.mappingStrings.geneIdsMap}
              options={relevantGeneIds}
              chosen={chosenGeneIds}
              setChosen={setChosenGeneIds}
            ></DropDownOptions>
            <DropDownOptions
              inputLabel={CommonStrings.mappingStrings.regionsMap}
              options={relevantRegions}
              chosen={chosenRegions}
              setChosen={setChosenRegions}
            ></DropDownOptions>
          </Box>
          {toggling(true)}
        </React.Fragment>
      ) : activeStep === 2 ? (
        <React.Fragment>
          <FormControl fullWidth>
            <InputLabel id='feature-x-label'>Feature X</InputLabel>
            <Select
              labelId='feature-x-label'
              id='feature-x-select'
              value={chosenFeatureX}
              label='Feature X'
              onChange={(event) => setChosenFeatureX(event.target.value)}
            >
              {relevantFeatures.map((feature) => (
                <MenuItem
                  disabled={
                    dimensions !== 1 &&
                    numericFeatures.filter((nf) => nf === feature).length === 0
                  }
                  key={feature}
                  value={feature}
                >
                  {feature}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            sx={{
              display: dimensions === 1 ? 'none' : 'fullwidth',
              marginTop: '2vh',
            }}
          >
            <InputLabel id='feature-y-label'>Feature Y</InputLabel>
            <Select
              labelId='feature-y-label'
              id='feature-y-select'
              value={chosenFeatureY}
              label='Feature Y'
              onChange={(event) => setChosenFeatureY(event.target.value)}
            >
              {relevantFeatures.map((feature) => (
                <MenuItem
                  disabled={
                    dimensions !== 1 &&
                    numericFeatures.filter((nf) => nf === feature).length === 0
                  }
                  key={feature}
                  value={feature}
                >
                  {feature}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {toggling(
            (chosenFeatureX && dimensions === 1) ||
              (chosenFeatureX && chosenFeatureY && dimensions === 2)
          )}
        </React.Fragment>
      ) : null}
    </Box>
  ) : (
    <DNALoading></DNALoading>
  );
}
