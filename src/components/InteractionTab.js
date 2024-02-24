import {Box, Link, Typography} from "@mui/material";
import {useTheme} from "@emotion/react";
import * as PropTypes from "prop-types";
import CommonStrings from './../classes/CommonStrings';
import DNALoading from "./DnaLoading";
function InteractionTabRow(props) {
    const key = props.name
    const keyMap = CommonStrings.mappingStrings[`${key}Map`];    
    const dataDict = props.selectedInteractionData
    const theme = props.theme
    // const dataType = typeof dataDict[key]
    // const dataValue = dataType === 'boolean' ? dataDict[key].toString() : dataDict[key]
    return <Box sx={{
        display: "flex", justifyContent: "flex-start",
        fontSize: {xs: "small", md: "large"}
    }}>
        <Box sx={{marginRight: "10px"}}>
            {keyMap ? keyMap : key}:
        </Box>
            <Box  as={key === CommonStrings.mappingStrings.duplexStructure ? 'pre' : 'div'} sx={{
                marginLeft: "10px",
                fontWeight: theme.typography.fontWeightRegular,
                color: theme.palette.secondary.modal
            }}>
                <div>
                    {key !== CommonStrings.mappingStrings.sequenceUrl ? dataDict[key] :
                        <Link href={dataDict[key]} underline="hover" target='_blank' rel='noopener'>
                            {dataDict[key]}
                        </Link>
                    }
                </div>
            </Box>
    </Box>;
}

InteractionTabRow.propTypes = {
    name: PropTypes.any,
    theme: PropTypes.any,
    selectedInteractionData: PropTypes.any
};

function InteractionTab(props){
    const tabName = props.tabName;
    const tabNameMap = CommonStrings.mappingStrings[`${tabName}Map`];
    const selectedInteractionData = props.selectedInteraction[tabName];
    const theme = useTheme();
    return (
      <Typography
        component={'span'}
        sx={{
          fontWeight: 700,
          fontSize: { xs: 'medium', md: 'large' },
          width: '95%',
          height: '85%',
          font: theme.typography.fontFamily,
          color: theme.palette.primary.main,
        }}
      >
          {tabName == null || selectedInteractionData == null ?
              <div>
                  <DNALoading></DNALoading>
              </div>
              :
              <div sx={{ width: '100%' }}>
                  <h1>{tabNameMap ? tabNameMap : tabName}</h1>
                  {Object.keys(selectedInteractionData).map((key, index) => {
                      return (
                          <div key={index}>
                                <InteractionTabRow name={key} theme={theme}
                                                     selectedInteractionData={selectedInteractionData} />
                              <hr/>
                          </div>
                      );
                  })}
              </div>
          }
      </Typography>
    );
}

export default InteractionTab;
