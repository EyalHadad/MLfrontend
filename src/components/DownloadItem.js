import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from '@emotion/react';
import { Button, Checkbox } from '@mui/material';

function DownloadItem(props) {
    const name = props.name;
    const onClick = props.onClick;
    const onCheck = props.onCheck;
    const onUncheck = props.onUncheck;
    const theme = useTheme();
    const checked = props.checked;
    const weightInMb = props.weightInMb;
    return (
        <ListItem>
            <ListItemAvatar>
                <Checkbox 
                    checked = {checked}
                    onChange={
                        (event, checkedIcon) => checkedIcon ? onCheck() : onUncheck()
                    }
                >

                </Checkbox>    
                
            </ListItemAvatar>
            <ListItemText sx={{color:theme.palette.primary.main}} primary={`${name} - [${weightInMb}MB]`} />
            <Button onClick={onClick} sx={{cursor:'pointer', color: theme.palette.primary.dark}}>
                <DownloadIcon  />
            </Button>
        </ListItem>
    )
}
export default DownloadItem;