import { Box, Autocomplete, Checkbox, TextField, Chip, createFilterOptions } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

// this object recieves options and shows an auto complete drop down of these options
// it also recieves a method to activate on change
const multiSelectionIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const multiSelectionCheckedIcon = <CheckBoxIcon fontSize="small" />;
const singleSelectionIcon = <RadioButtonUncheckedIcon fontSize="small" />;
const singleSelectionCheckedIcon = <RadioButtonCheckedIcon fontSize="small" />;
const maxSuggestions = 100;

const defaultFilterOptions = createFilterOptions();
const filterOptions = (option, state) => {
    return defaultFilterOptions(option, state).slice(0, maxSuggestions);
}
function DropDownOptions(props){                
    const handleChange = (event, value) => {  
        setChosen(            
          value
        );
    };    
    //const theme = useTheme();    
    const setChosen = props.setChosen;
    const options = props.options;
    const isDisabled = props.isDisabled != null ? props.isDisabled : false; // default is enabled
    const isMultiSelected = props.isMultiSelected != null ? props.isMultiSelected : true; // default is multi selection
    const InputLabel = props.inputLabel;
    const chosen = props.chosen;
    const disabledAllowed = props.disabledAllowed != null ? props.disabledAllowed : false; // default is false
    return (
        <div>            
            <Box sx={{maxWidth: '100%'}}>
            <Autocomplete sx={{maxWidth: '100%'}} 
            filterOptions={filterOptions}
            multiple={isMultiSelected}
            id="checkboxes-tags"
            options={options}     
            value={chosen}
            disabled={isDisabled}

            getOptionDisabled={(option) =>
                disabledAllowed && option.disabled
            }
            disableCloseOnSelect
            isOptionEqualToValue={disabledAllowed ? (option, value) => option.label === value  : (option, value) => option === value}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                <Checkbox
                    icon={isMultiSelected ? multiSelectionIcon : singleSelectionIcon}
                    checkedIcon={isMultiSelected ? multiSelectionCheckedIcon : singleSelectionCheckedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                />
                {disabledAllowed ? option.label : option}
                </li>
            )}            
            renderInput={(params) => (
                <TextField {...params}  label={InputLabel} placeholder={(!chosen || chosen.length)=== 0 ? "Type or select": ''} />
            )}
            // controll the rendering of the chosen elements - if all are chosen we dont want to
            // actually show each and every one
            renderTags={(values) =>{
                let toRender = values;
                if(toRender.length > 3) toRender = toRender.filter((v,i) => i < 3);
                return (              
                    <Box>      
                    {toRender.map(tr=> <Chip key={tr} size="small" label={tr} onDelete={()=>{setChosen(chosen.filter(v => v !== tr));}}></Chip>)}
                    {values.length > toRender.length ? <Chip size="small" label={(values.length - toRender.length).toString() + '+'}></Chip> : ''}
                    </Box>
                )
            }}
            onChange={handleChange}
            />

            </Box>
        </div>
    );
}

export default DropDownOptions;