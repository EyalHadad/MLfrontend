import { Alert, Box, AlertTitle, IconButton } from "@mui/material"
import { useContext } from "react";
import AlertContext from "./AlertContext";
import CloseIcon from '@mui/icons-material/Close';

function MyAlert(){
    const alertContext = useContext(AlertContext);

    return (
        alertContext.type !== null &&
        <Box sx={{position:'fixed', marginTop: '20vh', zIndex: '900', left:'50%', transform: 'translate(-50%)'}}>            
            <Alert severity={alertContext.type}  action={alertContext.action}
            >
                <IconButton onClick={()=>alertContext.clear()}><CloseIcon></CloseIcon></IconButton>
                <AlertTitle>{alertContext.titleText}</AlertTitle>
                {alertContext.bodyText}
            </Alert>
        </Box>        
    )
}

export default MyAlert;