import React, { useState, useEffect } from 'react';
import image from './../extensions/images/dna-for-loading.svg';
import { Typography } from '@mui/material';

const DNALoading = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 3) {
          return '';
        } else {
          return prevDots + '.';
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .spinning-dna {
          animation: spin 2s linear infinite;
        }
      `}</style>
      <div style={{ marginBottom: 10 }}>
        <img width={'50vw'} alt='' className={'spinning-dna'} src={image} />
      </div>
      <div>
        <Typography
          color={'primary'}
          sx={{
            fontWeight: 700,
            fontSize: { xs: 'small', md: 'small' },
          }}
        >
          just a second{dots}
        </Typography>
      </div>
    </div>
  );
};

export default DNALoading;
