import React from 'react';
import Draggable from 'react-draggable';
import Fab from '@mui/material/Fab';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';

const DraggableFab = (props) => {
  const dialogContent = props.dialogContent ?? <Box></Box>;
  const [dialogOpen, setDialogOpen] = useState(false);
  const onStart = (e) => {
    // Prevent event propagation to avoid interference with other elements
    e.stopPropagation();
  };

  const handleFabClick = () => {
    setDialogOpen(true);
  };

  const handleFabTouchEnd = () => {
    // Delay closing the dialog after touch end to allow click event on touch devices
    setTimeout(() => {
      setDialogOpen(true);
    }, 300);
  };

  return (
    <Box>
      <Box>
        <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
          {dialogContent}
        </Dialog>
      </Box>
      <Draggable onStart={onStart}>
        <Tooltip title='Need help?'>
          <Fab
            onClick={handleFabClick}
            onTouchEnd={handleFabTouchEnd}
            sx={{
              position: 'fixed',
              top: '20vh',
              right: '5vh',
            }}
            color='secondary'
            size='medium'
          >
            <QuestionMarkIcon color='primary' />
          </Fab>
        </Tooltip>
      </Draggable>
    </Box>
  );
};

export default DraggableFab;