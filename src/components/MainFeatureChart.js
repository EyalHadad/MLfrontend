import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Filler,
  PointElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Box,
  Select,
  MenuItem,
  Typography,
  Button,
  Dialog,
} from '@mui/material';
import CommonStrings from '../classes/CommonStrings';
import { useState } from 'react';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useTheme } from '@emotion/react';
import UndoIcon from '@mui/icons-material/Undo';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { Download } from '@mui/icons-material';
import { useRef } from 'react';
import domtoimage from 'dom-to-image';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
);

export function MainFeatureChart(props) {
  const componentRef = useRef();
  const theme = useTheme();
  const stats = props.stats;
  const [display, setDisplay] = useState('Both');
  const handleChange = (event) => {
    setDisplay(event.target.value);
  };
  const [enableUndo, setEnableUndo] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const exportComponentAsImage = () => {
    const node = componentRef.current;

    domtoimage.toPng(node)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'component.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error exporting component as image:', error);
      });
  };
  const removeChartElementFromData = (event, chartElements) => {
    if (chartElements.length > 0) {
      const index = chartElements[0].index;
      const newData = { ...data };
      newData.datasets[0].data.splice(index, 1);
      newData.datasets[0].backgroundColor.splice(index, 1);
      newData.datasets[0].borderColor.splice(index, 1);
      newData.labels.splice(index, 1);
      setChartData(newData);
      setEnableUndo(true);
    }
  };
  const generateDataFromStats = (stats) => {
    let data = {};
    data.title = stats.featureName;
    const statArray = Object.entries(stats.statistics);
    statArray.sort((a,b) => a[1] - b[1]);
    data.labels = statArray.map((sa) => sa[0]);
    data.datasets = [
      {
        label: data.title,
        data: statArray.map((sa) => sa[1]),
        backgroundColor: [
          'rgba(238, 77, 131, 0.35)',
          'rgba(92, 208, 239, 0.35)',
          'rgba(243, 200, 70, 0.35)',
          'rgba(122, 205, 157, 0.35)',
          'rgba(154, 137, 181, 0.35)',
          'rgba(252, 115, 95, 0.35)',
          'rgba(72, 52, 61, 0.35)',
          'rgba(255, 163, 128, 0.35)',
          'rgba(70, 90, 106, 0.35)',
          'rgba(204, 102, 119, 0.35)',
          'rgba(78, 121, 146, 0.35)',
          'rgba(191, 166, 196, 0.35)',
          'rgba(141, 215, 191, 0.35)',
          'rgba(223, 202, 149, 0.35)',
          'rgba(255, 215, 179, 0.35)',
          'rgba(76, 97, 103, 0.35)',
          'rgba(218, 181, 203, 0.35)',
          'rgba(114, 114, 114, 0.35)',
          'rgba(224, 149, 106, 0.35)',
          'rgba(118, 141, 184, 0.35)',
        ],
        borderColor: [
          'rgba(238, 77, 131, 1)',
          'rgba(92, 208, 239, 1)',
          'rgba(243, 200, 70, 1)',
          'rgba(122, 205, 157, 1)',
          'rgba(154, 137, 181, 1)',
          'rgba(252, 115, 95, 1)',
          'rgba(72, 52, 61, 1)',
          'rgba(255, 163, 128, 1)',
          'rgba(70, 90, 106, 1)',
          'rgba(204, 102, 119, 1)',
          'rgba(78, 121, 146, 1)',
          'rgba(191, 166, 196, 1)',
          'rgba(141, 215, 191, 1)',
          'rgba(223, 202, 149, 1)',
          'rgba(255, 215, 179, 1)',
          'rgba(76, 97, 103, 1)',
          'rgba(218, 181, 203, 1)',
          'rgba(114, 114, 114, 1)',
          'rgba(224, 149, 106, 1)',
          'rgba(118, 141, 184, 1)',
        ],
        borderWidth: 1,
        xAxisId: 'x',
      },
    ];    
    return data;
  };
  const [data, setChartData] = useState(generateDataFromStats(stats));
  useEffect(() => {
    setChartData(generateDataFromStats(stats));
    setEnableUndo(false);
  }, [stats]);
  const pie = (data) => (
    <Pie
      data={data}
      options={{
        plugins: {
          legend: {
            display: true,
            position: 'right',
            onClick: () => {},
            labels: {
              font: {
                size: 8,
              },
            },
          },
        },
        onClick: removeChartElementFromData,
        duration: 1500,
        resizeDelay: 500,
      }}
    />
  );
  const bar = (data) => (
    <Bar
      data={data}
      options={{
        onClick: removeChartElementFromData,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 90,
              minRotation: 85,
              autoSkip: false,
            },
          },
        },
        animation: {
          duration: 2000,
          easing: 'easeInElastic',
          resizeDelay: 500,
        },
      }}
    />
  );
  const title =
    CommonStrings.mappingStrings[`${stats.featureName}Map`] ??
    stats.featureName;
  return (
    <div ref={componentRef}>
    <Box>
      <Typography
        color={'primary'}
        sx={{
          fontWeight: 700,
          fontSize: { xs: 'medium', md: 'x-large' },
        }}
      >
        {title}
      </Typography>

      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={display}
        label='Display'
        onChange={handleChange}
        size='small'
        sx={{ backgroundColor: theme.palette.secondary.dark }}
      >
        <MenuItem value={'Both'}>
          <PieChartIcon />
          <BarChartIcon />
        </MenuItem>
        <MenuItem value={'Pie'}>
          <PieChartIcon />
        </MenuItem>
        <MenuItem value={'Bar'}>
          <BarChartIcon />
        </MenuItem>
      </Select>

      {display === 'Both' || display === 'Pie' ? pie(data) : null}

      {display === 'Both' || display === 'Bar' ? bar(data) : null}

      <Dialog
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            border: '2px solid #000000',
          },
        }}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth={'100vw'}
      >
        <Box marginLeft={{xs:'50%', md: '90%'}}>
          <Button
            variant='outlined'
            onClick={exportComponentAsImage}>
            <Download></Download>
          </Button>
          <Button variant='outlined' onClick={() => setDialogOpen(false)}>
            <CloseFullscreenIcon></CloseFullscreenIcon>
          </Button>
          <Button
            variant='outlined'
            disabled={!enableUndo}
            onClick={() => {
              setChartData(generateDataFromStats(stats));
              setEnableUndo(false);
            }}
          >
            <UndoIcon />
          </Button>
        </Box>
        <Box sx={{ maxWidth: {xs: '100%', md: '50%'} }}>
          <Box
            display={'grid'}
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              xl: 'repeat(2, 1fr)',
            }}
            alignItems={'center'}
            justifyItems={'center'}
          >
            {display === 'Both' || display === 'Pie' ? pie(data) : null}

            {display === 'Both' || display === 'Bar' ? bar(data) : null}
          </Box>
        </Box>
      </Dialog>
      <Button
        onClick={exportComponentAsImage}>
        <Download></Download>
      </Button>
      <Button onClick={() => setDialogOpen(true)}>
        <OpenInFullIcon></OpenInFullIcon>
      </Button>
      <Button
        disabled={!enableUndo}
        onClick={() => {
          setChartData(generateDataFromStats(stats));
          setEnableUndo(false);
        }}
      >
        <UndoIcon />
      </Button>      
    </Box>
    </div>
  );
}
