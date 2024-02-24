import React from 'react';
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
  RadialLinearScale,
} from 'chart.js';
import { Pie, Bar, Radar, Doughnut, Scatter, Bubble } from 'react-chartjs-2';
import { Box, Typography, Button } from '@mui/material';
import { useState, useRef } from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import { Download } from '@mui/icons-material';
import SelectionDisplay from './SelectionDisplay';
import domtoimage from 'dom-to-image';

ChartJS.register(
  ArcElement,
  RadialLinearScale,
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

export default function SubFeatureChart(props) {
  // some duplication with MainFeatureChart - will see how to solve this
  
  const [enableUndo, setEnableUndo] = useState(false);
  const componentRef = useRef();
  const selection = props.selection;
  const removeChartElementFromData = (event, chartElements) => {
    if (chartElements.length > 0) {
      const index = chartElements[0].index;
      const newData = { ...data };
      newData.datasets[0].data.splice(index, 1);
      newData.datasets[0].backgroundColor.splice(index, 1);
      newData.datasets[0].borderColor.splice(index, 1);
      newData.labels.splice(index, 1);
      setData(newData);
      setEnableUndo(true);
    }
  };
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
  const stats = props.data;
  const chartType = props.chartType;
  const dimensions = props.dimensions;
  const correlateAndAddR = (data, minRadius = 5, maxRadius = 20) => {
    const xMean = data.reduce((acc, d) => acc + d.x, 0) / data.length;
    const yMean = data.reduce((acc, d) => acc + d.y, 0) / data.length;

    // Calculate the correlation coefficient
    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;
    for (const d of data) {
      numerator += (d.x - xMean) * (d.y - yMean);
      denominator1 += (d.x - xMean) ** 2;
      denominator2 += (d.y - yMean) ** 2;
    }
    const correlation = numerator / Math.sqrt(denominator1 * denominator2);

    // Assign a radius to each object based on the correlation
    for (const d of data) {
      if (correlation > 0) {
        d.r = Math.abs(d.y - yMean) * correlation;
      } else {
        d.r = Math.abs(d.x - xMean) * Math.abs(correlation);
      }
    }
    for (const d of data) {
      d.r =
        minRadius +
        (maxRadius - minRadius) * (d.r / Math.max(...data.map((d) => d.r)));
    }
  };

  const generate1DDataFromStats = (stats) => {
    let data = {};
    data.title = stats.featureName;
    const statArray = Object.entries(stats.statistics);
    statArray.sort((a,b) => a[1] - b[1]);
    data.labels = statArray.map((sa) => sa[0]);
    data.labels = data.labels.map((s) => parseInt(s,10))    
    data.datasets = [
      {
        label: data.title,
        data: statArray.map((sa) => sa[1]),
        backgroundColor: [
          'rgba(238, 77, 131, 0.6)',
          'rgba(92, 208, 239, 0.6)',
          'rgba(243, 200, 70, 0.6)',
          'rgba(122, 205, 157, 0.6)',
          'rgba(154, 137, 181, 0.6)',
          'rgba(252, 115, 95, 0.6)',
          'rgba(72, 52, 61, 0.6)',
          'rgba(255, 163, 128, 0.6)',
          'rgba(70, 90, 106, 0.6)',
          'rgba(204, 102, 119, 0.6)',
          'rgba(78, 121, 146, 0.6)',
          'rgba(191, 166, 196, 0.6)',
          'rgba(141, 215, 191, 0.6)',
          'rgba(223, 202, 149, 0.6)',
          'rgba(255, 215, 179, 0.6)',
          'rgba(76, 97, 103, 0.6)',
          'rgba(218, 181, 203, 0.6)',
          'rgba(114, 114, 114, 0.6)',
          'rgba(224, 149, 106, 0.6)',
          'rgba(118, 141, 184, 0.6)',
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
      },
    ];
    return data;
  };

  const generate2DDataFromStats = (stats) => {
    let data = {};
    data.title = stats.featureName;
    data.labels = Object.keys(stats.statistics).map((key, index) => key);
    data.datasets = [
      {
        label: data.title,
        data: stats.statistics.x.map((xValue, index) => ({
          x: xValue,
          y: stats.statistics.y[index],
        })),
        backgroundColor: ['rgba(238, 77, 131, 0.6)'],
        borderWidth: 1,
      },
    ];
    correlateAndAddR(data.datasets[0].data);
    return data;
  };

  const title =
    dimensions === 1
      ? stats.featureName
      : `${stats.featureX} / ${stats.secondFeature}`;
  const [data, setData] = useState(
    dimensions === 1
      ? generate1DDataFromStats(stats)
      : generate2DDataFromStats(stats)
  );

  const twoDOption = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: stats.featureX,
          color: '#555',
          font: {
            size: 17,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: stats.secondFeature,
          color: '#555',
          font: {
            size: 17,
          },
        },
      },
    },
  };

  const chartComponents = {
    pie: (
      <Pie
        data={data}
        options={{
          plugins: {
            legend: {
              display: true,
              position: 'top',
              onClick: () => {},
            },
          },
          onClick: removeChartElementFromData,
        }}
      />
    ),

    bar: (
      <Bar
        data={data}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          onClick: removeChartElementFromData,
        }}
      />
    ),

    radar: (
      <Radar
        data={data}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          onClick: removeChartElementFromData,
        }}
      />
    ),

    doughnut: (
      <Doughnut
        data={data}
        options={{
          plugins: {
            legend: {
              display: true,
              position: 'top',
              onClick: () => {},
            },
          },
          onClick: removeChartElementFromData,
        }}
      />
    ),

    scatter: <Scatter data={data} options={twoDOption} />,

    bubble: <Bubble data={data} options={twoDOption} />,
  };

  const ChartComponent = chartComponents[chartType];

  return (
    <div ref={componentRef}>
    <Box display={'grid'} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>    
    <Box>
    <Typography
    color={'primary'}
        sx={{
          fontWeight: 700,
          fontSize: { xs: 'medium', md: 'x-large' },
          marginBottom: '2vh'
        }}
      >
        {title}
      </Typography>
      {ChartComponent}      
      {dimensions === 1 ? (
        <Button
          sx={{marginTop:'2vh'}}
          variant='outlined'
          disabled={!enableUndo}
          onClick={() => {
            setData(generate1DDataFromStats(stats));
            setEnableUndo(false);
          }}
        >
          <UndoIcon />
        </Button>
      ) : null}
      <Button
        sx={{marginTop:'2vh'}}
        variant='outlined'
        onClick={exportComponentAsImage}>
        <Download></Download>
      </Button>
    </Box>
    {selection ? <SelectionDisplay data={selection}></SelectionDisplay> : null}
    </Box>
    </div>
  );
}
